// profile page  view your info or edit it
// has two modes: view (default) and edit (toggled by a button)
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Profile.css';

// the dietary preference options we support  stored as strings in the DB
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Halal', 'Kosher'];

export default function Profile() {
  const { updateUser } = useAuth();

  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [formData,  setFormData]  = useState({});

  // always fetch fresh data from API on mount  don't rely on stale context
  useEffect(() => {
    api.get('/users/profile')
      .then((res) => {
        setProfile(res.data);
        initForm(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // pre-fill the form with whatever is currently saved
  const initForm = (data) => {
    setFormData({
      name:               data.name || '',
      postcode:           data.postcode || '',
      weeklyBudget:       data.weeklyBudget ?? '',
      adults:             data.householdSize?.adults ?? '',
      children:           data.householdSize?.children ?? '',
      dietaryPreferences: data.dietaryPreferences || [],
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // toggle a dietary preference in/out of the array
  const toggleDiet = (option) => {
    setFormData((prev) => {
      const prefs = prev.dietaryPreferences;
      return {
        ...prev,
        dietaryPreferences: prefs.includes(option)
          ? prefs.filter((p) => p !== option)
          : [...prefs, option],
      };
    });
  };

  const handleCancel = () => {
    initForm(profile); // reset the form back to current saved values
    setEditing(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // build the payload  householdSize needs to be a nested object
    const payload = {
      name:               formData.name,
      postcode:           formData.postcode,
      weeklyBudget:       formData.weeklyBudget !== '' ? Number(formData.weeklyBudget) : undefined,
      householdSize: {
        adults:   formData.adults   !== '' ? Number(formData.adults)   : undefined,
        children: formData.children !== '' ? Number(formData.children) : undefined,
      },
      dietaryPreferences: formData.dietaryPreferences,
    };

    try {
      const { data } = await api.put('/users/profile', payload);
      setProfile(data);
      updateUser(data); // sync back to context so the navbar name updates too
      setEditing(false);

      // show a success message for 3 seconds then hide it
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save, try again');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile__header">
          <div>
            <h1>Your Profile</h1>
            <p className="profile__sub">Manage your account details and preferences</p>
          </div>
          {!editing && (
            <button className="btn-primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {success && <div className="success-banner">{success}</div>}
        {error   && <div className="error-banner">{error}</div>}

        {editing ? (
          /* ---- EDIT MODE ---- */
          <form onSubmit={handleSave} className="profile__form">

            <section className="profile__section">
              <h2>Account Details</h2>
              <div className="profile__fields">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="postcode">Postcode</label>
                  <input id="postcode" name="postcode" type="text" value={formData.postcode} onChange={handleChange} placeholder="e.g. SW1A 1AA" />
                </div>
              </div>
            </section>

            <section className="profile__section">
              <h2>Household & Planning</h2>
              <div className="profile__fields">
                <div className="form-group">
                  <label htmlFor="weeklyBudget">Weekly Budget (£) — used for meal planning</label>
                  <input id="weeklyBudget" name="weeklyBudget" type="number" min="0" value={formData.weeklyBudget} onChange={handleChange} placeholder="e.g. 80" />
                </div>
                <div className="form-group">
                  <label htmlFor="adults">Adults in household</label>
                  <input id="adults" name="adults" type="number" min="0" value={formData.adults} onChange={handleChange} placeholder="e.g. 2" />
                </div>
                <div className="form-group">
                  <label htmlFor="children">Children in household</label>
                  <input id="children" name="children" type="number" min="0" value={formData.children} onChange={handleChange} placeholder="e.g. 1" />
                </div>
              </div>
            </section>

            <section className="profile__section">
              <h2>Dietary Preferences</h2>
              <p className="profile__section-sub">Select all that apply to your household</p>
              <div className="profile__checkboxes">
                {DIETARY_OPTIONS.map((option) => (
                  <label key={option} className={`diet-chip ${formData.dietaryPreferences.includes(option) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={formData.dietaryPreferences.includes(option)}
                      onChange={() => toggleDiet(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </section>

            <div className="profile__form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn-outline" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>

        ) : (
          /* ---- VIEW MODE ---- */
          <div className="profile__view">

            <section className="profile__section card">
              <h2>Account Details</h2>
              <div className="profile__info-grid">
                <div className="profile__info-item">
                  <span className="profile__info-label">Name</span>
                  <span className="profile__info-value">{profile?.name || '—'}</span>
                </div>
                <div className="profile__info-item">
                  <span className="profile__info-label">Email</span>
                  <span className="profile__info-value">{profile?.email || '—'}</span>
                </div>
                <div className="profile__info-item">
                  <span className="profile__info-label">Postcode</span>
                  <span className="profile__info-value">{profile?.postcode || '—'}</span>
                </div>
                <div className="profile__info-item">
                  <span className="profile__info-label">Member since</span>
                  <span className="profile__info-value">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </section>

            <section className="profile__section card">
              <h2>Household & Planning</h2>
              <div className="profile__info-grid">
                <div className="profile__info-item">
                  <span className="profile__info-label">Weekly Budget</span>
                  <span className="profile__info-value">
                    {profile?.weeklyBudget ? `£${profile.weeklyBudget}` : '—'}
                  </span>
                </div>
                <div className="profile__info-item">
                  <span className="profile__info-label">Adults</span>
                  <span className="profile__info-value">{profile?.householdSize?.adults ?? '—'}</span>
                </div>
                <div className="profile__info-item">
                  <span className="profile__info-label">Children</span>
                  <span className="profile__info-value">{profile?.householdSize?.children ?? '—'}</span>
                </div>
              </div>
            </section>

            <section className="profile__section card">
              <h2>Dietary Preferences</h2>
              {profile?.dietaryPreferences?.length > 0 ? (
                <div className="profile__diet-tags">
                  {profile.dietaryPreferences.map((p) => (
                    <span key={p} className="diet-chip selected">{p}</span>
                  ))}
                </div>
              ) : (
                <p className="profile__empty">None set</p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
