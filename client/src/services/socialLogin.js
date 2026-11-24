import API from "../api/axios";

export const verifierKey = "devmatch.oauth.verifier";

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export async function startSocialLogin(provider, role, { link = false } = {}) {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = base64url(new Uint8Array(hash));
  const params = new URLSearchParams({ role, challenge });
  if (link) {
    const { data } = await API.post("/auth/oauth/github/link", { challenge });
    params.set("ticket", data.ticket);
  }
  sessionStorage.setItem(verifierKey, verifier);
  window.location.assign(API.getUri({ url: `/auth/oauth/${provider}/start`, params }));
}

