import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth.js';
import { TABS } from '../constants.js';
import Dashboard from './Dashboard.jsx';
import AIAssistant from './AIAssistant.jsx';
import TodoList from './TodoList.jsx';
import Tracker from './Tracker.jsx';
import Actions from './Actions.jsx';
import Insights from './Insights.jsx';
import Pledge from './Pledge.jsx';
import Leaderboard from './Leaderboard.jsx';
import AuthButton from './AuthButton.jsx';
import CitySelector from './CitySelector.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading } = useAuth();

  // ── Theme ──────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('ecosense_theme') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('ecosense_theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // ── Keyboard navigation for tabs ──────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentIdx = TABS.findIndex(t => t.id === activeTab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveTab(TABS[(currentIdx + 1) % TABS.length].id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveTab(TABS[(currentIdx - 1 + TABS.length) % TABS.length].id);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveTab(TABS[0].id);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveTab(TABS[TABS.length - 1].id);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard onTabChange={setActiveTab} />;
      case 'todo':       return <TodoList />;
      case 'tracker':    return <Tracker />;
      case 'actions':    return <Actions />;
      case 'insights':   return <Insights />;
      case 'pledge':     return <Pledge />;
      case 'leaderboard': return <Leaderboard />;
      case 'assistant':  return <AIAssistant />;
      default:           return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  if (loading) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading EcoSense India…</p>
      </div>
    );
  }

  return (
    <>
      {/* Skip navigation link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Live region for screen readers */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="live-region" />

      <div className="app">
        <header className="app-header" role="banner">
          <div className="header-brand">
            <span className="brand-icon" aria-hidden="true">🌿</span>
            <div>
              <div className="brand-title-row">
                <h1 className="brand-name">EcoSense India</h1>
                <div className="about-trigger">
                  <button className="about-btn" aria-label="About EcoSense India" type="button">!</button>
                  <div className="about-tooltip">
                    <h3>About EcoSense India</h3>
                    <p>An AI-powered carbon footprint awareness platform tailored for Indian lifestyles. Calculate your daily activities, discover context-aware eco-actions, commit to reduction pledges, and compete on the community leaderboard.</p>
                  </div>
                </div>
              </div>
              <p className="brand-tagline">Track, understand, and reduce your carbon footprint</p>
            </div>
          </div>
          <div className="header-actions">
            <CitySelector />
            {/* Theme toggle */}
            <button
              id="theme-toggle-btn"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="theme-toggle-track">
                <span className="theme-toggle-thumb">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
              </span>
            </button>
            <AuthButton />
          </div>
        </header>

        <nav className="tab-nav" role="tablist" aria-label="Main navigation">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              <span className="tab-emoji" aria-hidden="true">{tab.emoji}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main
          id="main-content"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="tab-panel"
          tabIndex={0}
        >
          {renderTab()}
        </main>

        <footer role="contentinfo" className="app-footer">
          <p>
            🌱 EcoSense India — Built with{' '}
            <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer">Google Cloud</a>
            {' '}+{' '}
            <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer">Gemini AI</a>
            {' '}· #BuildwithAI #PromptWarsVirtual
          </p>
        </footer>
      </div>
    </>
  );
}

App.propTypes = {};
