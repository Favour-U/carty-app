// the home/landing page - first thing visitors see
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

export default function Landing() {
  return (
    <div className="landing">

      {/* hero - dark background, bold headline */}
      <section className="hero">
        <div className="container hero__content">
          <h1 className="hero__title">
            Never pay full price for your<br />
            <span className="hero__highlight">weekly shop</span>
          </h1>
          <p className="hero__subtitle">
            Carty compares live prices from Asda, Tesco &amp; Morrisons, so you
            automatically get the cheapest basket every week. Average family saves £22 weekly.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn-primary">Find my weekly plan</Link>
            <Link to="/login" className="btn-outline btn-outline--white">See how it works</Link>
          </div>
        </div>
      </section>

      {/* how it works - 4 numbered steps with connecting orange line */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="how-it-works__title">How Carty works</h2>
          <div className="steps">

            <div className="step">
              <div className="step__number">1</div>
              <h3 className="step__title">Enter postcode</h3>
              <p className="step__desc">We load every supermarket near you with today's prices.</p>
            </div>

            <div className="step">
              <div className="step__number">2</div>
              <h3 className="step__title">Choose constraints</h3>
              <p className="step__desc">Family size, budget, dietary needs — pick what matters to you.</p>
            </div>

            <div className="step">
              <div className="step__number">3</div>
              <h3 className="step__title">Real-time price magic</h3>
              <p className="step__desc">We scan every store and auto-pick the cheapest option for every item.</p>
              <span className="step__note">Live comparison across 3 stores</span>
            </div>

            <div className="step">
              <div className="step__number">4</div>
              <h3 className="step__title">Get your plan</h3>
              <p className="step__desc">Daily meals + split shopping list. Ready in under 60 seconds.</p>
            </div>

          </div>
        </div>
      </section>

      {/* popular meal plans */}
      <section className="plans-preview">
        <div className="container">
          <div className="plans-preview__header">
            <h2 className="plans-preview__title">Popular meal plans</h2>
          </div>

          <div className="plans-preview__grid">

            <div className="plan-card">
              <div className="plan-card__image">🍽️</div>
              <div className="plan-card__body">
                <h3 className="plan-card__title">Family Classic</h3>
                <p className="plan-card__desc">Balanced, easy meals for busy families.</p>
                <div className="plan-card__stars">★★★★★</div>
                <div className="plan-card__footer">
                  <span className="plan-card__save">Save £22</span>
                  <a href="#" className="plan-card__link">View plan →</a>
                </div>
              </div>
            </div>

            <div className="plan-card">
              <div className="plan-card__image">💪</div>
              <div className="plan-card__body">
                <h3 className="plan-card__title">High Protein Power</h3>
                <p className="plan-card__desc">High protein meals for energy and fitness.</p>
                <div className="plan-card__stars">★★★★☆</div>
                <div className="plan-card__footer">
                  <span className="plan-card__save">Save £18</span>
                  <a href="#" className="plan-card__link">View plan →</a>
                </div>
              </div>
            </div>

            <div className="plan-card">
              <div className="plan-card__image">🥗</div>
              <div className="plan-card__body">
                <h3 className="plan-card__title">Gluten Free Easy</h3>
                <p className="plan-card__desc">Simple gluten free meals, quick and affordable.</p>
                <div className="plan-card__stars">★★★★★</div>
                <div className="plan-card__footer">
                  <span className="plan-card__save">Save £24</span>
                  <a href="#" className="plan-card__link">View plan →</a>
                </div>
              </div>
            </div>

          </div>

          <div className="plans-preview__more">
            <a href="#">See more plans →</a>
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="testimonials__title">Testimonials</h2>
          <div className="testimonials__grid">

            <div className="testimonial-card">
              <p className="testimonial-card__name">Lucia Collins</p>
              <p className="testimonial-card__quote">
                I've cut my grocery bill by nearly £25 a week without swapping brands.
                Carty finds the cheapest store for each item — it's like having a personal shopper.
              </p>
              <div className="testimonial-card__stars">★★★★★</div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-card__name">Marissa Chris</p>
              <p className="testimonial-card__quote">
                As a working mum, meal planning used to be a chore. Now I get a full
                week of dinners and the exact shopping list in minutes. And I know I'm not overpaying.
              </p>
              <div className="testimonial-card__stars">★★★★★</div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-card__name">Jennifer Quest</p>
              <p className="testimonial-card__quote">
                The price comparison is brilliant. I used to shop at Tesco out of habit,
                but Carty showed me I could save over £20 by mixing stores. Never going back.
              </p>
              <div className="testimonial-card__stars">★★★★★</div>
            </div>

          </div>
        </div>
      </section>

      {/* footer - dark multi-column */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">

            <div>
              <p className="footer__brand">🛒 Carty</p>
              <p className="footer__tagline">
                Smart meal planning with live price comparison.
                Helping families save money across UK supermarkets.
              </p>
            </div>

            <div>
              <p className="footer__col-title">Quick Links</p>
              <ul className="footer__links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Recipe</a></li>
                <li><a href="#">Plans</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <p className="footer__col-title">Support Us</p>
              <ul className="footer__links">
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Facebook</a></li>
              </ul>
            </div>

            <div>
              <p className="footer__col-title">Help</p>
              <ul className="footer__links">
                <li><a href="#">About us</a></li>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>

          </div>

          <div className="footer__bottom">
            <span>© 2026 Carty Aberdeen, Scotland</span>
            <a href="mailto:hi@carty.scot">hi@carty.scot</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
