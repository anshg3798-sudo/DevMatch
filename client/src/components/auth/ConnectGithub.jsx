import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const storageKey = "devmatch.github.connect";
const encode = (bytes) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");

export default function ConnectGithub({ connected, onConnected }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const handled = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const code = params.get("githubCode");
    const failure = params.get("githubError");
    if ((!code && !failure) || !user?.id || handled.current) return;
    handled.current = true;
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    let pending;
    try {
      pending = JSON.parse(sessionStorage.getItem(storageKey));
      sessionStorage.removeItem(storageKey);
    } catch {
      setError("Couldn’t read the GitHub connection request. Try again.");
      return;
    }
    if (failure || pending?.userId !== user.id || !pending.verifier) {
      setError(failure === "unavailable" ? "GitHub sign-in is unavailable." : "Couldn’t connect to GitHub. Try again.");
      return;
    }
    setBusy(true);
    API.post("/auth/oauth/github/connect", { code, verifier: pending.verifier })
      .then(onConnected)
      .catch((failure) => setError(failure.response?.data?.message || "Couldn’t connect to GitHub. Try again."))
      .finally(() => setBusy(false));
  }, [user?.id, onConnected]);

  async function connect() {
    setBusy(true);
    setError("");
    try {
      const verifier = encode(crypto.getRandomValues(new Uint8Array(32)));
      const challenge = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
      sessionStorage.setItem(storageKey, JSON.stringify({ verifier, userId: user.id }));
      const params = new URLSearchParams({ challenge: encode(new Uint8Array(challenge)), intent: "connect", role: "student" });
      window.location.assign(API.getUri({ url: "/auth/oauth/github/start", params }));
    } catch {
      setError("Couldn’t start the GitHub connection. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-3">
        <button type="button" disabled={busy || !user?.id} onClick={connect}
          className="rounded-lg border border-indigo-400/30 px-3 py-2 text-sm text-indigo-200 hover:bg-indigo-400/10 disabled:opacity-50">
          {busy ? "Connecting…" : connected ? "Connect another GitHub account" : "Connect GitHub"}
        </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
