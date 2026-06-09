import { useState, useEffect } from 'react';
import { db, trackEvent } from '../firebase.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth.js';
import { QUICK_ACTIVITIES, CATEGORIES } from '../constants.js';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Tracker() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customKg, setCustomKg] = useState('');
  const [customCat, setCustomCat] = useState('transport');
  const [loading, setLoading] = useState(false);

  // Real-time listener for user's activities
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'activities'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const logActivity = async (name, category, carbonKg) => {
    if (!user) return alert('Please sign in to track activities');
    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'activities'), {
        name, category, carbonKg,
        createdAt: serverTimestamp(),
      });
      trackEvent('activity_logged', { category, carbonKg });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCustomLog = async (e) => {
    e.preventDefault();
    if (!customName.trim() || !customKg) return;
    await logActivity(customName.trim(), customCat, parseFloat(customKg));
    setCustomName(''); setCustomKg('');
  };

  // Pie chart data by category
  const pieData = CATEGORIES.map(cat => ({
    name: cat.label,
    value: activities.reduce((sum, a) => a.category === cat.id ? sum + (a.carbonKg || 0) : sum, 0),
    color: cat.color,
    emoji: cat.emoji,
  })).filter(d => d.value > 0);

  const totalCarbon = activities.reduce((s, a) => s + (a.carbonKg || 0), 0);

  return (
    <section className="tracker" aria-label="Activity Tracker">
      <div className="section-header">
        <h2 className="section-title">📊 Activity Tracker</h2>
        <p className="section-desc">Log your daily activities to track your personal carbon footprint over time.</p>
      </div>

      {/* Quick-add Buttons */}
      <div className="quick-add" aria-label="Quick add activities">
        <h3 className="quick-add-title">Quick Add</h3>
        <div className="quick-grid">
          {QUICK_ACTIVITIES.map(qa => (
            <button
              key={qa.id}
              className="quick-btn"
              onClick={() => logActivity(qa.name, qa.category, qa.carbonKg)}
              disabled={loading}
              aria-label={`Log ${qa.name}: ${qa.carbonKg} kg CO₂`}
            >
              <span aria-hidden="true">{qa.emoji}</span>
              <span className="quick-name">{qa.name}</span>
              <span className="quick-kg">{qa.carbonKg} kg</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Activity Form */}
      <form onSubmit={handleCustomLog} className="custom-form" aria-label="Add custom activity">
        <h3 className="form-section-title">Add Custom Activity</h3>
        <div className="custom-form-row">
          <div className="form-group">
            <label htmlFor="custom-name" className="form-label">Activity Name</label>
            <input
              id="custom-name"
              type="text"
              className="form-input"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="e.g. Train to Pune"
              maxLength={200}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="custom-cat" className="form-label">Category</label>
            <select id="custom-cat" className="form-select" value={customCat} onChange={e => setCustomCat(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="custom-kg" className="form-label">CO₂ (kg)</label>
            <input
              id="custom-kg"
              type="number"
              className="form-input"
              value={customKg}
              onChange={e => setCustomKg(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              aria-required="true"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !customName || !customKg}>
            + Add
          </button>
        </div>
      </form>

      {/* Stats Row */}
      {activities.length > 0 && (
        <>
          <div className="tracker-stats" aria-label="Tracking summary">
            <div className="stat-card">
              <span className="stat-value">{totalCarbon.toFixed(1)}</span>
              <span className="stat-label">Total kg CO₂</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{activities.length}</span>
              <span className="stat-label">Activities logged</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{(totalCarbon / Math.max(activities.length, 1)).toFixed(1)}</span>
              <span className="stat-label">Avg per activity (kg)</span>
            </div>
          </div>

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="card" aria-label="Category breakdown chart">
              <h3 className="card-title">Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v.toFixed(2)} kg CO₂`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Activity Timeline */}
      <div className="activity-list" aria-label="Activity history">
        <h3 className="list-title">Recent Activities</h3>
        {!user && <p className="auth-prompt">🔐 Sign in to see your activity history</p>}
        {user && activities.length === 0 && <p className="empty-state">No activities yet. Use Quick Add or log a custom activity above!</p>}
        {activities.slice(0, 20).map(a => {
          const cat = CATEGORIES.find(c => c.id === a.category);
          return (
            <div key={a.id} className="activity-row">
              <span className="activity-emoji" aria-hidden="true">{cat?.emoji || '📌'}</span>
              <div className="activity-info">
                <span className="activity-name">{a.name}</span>
                <span className="activity-cat" style={{ color: cat?.color }}>{cat?.label}</span>
              </div>
              <span className="activity-kg">{a.carbonKg?.toFixed(2)} kg</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
