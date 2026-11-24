const { createHash, createHmac, randomBytes } = require("node:crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OAuthLoginCode = require("../models/OAuthLoginCode");
const { loginResponse } = require("./authController");
const { normalizeEmail, isValidEmail } = require("../utils/email");

const providers = new Map(Object.entries({
  google: {
    authorize: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    scope: "openid email profile",
  },
  github: {
    authorize: "https://github.com/login/oauth/authorize",
    token: "https://github.com/login/oauth/access_token",
    scope: "read:user user:email",
  },
}));

const randomToken = () => randomBytes(32).toString("base64url");
const digest = (value) => createHash("sha256").update(value).digest("base64url");
const isToken = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);
const publicApi = () => (process.env.PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const clientLogin = () => new URL("/login", process.env.CLIENT_URL || "http://localhost:5173");
const transactionKey = () => createHmac("sha256", process.env.JWT_SECRET).update("devmatch-oauth-state").digest();

function configuration(provider) {
  const config = providers.get(provider);
  if (!config) return null;
  const clientId = process.env[provider.toUpperCase() + "_CLIENT_ID"];
  const clientSecret = process.env[provider.toUpperCase() + "_CLIENT_SECRET"];
  if (!clientId || !clientSecret) return null;
  return { ...config, clientId, clientSecret, callback: `${publicApi()}/api/auth/oauth/${provider}/callback` };
}

function cookieOptions(provider) {
  return {
    path: `/api/auth/oauth/${provider}/callback`,
    httpOnly: true,
    sameSite: "lax",
    secure: publicApi().startsWith("https:"),
  };
}

function redirectToLogin(res, params) {
  const url = clientLogin();
  url.hash = new URLSearchParams(params).toString();
  return res.set("Cache-Control", "no-store").redirect(url.href);
}

function redirectToProfile(res, params) {
  const url = new URL("/student/profile", clientLogin());
  url.hash = new URLSearchParams(params).toString();
  return res.set("Cache-Control", "no-store").redirect(url.href);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, { ...options, redirect: "error", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Provider request failed");
  return response.json();
}

async function getIdentity(provider, config, code, verifier) {
  const { access_token: accessToken } = await requestJson(config.token, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      code_verifier: verifier,
      redirect_uri: config.callback,
      grant_type: "authorization_code",
    }),
  });
  if (!accessToken) throw new Error("Provider returned no access token");

  const options = { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } };
  if (provider === "google") {
    const profile = await requestJson("https://openidconnect.googleapis.com/v1/userinfo", options);
    return {
      id: profile.sub,
      email: profile.email_verified === true ? profile.email : undefined,
      hostedDomain: profile.hd,
      name: profile.name,
    };
  }

  const [profile, emails] = await Promise.all([
    requestJson("https://api.github.com/user", options),
    requestJson("https://api.github.com/user/emails", options),
  ]);
  return {
    id: profile.id,
    email: emails.find((email) => email.primary && email.verified)?.email,
    name: profile.name || profile.login,
    login: profile.login,
  };
}

function start(req, res) {
  const { provider } = req.params;
  const config = configuration(provider);
  const { challenge, role } = req.query;
  const linking = provider === "github" && req.query.intent === "connect";
  if (!config) return linking ? redirectToProfile(res, { githubError: "unavailable" }) : redirectToLogin(res, { oauthError: "unavailable" });
  if (!isToken(challenge) || !["student", "recruiter"].includes(role)) {
    return redirectToLogin(res, { oauthError: "failed" });
  }

  const state = randomToken();
  const verifier = randomToken();
  const transaction = jwt.sign({ state, verifier, challenge, role, provider, linking }, transactionKey(), {
    audience: "devmatch-oauth",
    expiresIn: "10m",
  });
  const url = new URL(config.authorize);
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callback,
    response_type: "code",
    prompt: "select_account",
    scope: config.scope,
    state,
    code_challenge: digest(verifier),
    code_challenge_method: "S256",
  });
  return res.set("Cache-Control", "no-store")
    .cookie("devmatch_oauth", transaction, { ...cookieOptions(provider), maxAge: 600000 })
    .redirect(url.href);
}

