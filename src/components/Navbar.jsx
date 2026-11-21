import { Link, NavLink } from 'react-router-dom'

export default function Navbar({ isLoggedIn = false }) {
  return (
    <nav aria-label="Main navigation">
      <Link to="/" className="navbar-logo">PlainSpeak</Link>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/terms">Terms</NavLink></li>
        <li><NavLink to="/submit">Submit a Term</NavLink></li>
        <li><NavLink to="/professionals">Professionals</NavLink></li>
        <li><NavLink to="/pricing">Pricing</NavLink></li>
      </ul>
      {isLoggedIn ? <NavLink to="/profile">Profile</NavLink> : <NavLink to="/login">Login</NavLink>}
    </nav>
  )
}
