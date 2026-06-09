import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { CATEGORIES, DIFFICULTY_CONFIG } from '../constants.js';
import { trackEvent } from '../firebase.js';
import { MOCK_ACTIONS } from '../mockData.js';

export default function Actions() {
  const [selectedCat, setSelectedCat] = useState('transport');
  const { city } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    trackEvent('generate_actions', { category: selectedCat, city: city || 'India' });
    setLoading(true);
    setError(null);
    
    // Simulated short loading delay for realistic transition
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setData(MOCK_ACTIONS[selectedCat] || { category: selectedCat, actions: [] });
    setLoading(false);
  };

  const grouped = data?.actions?.reduce((acc, action) => {
    (acc[action.difficulty] = acc[action.difficulty] || []).push(action);
    return acc;
  }, {}) || {};

  return (
    <section className="actions" aria-label="Eco-Actions">
      <div className="section-header">
        <h2 className="section-title">🌱 Eco-Actions</h2>
        <p className="section-desc">
          AI-generated reduction actions tailored for India
          {city && ` — personalised for ${city}`}.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="actions-cat-row" role="tablist" aria-label="Activity categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={selectedCat === cat.id}
            className={`cat-tab ${selectedCat === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat.id)}
            style={selectedCat === cat.id ? { borderColor: cat.color, color: cat.color } : {}}
          >
            <span aria-hidden="true">{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? <><span className="spinner" aria-hidden="true" /> Generating…</> : `✨ Generate ${CATEGORIES.find(c => c.id === selectedCat)?.label} Actions`}
      </button>

      {error && <div className="error-banner" role="alert">{error}</div>}

      {data && (
        <div className="actions-grid" aria-live="polite">
          {['easy', 'medium', 'committed'].map(diff => (
            grouped[diff] && (
              <div key={diff} className="difficulty-section">
                <h3
                  className="diff-title"
                  style={{ color: DIFFICULTY_CONFIG[diff].color }}
                >
                  {diff === 'easy' ? '✅ Easy Wins' : diff === 'medium' ? '💪 Medium Effort' : '🏆 Committed Changes'}
                </h3>
                <div className="actions-list">
                  {grouped[diff].map((action, i) => (
                    <div key={i} className="action-card">
                      <div className="action-header">
                        <span className="action-icon" aria-hidden="true">{action.icon}</span>
                        <div>
                          <h4 className="action-title">{action.title}</h4>
                          <span
                            className="diff-badge"
                            style={{ color: DIFFICULTY_CONFIG[diff].color, background: DIFFICULTY_CONFIG[diff].bg }}
                          >
                            {DIFFICULTY_CONFIG[diff].label}
                          </span>
                        </div>
                        <div className="action-saving">
                          <span className="saving-value">{action.savingKgPerYear}</span>
                          <span className="saving-label">kg/year saved</span>
                        </div>
                      </div>
                      <p className="action-desc">{action.description}</p>
                      {action.indiaContext && (
                        <p className="india-context">🇮🇳 {action.indiaContext}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </section>
  );
}

