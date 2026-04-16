// shared footer  appears on every main page
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">

        {/* branding column */}
        <div className="footer__brand-col">
          <img src="/shopping-basket-icon.svg" alt="Carty basket" className="footer__basket-icon" />
          <span className="footer__brand-name">Carty</span>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <ul className="footer__links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recipes">Recipe</Link></li>
            <li><Link to="/price-comparison">Order</Link></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Support Us</h4>
          <ul className="footer__links">
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Help</h4>
          <ul className="footer__links">
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

      </div>

      {/* decorative orange circles at the bottom corners */}
      <div className="footer__circle footer__circle--left" />
      <div className="footer__circle footer__circle--right" />
    </footer>
  );
}
