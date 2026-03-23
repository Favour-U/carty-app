// dashboard - first thing you see after logging in
// shows a summary of your profile + placeholder cards for future features
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch the full profile on mount  gives us all the fields including budget, household etc
  useEffect(() => {
    api.get('/users/profile')
      .then((res) => setProfile(res.data))
      .catch(() => {
        // if this fails the token is probably expired  log them out
        logout();
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [logout, navigate]);

  if (loading) return <LoadingSpinner />;

  // little helper to show "Not set" with a link to profile if a value is missing
  const notSet = <Link to="/profile" className="dashboard__not-set">Not set — update profile →</Link>;

  return (
    <div className="dashboard">
      <div className="container">

        {/* greeting header */}
        <div className="dashboard__header">
          <div>
            <h1>Hey, {profile?.name} 👋</h1>
            <p className="dashboard__greeting-sub">Here's your Carty overview</p>
          </div>
          <Link to="/profile" className="btn-outline dashboard__edit-btn">Edit Profile</Link>
        </div>

        {/* profile summary cards */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Your Profile</h2>
          <div className="dashboard__grid">

            <div className="card dashboard__card">
              <div className="dashboard__card-icon">💰</div>
              <div>
                <p className="dashboard__card-label">Weekly Budget</p>
                <p className="dashboard__card-value">
                  {profile?.weeklyBudget ? `£${profile.weeklyBudget} / week` : notSet}
                </p>
              </div>
            </div>

            <div className="card dashboard__card">
              <div className="dashboard__card-icon">🏠</div>
              <div>
                <p className="dashboard__card-label">Household</p>
                <p className="dashboard__card-value">
                  {profile?.householdSize?.adults != null
                    ? `${profile.householdSize.adults} adults, ${profile.householdSize.children ?? 0} children`
                    : notSet}
                </p>
              </div>
            </div>

            <div className="card dashboard__card">
              <div className="dashboard__card-icon">📍</div>
              <div>
                <p className="dashboard__card-label">Location</p>
                <p className="dashboard__card-value">
                  {profile?.postcode || notSet}
                </p>
              </div>
            </div>

            <div className="card dashboard__card">
              <div className="dashboard__card-icon">🥗</div>
              <div>
                <p className="dashboard__card-label">Dietary Preferences</p>
                <p className="dashboard__card-value">
                  {profile?.dietaryPreferences?.length > 0
                    ? profile.dietaryPreferences.join(', ')
                    : notSet}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* placeholder cards for phases 3+ */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Coming Soon</h2>
          <div className="dashboard__grid">

            <div className="card dashboard__placeholder">
              <div className="dashboard__placeholder-icon">🏷️</div>
              <h3>Price Comparison</h3>
              <p>Compare your basket across Asda, Tesco &amp; Morrisons. Coming in Phase 3.</p>
            </div>

            <div className="card dashboard__placeholder">
              <div className="dashboard__placeholder-icon">📋</div>
              <h3>Shopping Lists</h3>
              <p>Save your regular shop and get the cheapest total automatically.</p>
            </div>

            <div className="card dashboard__placeholder">
              <div className="dashboard__placeholder-icon">🍽️</div>
              <h3>Meal Planner</h3>
              <p>Get a full week of meals auto-built within your budget. Coming in Phase 3.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
