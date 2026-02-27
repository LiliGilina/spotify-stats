import { useEffect, useState } from "react";
import { getMyTopTracks } from "./spotifyApi";

export default function TopTracks() {
  const [tracks, setTracks] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyTopTracks({ limit: 5, time_range: "medium_term" });
        setTracks(data.items || []);
      } catch (e) {
        setErr(e.message ?? String(e));
      }
    })();
  }, []);

  if (err) return <div>Error: {err}</div>;

  return (
    <div>
      <h2>Top 5 Tracks</h2>
      <ol>
        {tracks.map((t) => (
          <li key={t.id} style={{ marginBottom: 10 }}>
            <b>{t.name}</b> — {t.artists.map((a) => a.name).join(", ")}
          </li>
        ))}
      </ol>
    </div>
  );
}