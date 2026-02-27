import { useEffect, useState } from "react";
import { getMyTopArtists } from "./spotifyApi";

export default function TopArtists() {
  const [artists, setArtists] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyTopArtists({ limit: 5, time_range: "medium_term" });
        setArtists(data.items || []);
      } catch (e) {
        setErr(e.message ?? String(e));
      }
    })();
  }, []);

  if (err) return <div>Error: {err}</div>;

  return (
    <div>
      <h2>Top 5 Artists</h2>
      <ol>
        {artists.map((a) => (
          <li key={a.id} style={{ marginBottom: 10 }}>
            <b>{a.name}</b>
          </li>
        ))}
      </ol>
    </div>
  );
}