async function callback(req, res) {
  const { provider } = req.params;
  const config = configuration(provider);
  if (!config) return redirectToLogin(res, { oauthError: "unavailable" });

  const cookie = req.headers.cookie?.match(/(?:^|;\s*)devmatch_oauth=([A-Za-z0-9_.-]+)/)?.[1];
  res.clearCookie("devmatch_oauth", cookieOptions(provider));

  let linking = false;
  try {
    const transaction = jwt.verify(cookie, transactionKey(), {
      audience: "devmatch-oauth",
      algorithms: ["HS256"],
    });
    linking = transaction.linking === true && provider === "github";
    if (transaction.provider !== provider || transaction.state !== req.query.state ||
        typeof req.query.code !== "string") {
      return linking ? redirectToProfile(res, { githubError: "failed" }) : redirectToLogin(res, { oauthError: "failed" });
    }

    const identity = await getIdentity(provider, config, req.query.code, transaction.verifier);
    const email = normalizeEmail(identity.email);
    if (!identity.id) return redirectToLogin(res, { oauthError: "failed" });
    const oauthIdentity = `${provider}:${identity.id}`;
    if (linking) {
      const code = randomToken();
      await OAuthLoginCode.create({
        _id: digest(code),
        browserChallenge: transaction.challenge,
        linkIdentity: oauthIdentity,
        linkLogin: identity.login,
        expiresAt: new Date(Date.now() + 60_000),
      });
      return redirectToProfile(res, { githubCode: code });
    }
    // Wait for the unique email and provider indexes before creating or linking accounts.
    await User.init();
    const providerField = provider === "google" ? "googleIdentity" : "githubIdentity";
    const identityValue = provider === "github" ? [oauthIdentity] : oauthIdentity;
    const identityUpdate = { [providerField]: identityValue };
    if (provider === "github" && identity.login) {
      identityUpdate[`githubAccountNames.${identity.id}`] = identity.login;
    }
    const identityFilter = { $or: [{ oauthIdentity }, { [providerField]: oauthIdentity }] };
    let user = await User.findOne(identityFilter);
    if (!user) {
      if (!isValidEmail(email)) return redirectToLogin(res, { oauthError: "email" });
      const canLinkByEmail = provider === "github" || email.endsWith("@gmail.com") || Boolean(identity.hostedDomain);
      try {
        user = await User.findOneAndUpdate(
          { [providerField]: oauthIdentity },
          { $setOnInsert: { ...identityUpdate, name: identity.name || email.split("@")[0], email, role: transaction.role } },
          { upsert: true, returnDocument: "after" },
        );
      } catch (error) {
        if (error.code !== 11000) throw error;
        user = await User.findOne(identityFilter);
        if (!user && canLinkByEmail) {
          user = await User.findOneAndUpdate(
            { email, [providerField]: { $exists: false }, oauthIdentity: { $not: new RegExp(`^${provider}:`) } },
            { $set: identityUpdate },
            { returnDocument: "after" },
          );
        }
        if (!user) return redirectToLogin(res, { oauthError: canLinkByEmail ? "linked" : "verify" });
      }
    }

    const code = randomToken();
    await OAuthLoginCode.create({
      _id: digest(code),
      browserChallenge: transaction.challenge,
      user: user._id,
      expiresAt: new Date(Date.now() + 60000),
    });
    return redirectToLogin(res, { oauthCode: code });
  } catch (error) {
    console.warn("OAuth sign-in failed:", provider, error.name);
    return linking ? redirectToProfile(res, { githubError: "failed" }) : redirectToLogin(res, { oauthError: "failed" });
  }
}

async function exchange(req, res) {
  res.set("Cache-Control", "no-store");
  const { code, verifier } = req.body || {};
  if (!isToken(code) || !isToken(verifier)) {
    return res.status(400).json({ message: "Invalid sign-in code." });
  }

  const loginCode = await OAuthLoginCode.findOneAndDelete({
    _id: digest(code),
    browserChallenge: digest(verifier),
    linkIdentity: { $exists: false },
    expiresAt: { $gt: new Date() },
  });
  const user = loginCode && await User.findById(loginCode.user).select("+passwordVersion");
  if (!user) return res.status(401).json({ message: "Sign-in expired. Please try again." });
  return res.json(loginResponse(user));
}

async function connectGithub(req, res) {
  res.set("Cache-Control", "no-store");
  const { code, verifier } = req.body || {};
  if (!isToken(code) || !isToken(verifier)) {
    return res.status(400).json({ message: "Invalid GitHub connection code." });
  }
  const record = await OAuthLoginCode.findOneAndDelete({
    _id: digest(code), browserChallenge: digest(verifier),
    expiresAt: { $gt: new Date() }, linkIdentity: { $exists: true },
  });
  if (!record) return res.status(400).json({ message: "GitHub connection expired. Try again." });

  const identity = record.linkIdentity;
  if (!/^github:\d+$/.test(identity)) return res.status(400).json({ message: "Invalid GitHub identity." });
  await User.init();
  const existing = await User.findOne({ $or: [{ oauthIdentity: identity }, { githubIdentity: identity }] });
  if (existing && String(existing._id) !== req.user.id) {
    return res.status(409).json({ message: "That GitHub account is already connected to another DevMatch account." });
  }

  try {
    // Existing installations may have stored the first identity as a scalar.
    const identities = {
      $cond: [
        { $isArray: "$githubIdentity" },
        "$githubIdentity",
        { $cond: [{ $eq: [{ $type: "$githubIdentity" }, "string"] }, ["$githubIdentity"], []] },
      ],
    };
    const updates = { githubIdentity: { $setUnion: [identities, [identity]] } };
    if (record.linkLogin) updates[`githubAccountNames.${identity.slice(7)}`] = { $literal: record.linkLogin };
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      [{ $set: updates }],
      { updatePipeline: true },
    );
    if (user) return res.json({ success: true });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  return res.status(409).json({ message: "This GitHub account could not be connected because a connection already exists." });
}

module.exports = { start, callback, exchange, connectGithub };

