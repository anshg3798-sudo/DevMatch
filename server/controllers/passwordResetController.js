const { createHash, randomBytes } = require("node:crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { normalizeEmail, isValidEmail } = require("../utils/email");

const digest = (token) => createHash("sha256").update(token).digest("hex");
const sentMessage = "If an account exists for that email, you’ll receive a password reset link shortly.";
const invalidMessage = "This reset link is invalid or has expired. Request a new one.";

async function requestReset(req, res) {
  res.set("Cache-Control", "no-store");
  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address." });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PASSWORD_RESET_EMAIL_FROM || process.env.SELECTION_EMAIL_FROM;
  if (!apiKey || !from) {
    return res.status(503).json({ message: "Password reset email is unavailable. Please try again later." });
  }

  const now = Date.now();
  const token = randomBytes(32).toString("base64url");
  const tokenDigest = digest(token);
  const url = new URL("/reset-password", process.env.CLIENT_URL || "http://localhost:5173");
  url.hash = new URLSearchParams({ token }).toString();
  const user = await User.findOneAndUpdate(
    {
      email,
      $or: [
        { passwordResetRequestedAt: { $exists: false } },
        { passwordResetRequestedAt: { $lte: new Date(now - 60_000) } },
      ],
    },
    { $set: {
      passwordResetRequestedAt: new Date(now),
      passwordResetDigest: tokenDigest,
      passwordResetExpiresAt: new Date(now + 30 * 60_000),
    } },
  );

  if (user) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [user.email],
          subject: "Reset your DevMatch password",
          text: `Set a new password for your DevMatch account using this link:\n\n${url.href}\n\nThis link expires in 30 minutes. If you didn't request a password reset, you can ignore this email.`,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) console.warn("Password reset email rejected:", response.status);
    } catch (error) {
      console.warn("Password reset email failed:", error.name);
    }
  }
  return res.json({ message: sentMessage });
}

async function resetPassword(req, res) {
  res.set("Cache-Control", "no-store");
  const { token, password } = req.body || {};
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return res.status(400).json({ message: invalidMessage });
  }
  if (typeof password !== "string" || password.trim().length < 6 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ message: "Use at least 6 characters and no more than 72 bytes." });
  }

  const filter = { passwordResetDigest: digest(token), passwordResetExpiresAt: { $gt: new Date() } };
  if (!await User.exists(filter)) return res.status(400).json({ message: invalidMessage });

  const passwordHash = await bcrypt.hash(password, 10);
  filter.passwordResetExpiresAt.$gt = new Date();
  const result = await User.updateOne(filter, {
    $set: { password: passwordHash, passwordVersion: randomBytes(16).toString("hex") },
    $unset: { passwordResetDigest: "", passwordResetExpiresAt: "", passwordResetRequestedAt: "" },
  });
  if (!result.modifiedCount) return res.status(400).json({ message: invalidMessage });
  return res.json({ message: "Password updated. Sign in with your new password." });
}

module.exports = { requestReset, resetPassword };
