// profile setup form  shown right after a user registers
// same background as login/register, collects household info and preferences
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/ProfileSetup.css';

// the four cuisine categories shown as clickable circles
const CUISINES = [
  { id: 'staple',  label: 'Staple Food',  emoji: '🍛' },
  { id: 'soups',   label: 'Soups/Stews',  emoji: '🍲' },
  { id: 'sides',   label: 'Sides',        emoji: '🥗' },
  { id: 'snacks',  label: 'Snacks',       emoji: '🍿' },
];

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [memberCount,       setMemberCount]       = useState(0);
  const [ages,              setAges]              = useState('');
  const [allergies,         setAllergies]         = useState('');
  const [weights,           setWeights]           = useState('');
  const [selectedCuisines,  setSelectedCuisines]  = useState([]);
  const [saving,            setSaving]            = useState(false);

  // toggle a cuisine in/out of the selected array
  const toggleCuisine = (id) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // stepper helpers - min 0, max 20
  const decrement = () => setMemberCount((n) => Math.max(0, n - 1));
  const increment = () => setMemberCount((n) => Math.min(20, n + 1));

  const handleSubmit = async () => {
    setSaving(true);

    // map allergies text to an array and add any selected cuisines on top
    const dietaryPreferences = [
      ...allergies.split(',').map((s) => s.trim()).filter(Boolean),
      ...selectedCuisines.map((id) => CUISINES.find((c) => c.id === id)?.label).filter(Boolean),
    ];

    try {
      await api.put('/users/profile', {
        householdSize:      { adults: memberCount },
        dietaryPreferences,
      });
    } catch {
      // they can update this later from their profile page
    } finally {
      setSaving(false);
      navigate('/dashboard');
    }
  };

  // skip just goes straight to the dashboard without saving anything
  const handleSkip = () => navigate('/dashboard');

  return (
    <div className="setup-page">
      <div className="setup-form-wrapper">

        {/* basket icon + branding */}
        <div className="auth-brand">
          <img src="/shopping-basket-icon.svg" alt="Carty logo" className="auth-brand__icon" />
          <span className="auth-brand__name">Carty</span>
        </div>

        <h1 className="auth-title">Registration Form</h1>

        <p className="setup-heading-sub">
          Please Answer These Questions For Us<br />
          So We Can Better Help You
        </p>
        <p className="setup-hint">Please press enter after each entry in the text boxes</p>

        {/* ---- Number of Members stepper ---- */}
        <div className="setup-field">
          <label className="setup-label">Number Of Members:</label>
          <div className="setup-stepper">
            <button type="button" className="stepper-btn" onClick={decrement}>&#9664;</button>
            <span className="stepper-value">{memberCount}</span>
            <button type="button" className="stepper-btn" onClick={increment}>&#9654;</button>
          </div>
        </div>

        {/* ---- Ages ---- */}
        <div className="setup-field">
          <label className="setup-label" htmlFor="ages">Ages:</label>
          <input
            id="ages"
            type="text"
            className="setup-input"
            value={ages}
            onChange={(e) => setAges(e.target.value)}
            placeholder="e.g. 34, 28, 5"
          />
        </div>

        {/* ---- Allergies / Dietary Restrictions ---- */}
        <div className="setup-field">
          <label className="setup-label" htmlFor="allergies">Allergies Or Dietary Restrictions:</label>
          <input
            id="allergies"
            type="text"
            className="setup-input"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Gluten-free, Dairy-free"
          />
        </div>

        {/* ---- Weights ---- */}
        <div className="setup-field">
          <label className="setup-label" htmlFor="weights">Weights Of Each Person:</label>
          <input
            id="weights"
            type="text"
            className="setup-input"
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
            placeholder="e.g. 80kg, 65kg, 20kg"
          />
        </div>

        {/* ---- Cuisines ---- */}
        <div className="setup-field">
          <label className="setup-label">Cuisines</label>
          <div className="setup-cuisines">
            {CUISINES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`cuisine-circle ${selectedCuisines.includes(c.id) ? 'selected' : ''}`}
                onClick={() => toggleCuisine(c.id)}
              >
                <span className="cuisine-circle__emoji">{c.emoji}</span>
                <span className="cuisine-circle__label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- Actions ---- */}
        <button
          type="button"
          className="auth-submit-btn"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'To Home Page'}
        </button>

        <p className="auth-switch">
          Dont wanna answer?{' '}
          <button type="button" className="setup-skip-btn" onClick={handleSkip}>
            Skip
          </button>
        </p>
      </div>
    </div>
  );
}
