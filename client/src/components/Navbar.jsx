// sticky navbar with a burger menu on mobile
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
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

  // total items in the cart for the badge on the shopping list button
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* orange square logo - basket icon stacked above Carty text */}
        <Link to="/" className="navbar__brand-box">
          <img src="/shopping-basket-icon.svg" alt="Carty basket" className="navbar__brand-icon" />
          <span>Carty</span>
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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/meals">Meals</Link></li>
          <li><Link to="/price-comparison">Price Comparison</Link></li>

          {user && (
            // logged in - show profile and logout inside the burger too
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

          {/* mobile-only: sign up link inside burger menu */}
          {!user && (
            <li className="navbar__mobile-auth">
              <Link to="/register" className="navbar__signin-link">Sign up</Link>
            </li>
          )}
        </ul>

        {/* right-side actions - hidden on mobile (burger menu has them instead) */}
        <div className="navbar__actions">
          {user ? (
            // logged in - show the user's name as a profile link
            <Link to="/profile" className="navbar__user-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {user.name}
            </Link>
          ) : (
            // logged out - sign up link
            <Link to="/register" className="navbar__signup-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Sign up
            </Link>
          )}

          {/* shopping list button - always visible, shows cart item count */}
          <Link to="/shopping-cart" className="navbar__cart-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Shopping List
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </Link>
        </div>

      </div>
    </nav>
  );
}
