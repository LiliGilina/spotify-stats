// src/spotifyApi.js
export async function getMyTopTracks({ limit = 5, timeRange = "medium_term" } = {}) {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) throw new Error("No access token. Login first.");

  const url = new URL("https://api.spotify.com/v1/me/top/tracks");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("time_range", timeRange);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Top tracks failed: ${res.status} ${txt}`);
  }

  return res.json(); // items[] 
}