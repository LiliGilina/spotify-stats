import { startSpotifyLogin } from "./spotifyAuth";
import TopTracks from "./TopTracks";

export default function App() {
  const token = localStorage.getItem("spotify_access_token");

  return (
    <div style={{ padding: 16 }}>
      <h1>Spotify Top Tracks</h1>

      {!token ? (
        <button onClick={() => startSpotifyLogin()}>
          Login with Spotify
        </button>
      ) : (
        <>
          <button
            onClick={() => {
              localStorage.removeItem("spotify_access_token");
              localStorage.removeItem("spotify_refresh_token");
              localStorage.removeItem("spotify_code_verifier");
              window.location.reload();
            }}
          >
            Logout
          </button>
          <TopTracks />
        </>
      )}
    </div>
  );
}