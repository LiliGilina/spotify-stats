import { Routes, Route, Navigate } from "react-router-dom";
import Callback from "./Callback.jsx";
import Home from "./Home.jsx";
import TopTracks from "./TopTracks.jsx";
import TopArtists from "./TopArtists.jsx";
import TopGenres from "./TopGenres.jsx";
import Nav from "./Nav.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const token = localStorage.getItem("spotify_access_token");

  return (
    <div style={{ padding: 16 }}>
      <h1>Spotify Stats</h1>
      {token && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />

        <Route
          path="/top/tracks"
          element={
            <RequireAuth>
              <TopTracks />
            </RequireAuth>
          }
        />
        <Route
          path="/top/artists"
          element={
            <RequireAuth>
              <TopArtists />
            </RequireAuth>
          }
        />
        <Route
          path="/top/genres"
          element={
            <RequireAuth>
              <TopGenres />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}