import { useEffect, useState } from "react";
import { getMyTopArtists } from "./spotifyApi";

export default function TopGenres() {
  const [genres, setGenres] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // повече артисти = по-стабилни жанрове
        const data = await getMyTopArtists({ limit: 50, time_range: "medium_term" });
        const items = data.items || [];

        const counts = new Map();
        for (const artist of items) {
          for (const g of artist.genres || []) {
            counts.set(g, (counts.get(g) || 0) + 1);
          }
        }

        const top = [...counts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        setGenres(top);
      } catch (e) {
        setErr(e.message ?? String(e));
      }
    })();
  }, []);

  if (err) return <div>Error: {err}</div>;

  return (
    <div>
      <h2>Top 5 Genres (from your Top Artists)</h2>
      {genres.length === 0 ? (
        <div>No genre data.</div>
      ) : (
        <ol>
          {genres.map((g) => (
            <li key={g.name}>
              <b>{g.name}</b> ({g.count})
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}