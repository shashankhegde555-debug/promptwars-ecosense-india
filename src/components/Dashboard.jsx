import { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../hooks/useAuth.js';
import { INDIA_CARBON_FACTS, INDIA_AVERAGES, CATEGORIES } from '../constants.js';

const DAILY_BUDGET_KG = 6.8; // climate-safe target

export default function Dashboard({ onTabChange }) {
  const { user, city } = useAuth();
  const [factIndex, setFactIndex] = useState(0);
  const [todayCarbon, setTodayCarbon] = useState(3.4); // demo value
  const [weeklyData, setWeeklyData] = useState([]);

  // Rotating facts carousel — auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex(i => (i + 1) % INDIA_CARBON_FACTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const budgetPercent = Math.min((todayCarbon / DAILY_BUDGET_KG) * 100, 100);
  const budgetColor = budgetPercent < 60 ? '#34d399' : budgetPercent < 85 ? '#fbbf24' : '#f87171';

  const ringData = [
    { name: 'Used', value: budgetPercent, fill: budgetColor },
    { name: 'Remaining', value: 100 - budgetPercent, fill: 'rgba(255,255,255,0.05)' },
  ];

  const comparisons = [
    { label: 'You (today)', value: todayCarbon, color: budgetColor, emoji: '👤' },
    { label: 'India avg', value: INDIA_AVERAGES.dailyKg, color: '#60a5fa', emoji: '🇮🇳' },
    { label: 'Global avg', value: INDIA_AVERAGES.globalDailyKg, color: '#f87171', emoji: '🌍' },
    { label: 'Safe target', value: INDIA_AVERAGES.safeDailyKg, color: '#34d399', emoji: '🎯' },
  ];

  return (
    <section className="dashboard" aria-label="Carbon Footprint Dashboard">
      <div className="dashboard-grid">

        {/* Daily Budget Ring */}
        <div className="card card-ring" aria-label={`Daily carbon budget: ${todayCarbon.toFixed(1)} of ${DAILY_BUDGET_KG} kg used`}>
          <h2 className="card-title">Today&apos;s Carbon Budget</h2>
          <div className="ring-chart-wrapper" aria-hidden="true">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="60%" outerRadius="80%"
                data={ringData}
                startAngle={90} endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
                <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="ring-center">
              <span className="ring-value" style={{ color: budgetColor }}>{todayCarbon.toFixed(1)}</span>
              <span className="ring-unit">kg CO₂</span>
              <span className="ring-sub">limit: {DAILY_BUDGET_KG} kg</span>
            </div>
          </div>
          {city && (
            <p className="city-note">📍 {city} grid: electricity-heavy activities cost more here</p>
          )}
          <button className="btn btn-outline btn-sm card-action-btn" onClick={() => onTabChange?.('tracker')}>
            ➕ Log Activity
          </button>
        </div>

        {/* Comparison Bars */}
        <div className="card" aria-label="Carbon footprint comparison">
          <h2 className="card-title">How You Compare</h2>
          <div className="comparison-bars">
            {comparisons.map(c => (
              <div key={c.label} className="comparison-row">
                <div className="comparison-label">
                  <span aria-hidden="true">{c.emoji}</span> {c.label}
                </div>
                <div className="comparison-bar-track" role="progressbar" aria-valuenow={c.value} aria-valuemin={0} aria-valuemax={15} aria-label={`${c.label}: ${c.value} kg`}>
                  <div
                    className="comparison-bar-fill"
                    style={{ width: `${(c.value / 15) * 100}%`, background: c.color }}
                  />
                </div>
                <span className="comparison-value">{c.value} kg</span>
              </div>
            ))}
          </div>
          <button className="btn btn-outline btn-sm card-action-btn" onClick={() => onTabChange?.('insights')}>
            💡 View Insights
          </button>
        </div>

        {/* Rotating Facts Carousel */}
        <div className="card card-fact" aria-label="Carbon footprint fact" aria-live="polite">
          <h2 className="card-title">Did You Know? 🇮🇳</h2>
          <div className="fact-content">
            <span className="fact-icon" aria-hidden="true">{INDIA_CARBON_FACTS[factIndex].icon}</span>
            <p className="fact-text">{INDIA_CARBON_FACTS[factIndex].fact}</p>
          </div>
          <div className="fact-nav-row">
            <div className="fact-nav" role="navigation" aria-label="Facts navigation">
              <button
                aria-label="Previous fact"
                className="fact-nav-arrow"
                onClick={() => setFactIndex(i => (i - 1 + INDIA_CARBON_FACTS.length) % INDIA_CARBON_FACTS.length)}
              >
                ←
              </button>
              <span className="fact-counter">{factIndex + 1} / {INDIA_CARBON_FACTS.length}</span>
              <button
                aria-label="Next fact"
                className="fact-nav-arrow"
                onClick={() => setFactIndex(i => (i + 1) % INDIA_CARBON_FACTS.length)}
              >
                →
              </button>
            </div>
            <button className="btn btn-primary btn-sm card-action-btn" onClick={() => onTabChange?.('pledge')}>
              🎯 Take Pledge
            </button>
          </div>
        </div>

        {/* Category Quick Stats */}
        <div className="card card-categories" aria-label="Category breakdown">
          <h2 className="card-title">Category Overview</h2>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="category-stat" aria-label={`${cat.label} category`}>
                <span className="cat-emoji" aria-hidden="true">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
                <span className="cat-value" style={{ color: cat.color }}>
                  {user ? '—' : '0.0'} kg
                </span>
              </div>
            ))}
          </div>
          {!user && (
            <p className="card-note">Sign in to see your personal breakdown</p>
          )}
          <button className="btn btn-outline btn-sm card-action-btn" onClick={() => onTabChange?.('actions')}>
            🌱 Reduce Impact
          </button>
        </div>

      </div>
    </section>
  );
}
