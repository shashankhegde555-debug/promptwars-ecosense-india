import { useState, useEffect } from 'react';
import { db, trackEvent } from '../firebase.js';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Leaderboard() {
  const { user, city } = useAuth();
  const [entries, setEntries] = useState([]);
  const [userEntry, setUserEntry] = useState(null);
  const [optedIn, setOptedIn] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [cityFilter, setCityFilter] = useState('All India');
  const { data: insight, loading: insightLoading, call: fetchInsight } = useApi('/api/leaderboard/insight');

  useEffect(() => {
    loadLeaderboard();
    if (user) loadUserEntry();
  }, [user, cityFilter]);

  const loadLeaderboard = async () => {
    setLoadingEntries(true);
    try {
      const q = query(collection(db, 'leaderboard'), orderBy('reductionPercent', 'desc'), limit(50));
      const snap = await getDocs(q);
      let all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (cityFilter !== 'All India') all = all.filter(e => e.city === cityFilter);
      setEntries(all.slice(0, 20));
    } catch (e) {
      console.error(e);
    }
    setLoadingEntries(false);
  };

  const loadUserEntry = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, 'leaderboard', user.uid));
    if (snap.exists()) {
      setUserEntry(snap.data());
      setOptedIn(snap.data().optedIn || false);
    }
  };

  const handleOptIn = async () => {
    if (!user) return alert('Please sign in to join the leaderboard');
    const entry = {
      displayName: `EcoWarrior_${user.uid.slice(0, 6)}`,
      photoURL: user.photoURL || null,
      city: city || 'Other',
      reductionPercent: 0,
      totalCO2Avoided: 0,
      optedIn: true,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'leaderboard', user.uid), entry);
    setOptedIn(true);
    setUserEntry(entry);
    trackEvent('leaderboard_opt_in', { city: city || 'India' });
    loadLeaderboard();
  };

  const handleGetInsight = async () => {
    const now = new Date();
    const weekNumber = Math.ceil(now.getDate() / 7);
    const totalCO2Avoided = entries.reduce((s, e) => s + (e.reductionPercent * 0.05 || 0), 0);
    fetchInsight({
      totalUsers: entries.length,
      totalCO2Avoided: totalCO2Avoided.toFixed(1),
      topCity: entries[0]?.city || city || 'India',
      topCategory: 'transport',
      weekNumber,
    });
  };

  const CITIES_FILTER = ['All India', 'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kerala', 'Kolkata', 'Pune'];

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <section className="leaderboard" aria-label="Community Leaderboard">
      <div className="section-header">
        <h2 className="section-title">🏆 Community Leaderboard</h2>
        <p className="section-desc">
          See how EcoSense India users are reducing their carbon footprint together.
          All data is anonymised — only your username and reduction % are shown.
        </p>
      </div>

      {/* Opt-in Banner */}
      {!optedIn && (
        <div className="opt-in-banner">
          <div>
            <p className="opt-in-title">Join the Community</p>
            <p className="opt-in-desc">Share your anonymised progress and see how you compare to other EcoSense India users.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOptIn}>
            🏆 Join Leaderboard
          </button>
        </div>
      )}

      {optedIn && userEntry && (
        <div className="user-rank-card">
          <span className="user-rank-badge">Your Handle: {userEntry.displayName}</span>
          <span className="user-reduction">🎯 {userEntry.reductionPercent}% reduced</span>
          <span className="user-city">📍 {userEntry.city}</span>
        </div>
      )}

      {/* City Filter */}
      <div className="city-filter-row" role="group" aria-label="Filter by city">
        {CITIES_FILTER.map(c => (
          <button
            key={c}
            className={`filter-chip ${cityFilter === c ? 'active' : ''}`}
            onClick={() => setCityFilter(c)}
            aria-pressed={cityFilter === c}
          >
            {c}
          </button>
        ))}
      </div>

      {/* AI Community Insight */}
      <div className="leaderboard-insight-row">
        <button className="btn btn-ghost btn-sm" onClick={handleGetInsight} disabled={insightLoading} aria-busy={insightLoading}>
          {insightLoading ? '…' : '✨ Get Community Insight'}
        </button>
        {insight && (
          <div className="community-insight" aria-live="polite">
            <p className="insight-summary">{insight.summary}</p>
            <p className="insight-highlight">🌟 {insight.highlight}</p>
            <p className="insight-cta">💬 {insight.callToAction}</p>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table" role="table" aria-label="Carbon reduction leaderboard">
        <div className="table-header" role="row">
          <span role="columnheader">Rank</span>
          <span role="columnheader">User</span>
          <span role="columnheader">City</span>
          <span role="columnheader">Reduction</span>
        </div>

        {loadingEntries ? (
          <div className="table-loading" role="status" aria-live="polite">Loading community data…</div>
        ) : entries.length === 0 ? (
          <div className="table-empty">No entries yet — be the first to join!</div>
        ) : (
          entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`table-row ${entry.id === user?.uid ? 'highlight' : ''}`}
              role="row"
            >
              <span role="cell" className="rank-cell">{getMedal(i + 1)}</span>
              <span role="cell" className="name-cell">{entry.displayName}</span>
              <span role="cell" className="city-cell">📍 {entry.city}</span>
              <span role="cell" className="reduction-cell">
                <span className="reduction-bar-track">
                  <span className="reduction-bar-fill" style={{ width: `${Math.min(entry.reductionPercent * 3, 100)}%` }} />
                </span>
                {entry.reductionPercent}%
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
