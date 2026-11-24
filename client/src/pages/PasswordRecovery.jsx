import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/axios";
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import PasswordInput from "../components/auth/PasswordInput";

const inputClass = "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500";

export default function PasswordRecovery({ reset = false }) {
  const location = useLocation();
  const token = new URLSearchParams(location.hash.slice(1)).get("token");
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = reset
        ? await API.post("/auth/reset-password", { token, password })
        : await API.post("/auth/forgot-password", { email });
      if (reset) {
        setPassword("");
        window.history.replaceState(window.history.state, "", location.pathname);
      }
      setMessage(data.message);
    } catch (failure) {
      setError(failure.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="text-2xl font-bold text-white">{reset ? "Set a new password" : "Forgot your password?"}</h2>
        {message ? (
          <p role="status" className="mt-4 text-zinc-300">{message}</p>
        ) : reset && !token ? (
          <p className="mt-4 text-zinc-300">Open the link from your password reset email or request a new one.</p>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <label htmlFor="recovery-field" className="block text-sm font-medium text-zinc-300">
              {reset ? "New password" : "Email"}
            </label>
            {reset ? (
              <PasswordInput id="recovery-field" className={inputClass} autoComplete="new-password"
                minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
            ) : (
              <input id="recovery-field" className={inputClass} type="email" autoComplete="email"
                maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} required />
            )}
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
              {busy ? "Please wait…" : reset ? "Update password" : "Send reset link"}
            </button>
          </form>
        )}
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-indigo-400">
          <Link to="/login" className="hover:text-indigo-300">Back to sign in</Link>
          {reset && !message && <Link to="/forgot-password" className="hover:text-indigo-300">Request a new link</Link>}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
