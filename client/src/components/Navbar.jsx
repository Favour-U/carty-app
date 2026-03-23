// sticky top navbar with a burger menu on mobile
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // close the burger menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* logo */}
        <Link to="/" className="navbar__brand">
          🛒 Carty
        </Link>

        {/* hamburger button - only visible on mobile */}
        <button
          className={`navbar__burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* nav links - centre links, collapse on mobile */}
        <ul className={`navbar__links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/">Plans</Link></li>
          <li><Link to="/">Price Compare</Link></li>
          <li><Link to="/">Stores</Link></li>
          <li><Link to="/">Community</Link></li>
          <li><Link to="/">Meals</Link></li>

          {user && (
            // logged in - show app links
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li>
                <button className="navbar__logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* mobile-only auth actions (shown inside burger menu) */}
          {!user && (
            <li className="navbar__mobile-auth">
              <Link to="/login" className="navbar__signin">Sign in</Link>
            </li>
          )}
        </ul>

        {/* right-side actions - hidden on mobile (inside burger menu instead) */}
        {!user && (
          <div className="navbar__actions">
            <button className="navbar__adfree">Go ad free?</button>
            <Link to="/login" className="navbar__signin">Sign in</Link>
          </div>
        )}

      </div>
    </nav>
  );
}
