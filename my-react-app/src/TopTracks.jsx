import { useEffect, useState } from "react";
import { getMyTopTracks } from "./spotifyApi";

export default function TopTracks() {
  const [tracks, setTracks] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyTopTracks({ limit: 5, timeRange: "medium_term" });
        setTracks(data.items || []);
      } catch (e) {
        setErr(e.message ?? String(e));
      }
    })();
  }, []);

  if (err) return <div>Error: {err}</div>;

  return (
    <div>
      <h2>My Top 5 Tracks</h2>
      <ol>
        {tracks.map((t) => (
          <li key={t.id} style={{ marginBottom: 12 }}>
            <div>
              <b>{t.name}</b> — {t.artists.map((a) => a.name).join(", ")}
            </div>
            {t.album?.images?.[2]?.url && (
              <img src={t.album.images[2].url} alt="" />
            )}
            <div>
              <a href={t.external_urls.spotify} target="_blank" rel="noreferrer">
                Open in Spotify
              </a>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}