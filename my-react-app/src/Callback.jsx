import { useEffect, useRef, useState } from "react";
import { exchangeCodeForToken } from "./spotifyAuth";

export default function Callback() {
  const ran = useRef(false);
  const [status, setStatus] = useState("Init…");
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        setStatus("Reading callback URL…");
        const url = new URL(window.location.href);

        const error = url.searchParams.get("error");
        if (error) throw new Error(`Spotify error: ${error}`);

        const code = url.searchParams.get("code");
        if (!code) throw new Error("Missing ?code= in callback URL.");

        setStatus("Exchanging code for token…");
        const token = await exchangeCodeForToken(code);

        setStatus("Saving token…");
        localStorage.setItem("spotify_access_token", token.access_token);
        if (token.refresh_token) {
          localStorage.setItem("spotify_refresh_token", token.refresh_token);
        }

        // махаме code от URL, за да не се повтаря при refresh
        setStatus("Cleaning URL…");
        window.history.replaceState({}, document.title, "/");

        // редирект към началната страница (по-сигурно от replaceState само)
        setStatus("Redirecting…");
        window.location.replace("/");
      } catch (e) {
        setErr(e?.message ?? String(e));
      }
    })();
  }, []);

  if (err) return <div>Auth error: {err}</div>;
  return <div>{status}</div>;
}