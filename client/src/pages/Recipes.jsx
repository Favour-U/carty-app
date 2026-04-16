// recipes page  browse and filter meal plans, view weekly shopping details
import { useState } from 'react';
import Footer from '../components/Footer';
import '../styles/Recipes.css';

const FILTERS = ['All', 'Family budget', 'Kid-friendly', 'High-protein', 'Gluten-free', 'Quick & easy', 'Batch cook'];

// sample recipe data would come from an API in a real app
const RECIPES = [
  { id: 1,  emoji: '🍳', name: 'Classic Egg Scramble',     tag: 'Quick & easy',   time: '10 min', cost: '£1.20', desc: 'Simple scrambled eggs with toast, quick weekday breakfast.' },
  { id: 2,  emoji: '🥗', name: 'Chicken Caesar Salad',     tag: 'High-protein',   time: '15 min', cost: '£2.80', desc: 'Grilled chicken over romaine with Caesar dressing.' },
  { id: 3,  emoji: '🍜', name: 'Beef Stir Fry',             tag: 'Family budget',  time: '20 min', cost: '£3.50', desc: 'Quick beef and veg stir fry served with rice.' },
  { id: 4,  emoji: '🥞', name: 'Banana Oat Pancakes',       tag: 'Kid-friendly',   time: '15 min', cost: '£0.90', desc: 'Fluffy pancakes made from oats and banana — no flour needed.' },
  { id: 5,  emoji: '🍲', name: 'Lentil & Tomato Soup',      tag: 'Gluten-free',    time: '30 min', cost: '£1.40', desc: 'Hearty red lentil soup with tinned tomatoes and cumin.' },
  { id: 6,  emoji: '🍱', name: 'Batch Cook Chicken Rice',   tag: 'Batch cook',     time: '45 min', cost: '£1.80', desc: 'Make once, eat four times. Garlic chicken with basmati.' },
  { id: 7,  emoji: '🥙', name: 'Turkey Wraps',              tag: 'High-protein',   time: '10 min', cost: '£2.10', desc: 'Lean turkey breast, lettuce and hummus in a wholemeal wrap.' },
  { id: 8,  emoji: '🍝', name: 'Pasta Bolognese',           tag: 'Family budget',  time: '35 min', cost: '£2.90', desc: 'Classic bolognese with mince and pasta — feeds a family.' },
  { id: 9,  emoji: '🥕', name: 'Carrot & Ginger Soup',      tag: 'Gluten-free',    time: '25 min', cost: '£0.95', desc: 'Smooth, warming soup — great for batch cooking.' },
];

// a sample 7-day weekly meal plan
const WEEKLY_PLAN = [
  { day: 'Monday',    breakfast: 'Banana Oat Pancakes', lunch: 'Turkey Wraps',    dinner: 'Beef Stir Fry' },
  { day: 'Tuesday',   breakfast: 'Classic Egg Scramble', lunch: 'Lentil Soup',    dinner: 'Pasta Bolognese' },
  { day: 'Wednesday', breakfast: 'Classic Egg Scramble', lunch: 'Chicken Salad',  dinner: 'Batch Cook Chicken Rice' },
  { day: 'Thursday',  breakfast: 'Banana Oat Pancakes', lunch: 'Turkey Wraps',    dinner: 'Lentil & Tomato Soup' },
  { day: 'Friday',    breakfast: 'Classic Egg Scramble', lunch: 'Pasta Bolognese',dinner: 'Chicken Caesar Salad' },
  { day: 'Saturday',  breakfast: 'Banana Oat Pancakes', lunch: 'Carrot Soup',     dinner: 'Beef Stir Fry' },
  { day: 'Sunday',    breakfast: 'Classic Egg Scramble', lunch: 'Turkey Wraps',   dinner: 'Batch Cook Chicken Rice' },
];

export default function Recipes() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? RECIPES
    : RECIPES.filter((r) => r.tag === activeFilter);

  return (
    <div className="recipes-page">

      {/* page header */}
      <section className="recipes-hero">
        <div className="container">
          <h1 className="recipes-hero__title">Meals & Weekly Shopping</h1>
          <p className="recipes-hero__sub">Explore recipes, build your weekly plan, and shop at the best prices.</p>
        </div>
      </section>

      {/* recipe browser section */}
      <section className="recipes-section">
        <div className="container">
          <h2 className="recipes-section__title">Browse Recipes</h2>

          {/* filter pills */}
          <div className="recipes-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-pill ${activeFilter === f ? 'filter-pill--active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* recipe cards grid */}
          <div className="recipes-grid">
            {filtered.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-card__img">{recipe.emoji}</div>
                <div className="recipe-card__body">
                  <div className="recipe-card__meta">
                    <span className="recipe-card__tag">{recipe.tag}</span>
                    <span className="recipe-card__time">⏱ {recipe.time}</span>
                  </div>
                  <h3 className="recipe-card__name">{recipe.name}</h3>
                  <p className="recipe-card__desc">{recipe.desc}</p>
                  <div className="recipe-card__footer">
                    <span className="recipe-card__cost">{recipe.cost} / serving</span>
                    <button className="recipe-card__btn">View Recipe</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* weekly meal plan section */}
      <section className="weekly-section">
        <div className="container">
          <h2 className="weekly-section__title">Your Weekly Meal Plan put on Autopilot</h2>
          <p className="weekly-section__sub">A sample plan built within a £40 weekly budget for 2 adults.</p>

          <div className="weekly-table-wrapper">
            <table className="weekly-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {WEEKLY_PLAN.map((row) => (
                  <tr key={row.day}>
                    <td className="weekly-table__day">{row.day}</td>
                    <td>{row.breakfast}</td>
                    <td>{row.lunch}</td>
                    <td>{row.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* decorative circles */}
        <div className="section-circle section-circle--left" />
        <div className="section-circle section-circle--right" />
      </section>

      <Footer />
    </div>
  );
}
