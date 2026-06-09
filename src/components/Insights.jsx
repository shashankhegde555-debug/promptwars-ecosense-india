import { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { trackEvent } from '../firebase.js';

export default function Insights() {
  const { user, city } = useAuth();
  const [activities, setActivities] = useState([]);
  const { data, loading, error, call } = useApi('/api/insights');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'activities'), orderBy('createdAt', 'desc'));
    getDocs(q).then(snap => {
      setActivities(snap.docs.map(d => d.data()));
    });
  }, [user]);

  const handleGenerate = async () => {
    if (activities.length === 0) return;
    trackEvent('generate_insights', { city: city || 'India', activityCount: activities.length });
    await call({ activities: activities.slice(0, 30), city, totalDays: 7 });
  };

  const priorityColor = { high: '#f87171', medium: '#fbbf24', low: '#34d399' };

  return (
    <section className="insights" aria-label="AI Insights">
      <div className="section-header">
        <h2 className="section-title">💡 AI Insights</h2>
        <p className="section-desc">
          Personalised analysis of your carbon footprint using India-specific benchmarks.
          {city && ` Comparing you to ${city} residents.`}
        </p>
      </div>

      {!user ? (
        <div className="auth-prompt-card">
          <p>🔐 Sign in and log some activities to get personalised insights powered by Gemini AI.</p>
        </div>
      ) : activities.length < 3 ? (
        <div className="info-card">
          <p>📊 Log at least 3 activities in the Tracker tab to generate meaningful insights.</p>
          <p className="info-sub">You have {activities.length} activit{activities.length === 1 ? 'y' : 'ies'} logged so far.</p>
        </div>
      ) : (
        <>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? <><span className="spinner" aria-hidden="true" /> Analysing with Gemini…</>
              : `✨ Analyse My ${activities.length} Activities`
            }
          </button>

          {error && <div className="error-banner" role="alert">{error}</div>}

          {data && (
            <div className="insights-content" aria-live="polite">
              {/* Summary Card */}
              <div className="insight-summary-card">
                <p className="insight-summary">{data.summary}</p>
                <div className="insight-meta-row">
                  <span className="meta-pill">🎯 Top source: {data.topSource}</span>
                  <span className="meta-pill">📈 {data.weeklyTrend}</span>
                </div>
                <p className="comparison-note">🇮🇳 {data.comparisonToAverage}</p>
                {data.cityInsight && <p className="city-insight">📍 {data.cityInsight}</p>}
              </div>

              {/* Individual Insights */}
              <div className="insights-list">
                {data.insights.map((insight, i) => (
                  <div key={i} className="insight-card" style={{ borderLeftColor: priorityColor[insight.priority] }}>
                    <div className="insight-header">
                      <h3 className="insight-title">{insight.title}</h3>
                      <div className="insight-badges">
                        <span
                          className="priority-badge"
                          style={{ color: priorityColor[insight.priority], background: `${priorityColor[insight.priority]}20` }}
                        >
                          {insight.priority} priority
                        </span>
                        <span className="saving-badge">
                          💚 Save {insight.potentialSavingKg} kg/year
                        </span>
                      </div>
                    </div>
                    <p className="insight-desc">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
