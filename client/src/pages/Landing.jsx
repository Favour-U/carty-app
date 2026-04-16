// the home/landing page  first thing visitors see
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/Landing.css';

// meal plan filter options same ones used on the recipes page
const FILTERS = ['Family budget', 'Kid-friendly', 'High-protein', 'Gluten-free', 'Quick & easy', 'Batch cook'];

export default function Landing() {
  return (
    <div className="landing">

      {/* photo background with search bar */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Carty</h1>
          <p className="hero__tagline">For a better Budget, For a better You</p>
          <div className="hero__search">
            <button className="hero__search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
            <input
              type="text"
              className="hero__search-input"
              placeholder="Search Meals and Meal Plans"
            />
          </div>
        </div>
      </section>

      {/* how it works  3 feature cards explaining the app */}
      <section className="how-it-works">
        <div className="container how-it-works__inner">
          <h2 className="how-it-works__title">How It Works</h2>
          <p className="how-it-works__desc">
            Carty is a website that Plans meals using ingredients compared between UK stores to reduce time wasted on meal 
            plannig and to also aid you in finding the best deals on  products.
          </p>

          <div className="how-it-works__cards">

            <div className="hiw-card hiw-card--active">
              {/* food spread image for the meals card */}
              <img
                src="/food spread for home page.png"
                alt="Food spread"
                className="hiw-card__food-img"
              />
              <h3 className="hiw-card__title"><u><a href="/meals" className="hiw-card__link">Meals</a></u></h3>
              <p className="hiw-card__text">
                Check out our Meals page or Click 'Recipe' when creating your meal plan to explore
                different recipes.
              </p>
              <p className="hiw-card__text">
                Filled with different recipes for you to try and add to your meal plan.
              </p>
            </div>

            <div className="hiw-card">
              <img
                src="/cartyimg-price_comparison.png"
                alt="Price comparison"
                className="hiw-card__food-img"
              />
              <h3 className="hiw-card__title">Price Comparison</h3>
              <p className="hiw-card__text">
                Check out our Price Comparison page, or click 'Compare' when you make your meal plan
                to compare all the ingredients of that meal.
              </p>
              <p className="hiw-card__text">
                You can also go into the meal plan and click 'compare prices' and it will compare each
                ingredient.
              </p>
            </div>

            <div className="hiw-card">
              <img
                src="/weeklymealplanner.png"
                alt="Weekly meal planner"
                className="hiw-card__food-img"
              />
              <h3 className="hiw-card__title">Weekly Meal Planner</h3>
              <p className="hiw-card__text">
                Set your weekly budget and we'll generate a full 7-day meal plan — breakfast, lunch,
                dinner and snacks — tailored to your household.
              </p>
              <p className="hiw-card__text">
                Supports high-protein, low-fat, gluten-free, vegan and more. Dietary preferences from
                every household member are factored in automatically.
              </p>
            </div>

          </div>
        </div>

        {/* decorative orange circles at the sides */}
        <div className="section-circle section-circle--left" />
        <div className="section-circle section-circle--right" />
      </section>

      {/* weekly meal plan section with filter pills */}
      <section className="meal-plan-section">
        <div className="container meal-plan-section__inner">
          <h2 className="meal-plan-section__title">Your weekly meal plan put on autopilot</h2>
          <p className="meal-plan-section__sub">
            Pick a style and enter your weekly budget, we'll build a day-by-day plan with real-time
            prices from your local stores.
          </p>

          <div className="meal-plan-section__filters">
            {FILTERS.map((f) => (
              <Link
                key={f}
                to="/meals"
                className={`filter-pill ${f === 'Quick & easy' ? 'filter-pill--active' : ''}`}
              >
                {f === 'Family budget'  && '👨‍👩‍👧 '}
                {f === 'Kid-friendly'   && '🧒 '}
                {f === 'High-protein'   && '💪 '}
                {f === 'Gluten-free'    && '🌿 '}
                {f === 'Quick & easy'   && '🍳 '}
                {f === 'Batch cook'     && '🌙 '}
                {f}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* popular meal cards */}
      <section className="meal-cards-section">
        <div className="container">
          <div className="meal-cards-grid">

            <div className="meal-card">
              <div className="meal-card__img">🥘</div>
              <div className="meal-card__body">
                <h3>Family Classic</h3>
                <p>Balanced, easy meals for busy families.</p>
                <div className="meal-card__footer">
                  <span className="meal-card__save">Save £22</span>
                  <Link to="/meals" className="meal-card__cta">View plan</Link>
                </div>
              </div>
            </div>

            <div className="meal-card">
              <div className="meal-card__img">💪</div>
              <div className="meal-card__body">
                <h3>High Protein Power</h3>
                <p>High protein meals for energy and fitness.</p>
                <div className="meal-card__footer">
                  <span className="meal-card__save">Save £18</span>
                  <Link to="/meals" className="meal-card__cta">View plan</Link>
                </div>
              </div>
            </div>

            <div className="meal-card">
              <div className="meal-card__img">🥗</div>
              <div className="meal-card__body">
                <h3>Gluten Free Easy</h3>
                <p>Simple gluten free meals, quick and affordable.</p>
                <div className="meal-card__footer">
                  <span className="meal-card__save">Save £24</span>
                  <Link to="/meals" className="meal-card__cta">View plan</Link>
                </div>
              </div>
            </div>

            <div className="meal-card">
              <div className="meal-card__img">🍜</div>
              <div className="meal-card__body">
                <h3>Budget Batch Cook</h3>
                <p>Cook once, eat all week. Great for meal prep.</p>
                <div className="meal-card__footer">
                  <span className="meal-card__save">Save £30</span>
                  <Link to="/meals" className="meal-card__cta">View plan</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
