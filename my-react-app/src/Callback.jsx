import { useEffect, useState } from "react";
import { exchangeCodeForToken } from "./spotifyAuth";

export default function Callback() {
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error) throw new Error(error);
        if (!code) throw new Error("Missing code in callback URL.");

        const token = await exchangeCodeForToken(code);
        localStorage.setItem("spotify_access_token", token.access_token);
        if (token.refresh_token) localStorage.setItem("spotify_refresh_token", token.refresh_token);

        // чист URL
        window.history.replaceState({}, document.title, "/");
      } catch (e) {
        setErr(e.message ?? String(e));
      }
    })();
  }, []);

  if (err) return <div>Auth error: {err}</div>;
  return <div>Logging in…</div>;
}