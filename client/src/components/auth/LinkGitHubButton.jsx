import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { startSocialLogin } from "../../services/socialLogin";

export default function LinkGitHubButton() {
  const { user } = useAuth();
  const { state } = useLocation();
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState("");

  async function linkGitHub() {
    setLinking(true);
    setError("");
    try {
      await startSocialLogin("github", user.role, { link: true });
    } catch (failure) {
      setError(failure.response?.data?.message || "Could not start GitHub linking. Try again.");
      setLinking(false);
    }
  }

  return (
    <section className="mt-6 space-y-2">
      <button
        type="button"
        onClick={linkGitHub}
        disabled={linking}
        className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:border-indigo-500 disabled:opacity-50"
      >
        {linking ? "Opening GitHub…" : "Link GitHub sign-in"}
      </button>
      {state?.githubLinked && <p role="status" className="text-sm text-emerald-400">GitHub sign-in is linked.</p>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </section>
  );
}

