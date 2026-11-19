export default function Navbar({ isLoggedIn = false }) {
  return (
    <nav>
      <a href="/" className="navbar-logo">PlainSpeak</a>

      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/terms">Terms</a></li>
        <li><a href="/submit">Submit a Term</a></li>
      </ul>

      {isLoggedIn ? (
        <a href="/profile">Profile</a>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}
