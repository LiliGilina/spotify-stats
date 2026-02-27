import { Link } from "react-router-dom";
import { startSpotifyLogin } from "./spotifyAuth";

export default function Home() {
  const token = localStorage.getItem("spotify_access_token");

  if (!token) {
    return (
      <div>
        <p>Login to see your top Spotify stats.</p>
        <button onClick={() => startSpotifyLogin()}>Login with Spotify</button>
      </div>
    );
  }

  return (
    <div>
      <p>Choose what to view:</p>
      <ul>
        <li><Link to="/top/tracks">Top 5 Tracks</Link></li>
        <li><Link to="/top/artists">Top 5 Artists</Link></li>
        <li><Link to="/top/genres">Top 5 Genres</Link></li>
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_refresh_token");
          localStorage.removeItem("spotify_code_verifier");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}