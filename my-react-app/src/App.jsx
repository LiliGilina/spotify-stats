import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("artists"); // 'artists', 'tracks' или 'genres'

  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPE = "user-top-read";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) getTokenWithCode(code);

    const storedToken = window.localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const getTokenWithCode = async (code) => {
    const codeVerifier = window.localStorage.getItem('code_verifier');
    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    };

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", payload);
      const resData = await response.json();
      if (resData.access_token) {
        window.localStorage.setItem("token", resData.access_token);
        setToken(resData.access_token);
        window.history.pushState({}, null, "/");
      }
    } catch (error) { console.error(error); }
  };

  const handleLogin = async () => {
    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);
    window.localStorage.setItem('code_verifier', verifier);
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });
    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
  };

  // ФУНКЦИЯ ЗА ВЗИМАНЕ НА ДАННИТЕ
  const getTopData = async (type) => {
    setDataType(type);
    try {
      // Винаги взимаме артисти, за да изчислим жанровете, ако типът е 'genres'
      const fetchType = type === 'genres' ? 'artists' : type;
      const response = await fetch(`https://api.spotify.com/v1/me/top/${fetchType}?limit=50&time_range=medium_term`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await response.json();

      if (type === 'genres') {
        calculateTopGenres(json.items);
      } else {
        setData(json.items || []);
      }
    } catch (error) { console.error(error); }
  };

  // ЛОГИКА ЗА ИЗЧИСЛЯВАНЕ НА ТОП ЖАНРОВЕ
  const calculateTopGenres = (artists) => {
    const genreCounts = {};
    artists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    // Превръщаме обекта в масив и сортираме
    const sortedGenres = Object.keys(genreCounts)
      .map(name => ({ name, count: genreCounts[name], type: 'genre' }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Взимаме топ 20

    setData(sortedGenres);
  };

  const logout = () => {
    setToken("");
    setData([]);
    window.localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="logo">Spotify<span>Stats</span></h1>
        {!token ? (
          <button className="login-button" onClick={handleLogin}>Login with Spotify</button>
        ) : (
          <button className="logout-button" onClick={logout}>Logout</button>
        )}
      </header>

      {token && (
        <div className="controls">
          <button className={`action-btn ${dataType === 'artists' ? 'active' : ''}`} onClick={() => getTopData('artists')}>Топ Артисти</button>
          <button className={`action-btn ${dataType === 'tracks' ? 'active' : ''}`} onClick={() => getTopData('tracks')}>Топ Песни</button>
          <button className={`action-btn ${dataType === 'genres' ? 'active' : ''}`} onClick={() => getTopData('genres')}>Топ Жанрове</button>
        </div>
      )}

      <div className="results-grid">
        {data.map((item, index) => (
          <div key={index} className={`card card-${dataType}`}>
            {dataType !== 'genres' && (
              <div className="image-container">
                <img src={item.type === 'artist' ? item.images?.[0]?.url : item.album?.images?.[0]?.url} alt={item.name} />
              </div>
            )}
            
            <div className="card-info">
              {dataType === 'genres' ? (
                <div className="genre-card">
                  <span className="rank">#{index + 1}</span>
                  <h4>{item.name}</h4>
                  <p>{item.count} артисти</p>
                </div>
              ) : (
                <>
                  <h4>{item.name}</h4>
                  <p className="subtext">
                    {item.type === 'artist' ? item.genres?.[0] : item.artists?.map(a => a.name).join(", ")}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ПОМОЩНИ ФУНКЦИИ (PKCE)
function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default App;