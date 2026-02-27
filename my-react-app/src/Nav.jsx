import { NavLink } from "react-router-dom";

export default function Nav() {
  const linkStyle = ({ isActive }) => ({
    marginRight: 12,
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <nav style={{ marginBottom: 16 }}>
      <NavLink to="/" style={linkStyle}>Home</NavLink>
      <NavLink to="/top/tracks" style={linkStyle}>Tracks</NavLink>
      <NavLink to="/top/artists" style={linkStyle}>Artists</NavLink>
      <NavLink to="/top/genres" style={linkStyle}>Genres</NavLink>
    </nav>
  );
}