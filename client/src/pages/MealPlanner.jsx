// meal planner page  Claude-powered 7-day plan generation
// budget + household + dietary prefs are pre-loaded from the user's profile
// each meal slot is expandable: nutrition, ingredient list (add to cart), prep steps
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import Footer from '../components/Footer';
import '../styles/MealPlanner.css';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'];
const WIDE_DAYS  = ['Sunday', 'Saturday'];

const MEAL_TYPE_ICONS = {
  breakfast: '🍳',
  lunch:     '🥗',
  dinner:    '🍽️',
  snacks:    '🍿',
};

const STYLE_TAGS = [
  'High-protein', 'Low-fat', 'Gluten-free', 'Vegan',
  'Vegetarian', 'Kid-friendly', 'Quick & easy', 'Batch cook',
];

// local fallback pool used by "Change Meal" so individual swaps don't cost an API call
const FALLBACK_MEALS = {
  breakfast: [
    { name: 'Overnight Oats',          side: 'with berries and honey',      calories: 350, nutrition: { protein: 12, carbs: 55, fat: 8  }, ingredients: [], steps: [] },
    { name: 'Scrambled Eggs on Toast', side: 'with cherry tomatoes',         calories: 390, nutrition: { protein: 20, carbs: 32, fat: 18 }, ingredients: [], steps: [] },
    { name: 'Greek Yoghurt Bowl',      side: 'with granola and banana',      calories: 320, nutrition: { protein: 15, carbs: 42, fat: 9  }, ingredients: [], steps: [] },
    { name: 'Avocado Toast',           side: 'with poached eggs',            calories: 410, nutrition: { protein: 16, carbs: 35, fat: 22 }, ingredients: [], steps: [] },
    { name: 'Porridge',                side: 'with sliced banana and honey', calories: 300, nutrition: { protein: 10, carbs: 52, fat: 6  }, ingredients: [], steps: [] },
  ],
  lunch: [
    { name: 'Chicken Caesar Salad', side: 'with croutons',          calories: 380, nutrition: { protein: 28, carbs: 22, fat: 18 }, ingredients: [], steps: [] },
    { name: 'Lentil Soup',          side: 'with crusty bread',      calories: 340, nutrition: { protein: 18, carbs: 45, fat: 7  }, ingredients: [], steps: [] },
    { name: 'Turkey Wraps',         side: 'with hummus and salad',  calories: 360, nutrition: { protein: 25, carbs: 38, fat: 12 }, ingredients: [], steps: [] },
    { name: 'Quinoa Salad',         side: 'with cucumber and herbs',calories: 320, nutrition: { protein: 12, carbs: 48, fat: 10 }, ingredients: [], steps: [] },
    { name: 'Tomato Soup',          side: 'with grilled cheese',    calories: 350, nutrition: { protein: 14, carbs: 40, fat: 15 }, ingredients: [], steps: [] },
  ],
  dinner: [
    { name: 'Pasta Bolognese',   side: 'with garlic bread',              calories: 580, nutrition: { protein: 30, carbs: 72, fat: 18 }, ingredients: [], steps: [] },
    { name: 'Grilled Chicken',   side: 'with roasted vegetables',        calories: 480, nutrition: { protein: 38, carbs: 28, fat: 14 }, ingredients: [], steps: [] },
    { name: 'Lentil Curry',      side: 'with basmati rice',              calories: 450, nutrition: { protein: 18, carbs: 68, fat: 10 }, ingredients: [], steps: [] },
    { name: 'Beef Stir Fry',     side: 'with jasmine rice',              calories: 520, nutrition: { protein: 32, carbs: 58, fat: 16 }, ingredients: [], steps: [] },
    { name: 'Baked Salmon',      side: 'with new potatoes and greens',   calories: 460, nutrition: { protein: 36, carbs: 30, fat: 20 }, ingredients: [], steps: [] },
  ],
  snacks: [
    { name: 'Apple and Peanut Butter', side: '',               calories: 200, nutrition: { protein: 6, carbs: 24, fat: 10 }, ingredients: [], steps: [] },
    { name: 'Hummus and Veggie Sticks',side: '',               calories: 160, nutrition: { protein: 6, carbs: 18, fat: 7  }, ingredients: [], steps: [] },
    { name: 'Greek Yoghurt',           side: 'with honey',     calories: 140, nutrition: { protein: 10, carbs: 16, fat: 4  }, ingredients: [], steps: [] },
    { name: 'Mixed Nuts',              side: '',               calories: 180, nutrition: { protein: 5,  carbs: 8,  fat: 15 }, ingredients: [], steps: [] },
    { name: 'Rice Cakes',              side: 'with cream cheese', calories: 130, nutrition: { protein: 3, carbs: 20, fat: 5 }, ingredients: [], steps: [] },
  ],
};

