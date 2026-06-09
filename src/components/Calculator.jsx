import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { IMPACT_LEVELS } from '../constants.js';
import { trackEvent, createTrace } from '../firebase.js';

const EXAMPLE_PROMPTS = [
  'I drove 25km to work in my petrol car in Delhi',
  'Took a CNG auto-rickshaw 8km in Bengaluru',
  'Cooked 3 chapatis + sabzi on LPG stove',
  'Used AC for 8 hours in Mumbai',
  'Flew from Chennai to Delhi',
  'Ordered food delivery twice today',
];

export default function Calculator() {
  const [activity, setActivity] = useState('');
  const { city } = useAuth();
  const { data, loading, error, call, reset } = useApi('/api/calculate');

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!activity.trim()) return;

    const t = createTrace('gemini_calculate');
    t?.start();
    trackEvent('calculate_carbon', { city: city || 'unknown' });

    await call({ activity: activity.trim(), city });
    t?.stop();
  };

  const impactConfig = data ? IMPACT_LEVELS[data.impactLevel] || IMPACT_LEVELS.moderate : null;

  return (
    <section className="calculator" aria-label="Carbon Footprint Calculator">
      <div className="section-header">
        <h2 className="section-title">🧮 Carbon Calculator</h2>
        <p className="section-desc">Describe any activity in plain language — Gemini will estimate its carbon footprint using India-specific emission factors.</p>
      </div>

      <form onSubmit={handleCalculate} className="calc-form" noValidate>
        <div className="form-group">
          <label htmlFor="activity-input" className="form-label">
            Describe your activity
            <span className="form-hint"> (max 500 characters)</span>
          </label>
          <textarea
            id="activity-input"
            className="form-textarea"
            value={activity}
            onChange={e => { setActivity(e.target.value); if (data) reset(); }}
            placeholder="e.g. I took a CNG auto-rickshaw 8km to work in Bengaluru"
            maxLength={500}
            rows={3}
            aria-describedby="activity-hint"
            aria-invalid={!!error}
            aria-required="true"
          />
          <span id="activity-hint" className="form-counter">{activity.length}/500</span>
        </div>

        <div className="example-prompts" aria-label="Example activities">
          <span className="examples-label">Try:</span>
          {EXAMPLE_PROMPTS.map(p => (
            <button
              key={p}
              type="button"
              className="example-chip"
              onClick={() => { setActivity(p); reset(); }}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading || !activity.trim()}
          aria-busy={loading}
        >
          {loading ? (
            <><span className="spinner" aria-hidden="true" /> Calculating with Gemini…</>
          ) : (
            '⚡ Calculate Carbon Footprint'
          )}
        </button>
      </form>

      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}

      {data && (
        <div className="calc-result" role="region" aria-label="Calculation result" aria-live="polite">
          {/* Total */}
          <div className="result-total" style={{ borderColor: impactConfig?.color }}>
            <div>
              <p className="result-label">Total Carbon Footprint</p>
              <p className="result-value">{data.totalCarbonKg.toFixed(2)} <span className="result-unit">kg CO₂</span></p>
            </div>
            <span
              className="impact-badge"
              style={{ color: impactConfig?.color, background: impactConfig?.bg }}
            >
              {impactConfig?.emoji} {impactConfig?.label}
            </span>
          </div>

          {/* Breakdown */}
          <div className="result-section">
            <h3 className="result-section-title">Breakdown</h3>
            {data.breakdown.map((item, i) => (
              <div key={i} className="breakdown-row">
                <span className="breakdown-item">{item.item}</span>
                <span className="breakdown-kg">{item.carbonKg.toFixed(3)} kg</span>
                <p className="breakdown-explain">{item.explanation}</p>
              </div>
            ))}
          </div>

          {/* Equivalents */}
          <div className="result-section">
            <h3 className="result-section-title">Real-world equivalents</h3>
            <ul className="equiv-list">
              {data.equivalents.map((e, i) => <li key={i}>🔁 {e}</li>)}
            </ul>
          </div>

          {/* Tips */}
          <div className="result-section">
            <h3 className="result-section-title">💡 How to reduce</h3>
            <ul className="tips-list">
              {data.tips.map((t, i) => <li key={i}>✅ {t}</li>)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
