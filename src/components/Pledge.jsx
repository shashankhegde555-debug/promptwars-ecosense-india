import { useState, useEffect } from 'react';
import { db, trackEvent } from '../firebase.js';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const REDUCTION_OPTIONS = [10, 15, 20, 25, 30];
const INDIA_DAILY_AVG = 5.2;

export default function Pledge() {
  const { user, city } = useAuth();
  const [pledge, setPledge] = useState(null);
  const [step, setStep] = useState('setup'); // 'setup' | 'active'
  const [targetPct, setTargetPct] = useState(20);
  const { data: tips, loading, error, call } = useApi('/api/pledge/tips');

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid, 'pledges', currentMonth)).then(snap => {
      if (snap.exists()) {
        setPledge(snap.data());
        setStep('active');
      }
    });
  }, [user, currentMonth]);

  const createPledge = async () => {
    if (!user) return alert('Please sign in to create a pledge');
    const baseline = INDIA_DAILY_AVG;
    const target = baseline * (1 - targetPct / 100);
    const newPledge = {
      targetReductionPercent: targetPct,
      baselineKgPerDay: baseline,
      targetKgPerDay: parseFloat(target.toFixed(2)),
      currentKgPerDay: baseline,
      status: 'on-track',
      createdAt: serverTimestamp(),
      month: currentMonth,
    };
    await setDoc(doc(db, 'users', user.uid, 'pledges', currentMonth), newPledge);
    setPledge(newPledge);
    setStep('active');
    trackEvent('pledge_created', { targetPct, city: city || 'India' });
  };

  const getTips = async () => {
    if (!pledge) return;
    const now = new Date();
    const daysIntoMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    await call({
      targetReductionPercent: pledge.targetReductionPercent,
      baselineKgPerDay: pledge.baselineKgPerDay,
      currentKgPerDay: pledge.currentKgPerDay,
      daysIntoMonth,
      daysRemaining: daysInMonth - daysIntoMonth,
      city,
    });
  };

  const progressPct = pledge
    ? Math.min(Math.round(((pledge.baselineKgPerDay - pledge.currentKgPerDay) / (pledge.baselineKgPerDay - pledge.targetKgPerDay)) * 100), 100)
    : 0;

  const statusColors = {
    'on-track': '#34d399',
    'slightly-behind': '#fbbf24',
    'behind': '#f87171',
    'achieved': '#a78bfa',
  };

  const ringData = [
    { value: progressPct, fill: statusColors[pledge?.status] || '#34d399' },
    { value: 100 - progressPct, fill: 'rgba(255,255,255,0.05)' },
  ];

  if (!user) {
    return (
      <section className="pledge" aria-label="Carbon Pledge">
        <div className="auth-prompt-card">
          <h2>🎯 Carbon Pledge</h2>
          <p>Sign in to set a monthly carbon reduction goal and get AI coaching to help you achieve it.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pledge" aria-label="Carbon Pledge">
      <div className="section-header">
        <h2 className="section-title">🎯 My Carbon Pledge</h2>
        <p className="section-desc">Commit to a monthly CO₂ reduction goal. Gemini will coach you with adaptive tips.</p>
      </div>

      {step === 'setup' && (
        <div className="pledge-setup">
          <h3 className="setup-title">Set Your Pledge for {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</h3>
          <p className="setup-desc">Your baseline: <strong>{INDIA_DAILY_AVG} kg CO₂/day</strong> (India average). How much do you want to reduce?</p>

          <div className="reduction-options" role="group" aria-label="Select reduction target">
            {REDUCTION_OPTIONS.map(pct => (
              <button
                key={pct}
                className={`reduction-btn ${targetPct === pct ? 'selected' : ''}`}
                onClick={() => setTargetPct(pct)}
                aria-pressed={targetPct === pct}
              >
                <span className="reduction-pct">{pct}%</span>
                <span className="reduction-kg">{(INDIA_DAILY_AVG * (1 - pct / 100)).toFixed(1)} kg/day</span>
              </button>
            ))}
          </div>

          <div className="pledge-summary">
            <p>✅ Goal: Reduce from <strong>{INDIA_DAILY_AVG} kg</strong> to <strong>{(INDIA_DAILY_AVG * (1 - targetPct / 100)).toFixed(1)} kg</strong> per day</p>
            <p>💚 Annual saving: <strong>{(INDIA_DAILY_AVG * (targetPct / 100) * 365).toFixed(0)} kg CO₂</strong> ({((INDIA_DAILY_AVG * (targetPct / 100) * 365) / 1000).toFixed(2)} tonnes)</p>
          </div>

          <button className="btn btn-primary btn-full" onClick={createPledge}>
            🎯 Make My Pledge
          </button>
        </div>
      )}

      {step === 'active' && pledge && (
        <div className="pledge-active">
          {/* Progress Ring */}
          <div className="pledge-ring-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" data={ringData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="ring-center">
              <span className="ring-value" style={{ color: statusColors[pledge.status] }}>{progressPct}%</span>
              <span className="ring-unit">achieved</span>
            </div>
          </div>

          <div className="pledge-stats">
            <div className="pledge-stat">
              <span className="stat-val">{pledge.targetReductionPercent}%</span>
              <span className="stat-lbl">Pledge Goal</span>
            </div>
            <div className="pledge-stat">
              <span className="stat-val">{pledge.currentKgPerDay}</span>
              <span className="stat-lbl">Current kg/day</span>
            </div>
            <div className="pledge-stat">
              <span className="stat-val">{pledge.targetKgPerDay}</span>
              <span className="stat-lbl">Target kg/day</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={getTips} disabled={loading} aria-busy={loading}>
            {loading ? <><span className="spinner" aria-hidden="true" /> Getting tips…</> : '✨ Get AI Coaching Tips'}
          </button>

          {error && <div className="error-banner" role="alert">{error}</div>}

          {tips && (
            <div className="pledge-tips" aria-live="polite">
              <div className="tips-header">
                <p className="tips-message">{tips.message}</p>
                {tips.weeklyChallenge && (
                  <div className="weekly-challenge">
                    🏆 Weekly Challenge: <em>{tips.weeklyChallenge}</em>
                  </div>
                )}
              </div>
              {tips.tips.map((tip, i) => (
                <div key={i} className="tip-card">
                  <div className="tip-header">
                    <span className="tip-timeframe">{tip.timeframe}</span>
                    <span className="tip-saving">-{tip.savingKgPerDay} kg/day</span>
                  </div>
                  <p className="tip-action">{tip.action}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
