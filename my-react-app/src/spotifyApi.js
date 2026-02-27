async function spotifyFetch(path, params = {}) {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) throw new Error("No access token.");

  const url = new URL(`https://api.spotify.com/v1${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export function getMyTopTracks({ limit = 5, time_range = "medium_term" } = {}) {
  return spotifyFetch("/me/top/tracks", { limit, time_range });
}

export function getMyTopArtists({ limit = 5, time_range = "medium_term" } = {}) {
  return spotifyFetch("/me/top/artists", { limit, time_range });
}