const dayCalories = (day) =>
  MEAL_TYPES.reduce((sum, t) => sum + (day[t]?.calories ?? 0), 0);

// ── Main component ─────────────────────────────────────────────────────────────
export default function MealPlanner() {
  const { user }         = useAuth();
  const [searchParams]   = useSearchParams();

  const [budget,        setBudget]        = useState('');
  const [styles,        setStyles]        = useState([]);
  const [householdSize, setHouseholdSize] = useState({ adults: 1, children: 0 });
  const [plan,          setPlan]          = useState(null);
  const [profilePrefs,  setProfilePrefs]  = useState([]); // raw dietary prefs from saved profile
  const [generating,    setGenerating]    = useState(false);
  const [genError,      setGenError]      = useState('');
  const [saving,        setSaving]        = useState(false);
  const [saveMsg,       setSaveMsg]       = useState('');
  const [foodSearch,    setFoodSearch]    = useState('');
  const [foodResults,   setFoodResults]   = useState([]);
  const [foodLoading,   setFoodLoading]   = useState(false);

  // pre-fill budget, styles and household from the user's saved profile
  useEffect(() => {
    if (!user) { setBudget('60'); return; }
    api.get('/users/profile')
      .then(({ data }) => {
        const profileBudget = data.weeklyBudget || 60;
        setBudget(String(profileBudget));

        const prefs   = data.dietaryPreferences || [];
        setProfilePrefs(prefs); // keep the raw list so it always gets sent to the backend

        const matched = STYLE_TAGS.filter((t) => prefs.includes(t));
        if ((data.householdSize?.children ?? 0) > 0 && !matched.includes('Kid-friendly')) {
          matched.push('Kid-friendly');
        }
        setStyles(matched);

        setHouseholdSize({
          adults:   data.householdSize?.adults   ?? 1,
          children: data.householdSize?.children ?? 0,
        });
      })
      .catch(() => setBudget('60'));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // if the URL has ?plan=<id>, load that saved plan (navigated from Profile)
  useEffect(() => {
    const planId = searchParams.get('plan');
    if (!planId) return;
    api.get(`/mealplans/${planId}`)
      .then(({ data }) => {
        setPlan(data.days);
        if (data.weeklyBudget) setBudget(String(data.weeklyBudget));
      })
      .catch(() => {});
  }, [searchParams]);

  const toggleStyle = (tag) =>
    setStyles((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  // call the backend have Claude generates the 7 day plan
  const handleGenerate = async () => {
    setGenerating(true);
    setGenError('');
    setPlan(null);
    try {
      // merge profile dietary prefs with any diet-related style tags  deduplicated
      const dietFromStyles = styles.filter((s) =>
        ['Gluten-free', 'Vegan', 'Vegetarian', 'Halal', 'Kosher', 'Nut-free'].includes(s)
      );
      const allDietaryPrefs = [...new Set([...profilePrefs, ...dietFromStyles])];

      const { data } = await api.post('/mealplans/generate', {
        weeklyBudget:       Number(budget),
        householdSize,
        dietaryPreferences: allDietaryPrefs,
        styles,
      });
      setPlan(data.days);
      setSaveMsg('');
    } catch (err) {
      setGenError(err.response?.data?.message || 'Generation failed — try again');
    } finally {
      setGenerating(false);
    }
  };

  // swap one meal from the local fallback pool  no API call, no cost
  const handleChangeMeal = (dayIdx, mealType) => {
    setPlan((prev) => {
      const updated = [...prev];
      const pool    = FALLBACK_MEALS[mealType];
      const current = updated[dayIdx][mealType]?.name;
      const options = pool.filter((m) => m.name !== current);
      const meal    = options[Math.floor(Math.random() * options.length)] || pool[0];
      updated[dayIdx] = { ...updated[dayIdx], [mealType]: { ...meal, type: mealType } };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!user) { setSaveMsg('Log in to save your plan'); return; }
    if (!plan)  return;
    setSaving(true);
    try {
      await api.post('/mealplans', { weeklyBudget: Number(budget), days: plan });
      setSaveMsg('Plan saved to your profile!');
    } catch {
      setSaveMsg('Failed to save — try again');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  };

  const handleFoodSearch = async (e) => {
    e.preventDefault();
    if (!foodSearch.trim()) return;
    setFoodLoading(true);
    setFoodResults([]);
    try {
      const { data } = await api.get(`/food-facts/search?q=${encodeURIComponent(foodSearch)}`);
      setFoodResults(data.products || []);
    } catch {
      setFoodResults([]);
    } finally {
      setFoodLoading(false);
    }
  };

  const wideDays = plan?.filter((d) => WIDE_DAYS.includes(d.day))  || [];
  const gridDays = plan?.filter((d) => !WIDE_DAYS.includes(d.day)) || [];

  return (
    <div className="planner-page">

      {/* ── Hero ── */}
      <section className="planner-hero">
        <div className="container">
          <h1 className="planner-hero__title">Meals &amp; Weekly Planner</h1>
          <p className="planner-hero__sub">Set your budget, pick your style — Claude builds the whole week.</p>
        </div>
      </section>

      {/* ── Settings ── */}
      <section className="planner-settings">
        <div className="container planner-settings__inner">

          <div className="planner-budget-box">
            <h2 className="planner-budget-box__label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Your weekly budget (£)
            </h2>
            <div className="planner-budget-box__row">
              <input
                type="number"
                min="0"
                className="planner-budget-input"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <button
                className="planner-generate-btn"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? '✨ Planning…' : 'Generate Plan'}
              </button>
            </div>
            <p className="planner-budget-box__hint">
              Claude will tailor meals to your budget, household and dietary needs.
            </p>
          </div>

          <div className="planner-styles">
            <p className="planner-styles__label">Dietary styles &amp; goals</p>
            <div className="planner-styles__pills">
              {STYLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`filter-pill ${styles.includes(tag) ? 'filter-pill--active' : ''}`}
                  onClick={() => toggleStyle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {genError && <p className="planner-gen-error">{genError}</p>}
        </div>
      </section>

      {/* ── Loading skeleton ── */}
      {generating && (
        <section className="planner-loading">
          <div className="container">
            <div className="planner-loading__inner">
              <div className="planner-loading__spinner" />
              <p className="planner-loading__text">Claude is planning your week…</p>
              <p className="planner-loading__sub">Picking meals for your household, budget and preferences</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Generated plan ── */}
      {plan && !generating && (
        <section className="planner-results">
          <div className="container">

            {wideDays.filter((d) => d.day === 'Sunday').map((day) => (
              <DayCard
                key={day.day}
                day={day}
                wide
                onChangeMeal={handleChangeMeal}
                planDays={plan}
                householdSize={householdSize}
              />
            ))}

            <div className="planner-grid">
              {gridDays.map((day) => (
                <DayCard
                  key={day.day}
                  day={day}
                  onChangeMeal={handleChangeMeal}
                  planDays={plan}
                  householdSize={householdSize}
                />
              ))}
            </div>

            {wideDays.filter((d) => d.day === 'Saturday').map((day) => (
              <DayCard
                key={day.day}
                day={day}
                wide
                onChangeMeal={handleChangeMeal}
                planDays={plan}
                householdSize={householdSize}
              />
            ))}

            <div className="planner-save-row">
              {saveMsg && <p className="planner-save-msg">{saveMsg}</p>}
              <button className="planner-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save Plan to Profile'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Open Food Facts search ── */}
      <section className="food-search-section">
        <div className="container">
          <h2 className="food-search-section__title">Look Up Any Food</h2>
          <p className="food-search-section__sub">
            Search millions of real products for nutrition data via Open Food Facts.
          </p>

          <form className="food-search-form" onSubmit={handleFoodSearch}>
            <input
              type="text"
              className="food-search-input"
              placeholder="e.g. whole milk, chicken breast, oats…"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
            />
            <button type="submit" className="food-search-btn" disabled={foodLoading}>
              {foodLoading ? 'Searching…' : 'Search'}
            </button>
          </form>

          {foodResults.length > 0 && (
            <div className="food-results-grid">
              {foodResults.map((p, i) => (
                <div key={i} className="food-result-card">
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt={p.name} className="food-result-card__img" />
                  )}
                  <div className="food-result-card__body">
                    <p className="food-result-card__name">{p.name || 'Unknown product'}</p>
                    {p.brand    && <p className="food-result-card__brand">{p.brand}</p>}
                    {p.quantity && <p className="food-result-card__qty">{p.quantity}</p>}
                    <div className="food-result-card__nutrition">
                      <span>🔥 {p.nutrition.calories} kcal</span>
                      <span>💪 {p.nutrition.protein}g protein</span>
                      <span>🍞 {p.nutrition.carbs}g carbs</span>
                      <span>🫒 {p.nutrition.fat}g fat</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {foodResults.length === 0 && !foodLoading && foodSearch && (
            <p className="food-search-empty">No results found — try a different search term.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── DayCard ────────────────────────────────────────────────────────────────────
function DayCard({ day, wide, onChangeMeal, planDays, householdSize }) {
  const dayIdx   = planDays.indexOf(day);
  const adults   = householdSize?.adults   ?? 1;
  const children = householdSize?.children ?? 0;

  const memberLabels = [
    ...(adults   > 0 ? [`Adult${adults   > 1 ? ` ×${adults}`   : ''}`] : []),
    ...(children > 0 ? [`Child${children > 1 ? ` ×${children}` : ''}`] : []),
  ];

  return (
    <div className={`day-card ${wide ? 'day-card--wide' : ''}`}>
      <h3 className="day-card__title">
        {day.day}
        {wide && (
          <span className="day-card__cals"> — {dayCalories(day)} cal/day</span>
        )}
      </h3>

      <div className={`day-card__meals ${wide ? 'day-card__meals--row' : ''}`}>
        {MEAL_TYPES.map((type) => {
          const meal = day[type];
          if (!meal) return null;
          return (
            <MealSlot
              key={type}
              meal={meal}
              type={type}
              memberLabels={memberLabels}
              onChangeMeal={() => onChangeMeal(dayIdx, type)}
            />
          );
        })}
      </div>

      {!wide && (
        <div className="day-card__footer">
          Daily Calories:&nbsp;<strong>{dayCalories(day)} cal</strong>
        </div>
      )}
    </div>
  );
}

// ── MealSlot ───────────────────────────────────────────────────────────────────
// expandable card — shows name/side collapsed, full nutrition + ingredients + steps expanded
function MealSlot({ meal, type, memberLabels, onChangeMeal }) {
  const { addItem }      = useCart();
  const [open, setOpen]  = useState(false);
  const [added, setAdded] = useState('');

  const hasDetail = meal.ingredients?.length > 0 || meal.steps?.length > 0;

  const addIngredient = (ing) => {
    const price = ing.price || 0;
    addItem({
      id:           `ing-${type}-${ing.name}`.toLowerCase().replace(/\s+/g, '-'),
      name:         `${ing.name} (${ing.quantity})`,
      bestPrice:    price,
      regularPrice: +(price * 1.15).toFixed(2), // estimated full-price for savings calc
      bestStore:    ing.store || 'Tesco',
      source:       'meal-plan',
    });
  };

  const addAllIngredients = () => {
    meal.ingredients?.forEach(addIngredient);
    setAdded('Added!');
    setTimeout(() => setAdded(''), 2000);
  };

  return (
    <div className={`meal-slot ${open ? 'meal-slot--open' : ''}`}>

      {/* collapsed header */}
      <div className="meal-slot__header" onClick={() => hasDetail && setOpen((o) => !o)}>
        <p className="meal-slot__type">
          {MEAL_TYPE_ICONS[type]}&nbsp;
          <span>{type.charAt(0).toUpperCase() + type.slice(1)} ({memberLabels.join(' & ')})</span>
        </p>
        <p className="meal-slot__name">{meal.name}</p>
        <p className="meal-slot__side">{meal.side}</p>

        <div className="meal-slot__actions">
          <button
            className="meal-slot__action-btn"
            onClick={(e) => { e.stopPropagation(); onChangeMeal(); }}
          >
            Change
          </button>
          <span className="meal-slot__cal-badge">{meal.calories} cal</span>
          {hasDetail && (
            <button
              className="meal-slot__toggle-btn"
              onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
              aria-label={open ? 'Collapse' : 'Expand'}
            >
              {open ? '▲' : '▼'}
            </button>
          )}
        </div>
      </div>

      {/* expanded detail */}
      {open && (
        <div className="meal-slot__detail">

          {/* nutrition row */}
          {meal.nutrition && (
            <div className="meal-slot__nutrition">
              <span>💪 {meal.nutrition.protein}g protein</span>
              <span>🍞 {meal.nutrition.carbs}g carbs</span>
              <span>🫒 {meal.nutrition.fat}g fat</span>
              <span>🔥 {meal.calories} cal</span>
            </div>
          )}

          {/* ingredients */}
          {meal.ingredients?.length > 0 && (
            <div className="meal-slot__ingredients">
              <p className="meal-slot__detail-label">Ingredients</p>
              <ul className="ingredient-list">
                {meal.ingredients.map((ing, i) => (
                  <li key={i} className="ingredient-row">
                    <span className="ingredient-row__text">
                      <strong>{ing.quantity}</strong> {ing.name}
                      {ing.store && (
                        <span className="ingredient-row__store">
                          {ing.store}{ing.price ? ` · £${ing.price.toFixed(2)}` : ''}
                        </span>
                      )}
                    </span>
                    <button
                      className="ingredient-row__add-btn"
                      onClick={() => addIngredient(ing)}
                      title="Add to cart"
                    >
                      + Cart
                    </button>
                  </li>
                ))}
              </ul>
              <button className="meal-slot__add-all-btn" onClick={addAllIngredients}>
                {added || '🛒 Add all ingredients to cart'}
              </button>
            </div>
          )}

          {/* prep steps */}
          {meal.steps?.length > 0 && (
            <div className="meal-slot__steps">
              <p className="meal-slot__detail-label">How to prepare</p>
              <ol className="steps-list">
                {meal.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
