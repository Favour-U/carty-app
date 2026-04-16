// profile page  view your info or edit it
// has two modes view  and edit
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Profile.css';

// the dietary preference options we support  stored as strings in the DB
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Halal', 'Kosher', 'Nut-free', 'Low-sugar'];

export default function Profile() {
  const { updateUser } = useAuth();

  const [profile,       setProfile]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [editing,       setEditing]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [formData,      setFormData]      = useState({});
  const [members,       setMembers]       = useState([]); // [{ type: 'adult'|'child', prefs: [] }]
  const [savedPlans,    setSavedPlans]    = useState([]);
  const [plansLoading,  setPlansLoading]  = useState(false);
  const [expandedPlan,  setExpandedPlan]  = useState(null); // id of expanded plan card

  // always fetch fresh data from API on mount  don't rely on stale context
  useEffect(() => {
    api.get('/users/profile')
      .then((res) => {
        setProfile(res.data);
        initForm(res.data);
      })
      .finally(() => setLoading(false));

    // fetch saved meal plans alongside profile
    setPlansLoading(true);
    api.get('/mealplans')
      .then((res) => setSavedPlans(res.data || []))
      .catch(() => {})
      .finally(() => setPlansLoading(false));
  }, []);

  // pre-fill the form with whatever is currently saved
  const initForm = (data) => {
    setFormData({
      name:        data.name || '',
      postcode:    data.postcode || '',
      weeklyBudget: data.weeklyBudget ?? '',
    });

    // reconstruct the member list from the saved adults/children counts
    const adults   = Array.from({ length: data.householdSize?.adults   ?? 0 }, () => ({ type: 'adult',  prefs: [] }));
    const children = Array.from({ length: data.householdSize?.children ?? 0 }, () => ({ type: 'child',  prefs: [] }));
    setMembers([...adults, ...children]);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // add a new adult or child to the household list
  const addMember = (type) => setMembers((prev) => [...prev, { type, prefs: [] }]);

  // remove a specific member by index
  const removeMember = (idx) => setMembers((prev) => prev.filter((_, i) => i !== idx));

  // toggle a dietary preference on/off for a specific household member
  const toggleMemberPref = (idx, pref) => {
    setMembers((prev) => prev.map((m, i) => {
      if (i !== idx) return m;
      return {
        ...m,
        prefs: m.prefs.includes(pref)
          ? m.prefs.filter((p) => p !== pref)
          : [...m.prefs, pref],
      };
    }));
  };

  const handleCancel = () => {
    initForm(profile);
    setEditing(false);
    setError('');
  };

  const handleDeletePlan = async (planId) => {
    try {
      await api.delete(`/mealplans/${planId}`);
      setSavedPlans((prev) => prev.filter((p) => p._id !== planId));
      if (expandedPlan === planId) setExpandedPlan(null);
    } catch {
      // silent fail — plan stays in list
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // build the payload  householdSize computed from the member list
    // dietary preferences is the union of all member prefs
    const payload = {
      name:        formData.name,
      postcode:    formData.postcode,
      weeklyBudget: formData.weeklyBudget !== '' ? Number(formData.weeklyBudget) : undefined,
      householdSize: {
        adults:   members.filter((m) => m.type === 'adult').length,
        children: members.filter((m) => m.type === 'child').length,
      },
      dietaryPreferences: [...new Set(members.flatMap((m) => m.prefs))],
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
                <div className="form-group">
                  <label htmlFor="weeklyBudget">Weekly Budget (£)</label>
                  <input id="weeklyBudget" name="weeklyBudget" type="number" min="0" value={formData.weeklyBudget} onChange={handleChange} placeholder="e.g. 80" />
                </div>
              </div>
            </section>

            {/* household members  each one tagged as adult or child with their own dietary prefs */}
            <section className="profile__section">
              <h2>Household Members</h2>
              <p className="profile__section-sub">Add each person in your household and set their dietary needs</p>

              <div className="profile__members">
                {members.map((member, idx) => (
                  <div key={idx} className="member-row">
                    <div className="member-row__header">
                      {/* adult / child type toggle */}
                      <div className="member-type-toggle">
                        <button
                          type="button"
                          className={`member-type-btn ${member.type === 'adult' ? 'active' : ''}`}
                          onClick={() => setMembers((prev) => prev.map((m, i) => i === idx ? { ...m, type: 'adult' } : m))}
                        >
                          Adult
                        </button>
                        <button
                          type="button"
                          className={`member-type-btn ${member.type === 'child' ? 'active' : ''}`}
                          onClick={() => setMembers((prev) => prev.map((m, i) => i === idx ? { ...m, type: 'child' } : m))}
                        >
                          Child
                        </button>
                      </div>

                      <span className="member-row__label">
                        {member.type === 'adult' ? '👤 Adult' : '🧒 Child'} {idx + 1}
                      </span>

                      <button
                        type="button"
                        className="member-remove-btn"
                        onClick={() => removeMember(idx)}
                      >
                        Remove
                      </button>
                    </div>

                    {/* dietary preferences for this member */}
                    <div className="profile__checkboxes">
                      {DIETARY_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className={`diet-chip ${member.prefs.includes(opt) ? 'selected' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={member.prefs.includes(opt)}
                            onChange={() => toggleMemberPref(idx, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* add member buttons */}
              <div className="profile__add-member">
                <button type="button" className="btn-outline" onClick={() => addMember('adult')}>
                  + Add Adult
                </button>
                <button type="button" className="btn-outline" onClick={() => addMember('child')}>
                  + Add Child
                </button>
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
                  <span className="profile__info-label">Weekly Budget</span>
                  <span className="profile__info-value">
                    {profile?.weeklyBudget ? `£${profile.weeklyBudget}` : '—'}
                  </span>
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
              <h2>Household</h2>
              <div className="profile__info-grid">
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

            {/* ── Saved meal plans ── */}
            <section className="profile__section card">
              <h2>Saved Meal Plans</h2>

              {plansLoading && <p className="profile__empty">Loading plans…</p>}

              {!plansLoading && savedPlans.length === 0 && (
                <p className="profile__empty">
                  No plans saved yet.{' '}
                  <Link to="/meals" className="profile__link">Generate one →</Link>
                </p>
              )}

              {!plansLoading && savedPlans.length > 0 && (
                <div className="saved-plans">
                  {savedPlans.map((plan) => {
                    const isOpen = expandedPlan === plan._id;
                    const date   = new Date(plan.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    });
                    return (
                      <div key={plan._id} className={`saved-plan-card ${isOpen ? 'saved-plan-card--open' : ''}`}>

                        {/* header row */}
                        <div
                          className="saved-plan-card__header"
                          onClick={() => setExpandedPlan(isOpen ? null : plan._id)}
                        >
                          <div className="saved-plan-card__meta">
                            <span className="saved-plan-card__date">{date}</span>
                            <span className="saved-plan-card__budget">£{plan.weeklyBudget}/week</span>
                          </div>
                          <div className="saved-plan-card__actions">
                            <Link
                              to={`/meals?plan=${plan._id}`}
                              className="saved-plan-card__load-btn"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Load in Planner
                            </Link>
                            <button
                              className="saved-plan-card__delete-btn"
                              onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan._id); }}
                              title="Delete plan"
                            >
                              🗑
                            </button>
                            <span className="saved-plan-card__toggle">{isOpen ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* expanded meal summary */}
                        {isOpen && (
                          <div className="saved-plan-card__body">
                            {plan.days?.map((day) => (
                              <div key={day.day} className="saved-plan-day">
                                <p className="saved-plan-day__name">{day.day}</p>
                                <ul className="saved-plan-day__meals">
                                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((t) =>
                                    day[t] ? (
                                      <li key={t}>
                                        <span className="saved-plan-day__type">{t}</span>
                                        {day[t].name}
                                      </li>
                                    ) : null
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
