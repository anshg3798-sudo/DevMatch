import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginDestination } from "./loginDestination";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { GoogleIcon, GitHubIcon } from "./ProviderIcons";

const verifierKey = "devmatch.oauth.verifier";
const destinationKey = "devmatch.oauth.destination";
const errors = {
  unavailable: "This sign-in provider is unavailable. Try another sign-in method.",
  email: "Verify your primary email address with the provider and try again.",
  linked: "This DevMatch account is already linked to a different profile from this provider.",
  verify: "Google can’t confirm current ownership of this email. Use Forgot Password to verify access to your DevMatch email.",
  failed: "Social sign-in could not be completed. Please try again.",
};

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

const SocialLoginButtons = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [role, setRole] = useState(state?.requested === "/recruiter/search" ? "recruiter" : "student");
  const [redirect] = useState(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const code = params.get("oauthCode");
    const errorKey = params.get("oauthError");
    if (!code && !errorKey) return null;

    const verifier = sessionStorage.getItem(verifierKey);
    if (errorKey || !verifier) {
      return { error: Object.hasOwn(errors, errorKey) ? errors[errorKey] : errors.failed };
    }
    return { code, verifier, requested: sessionStorage.getItem(destinationKey) };
  });
  const [busy, setBusy] = useState(Boolean(redirect?.code));
  const [error, setError] = useState(redirect?.error || "");
  const handledRedirect = useRef(false);

  useEffect(() => {
    if (!redirect || handledRedirect.current) return;

    handledRedirect.current = true;
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    sessionStorage.removeItem(verifierKey);
    sessionStorage.removeItem(destinationKey);

    if (redirect.error) return;
    API.post("/auth/oauth/exchange", { code: redirect.code, verifier: redirect.verifier })
      .then(({ data }) => {
        login(data.user, data.token);
        navigate(loginDestination(data.user.role, redirect.requested), { replace: true });
      })
      .catch((failure) => setError(failure.response?.data?.message || errors.failed))
      .finally(() => setBusy(false));
  }, [login, navigate, redirect]);

  async function continueWith(provider) {
    setBusy(true);
    setError("");
    try {
      const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
      const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
      sessionStorage.setItem(verifierKey, verifier);
      sessionStorage.setItem(destinationKey, state?.requested || "");
      const params = new URLSearchParams({ role, challenge: base64url(new Uint8Array(hash)) });
      window.location.assign(API.getUri({ url: `/auth/oauth/${provider}/start`, params }));
    } catch {
      setError(errors.failed);
      setBusy(false);
    }
  }

  return (
    <>
      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="mx-4 text-sm text-zinc-500">OR</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <div className="space-y-3">
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <label className="block text-sm text-zinc-300" htmlFor="social-role">Role for new accounts</label>
        <select
          id="social-role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          disabled={busy}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
        >
          <option value="student">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="button" disabled={busy} onClick={() => continueWith("google")} className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 py-3 font-medium text-white transition hover:border-indigo-500 disabled:opacity-50">
          <GoogleIcon />
          Continue with Google
        </button>

        <button type="button" disabled={busy} onClick={() => continueWith("github")} className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 py-3 font-medium text-white transition hover:border-indigo-500 disabled:opacity-50">
          <GitHubIcon />
          Continue with GitHub
        </button>
      </div>
    </>
  );
};

export default SocialLoginButtons;
