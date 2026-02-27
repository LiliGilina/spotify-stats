// src/spotifyAuth.js
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const SCOPES = ["user-top-read"]; // за /me/top/tracks 

function base64UrlEncode(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256(plain) {
  const enc = new TextEncoder().encode(plain);
  return crypto.subtle.digest("SHA-256", enc);
}

function randomString(length = 64) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (let i = 0; i < values.length; i++) out += charset[values[i] % charset.length];
  return out;
}

export async function startSpotifyLogin() {
  const codeVerifier = randomString(64);
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES.join(" "),
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.assign(`${AUTH_ENDPOINT}?${params.toString()}`);
}

// размяна на "code" за access_token (PKCE)
export async function exchangeCodeForToken(code) {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) throw new Error("Missing code_verifier (PKCE).");

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${txt}`);
  }

  return res.json(); // { access_token, token_type, scope, expires_in, refresh_token? } 
}