// Firebase client-side config — populated from VITE_ environment variables
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';

/**
 * Firebase configuration — values come from .env (VITE_ prefix = exposed to browser).
 * Client-side service 8-11.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ── Initialize Firebase ───────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);

// Service 8: Firebase Auth (Google Sign-In popup)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Service 9: Firestore (real-time persistence)
export const db = getFirestore(app);

// Service 10: Firebase Analytics (engagement tracking)
let analytics = null;
let perf = null;
try {
  analytics = getAnalytics(app);
  // Service 11: Firebase Performance (Real User Monitoring)
  perf = getPerformance(app);
} catch {
  // Analytics/Performance not available in SSR or test environments
}

export { analytics, perf };

/**
 * Log a Firebase Analytics event safely.
 * @param {string} eventName - Event name
 * @param {object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch {
      // Silently fail in non-analytics environments
    }
  }
}

/**
 * Create a Firebase Performance trace.
 * @param {string} traceName - Trace name (e.g. 'gemini_calculate')
 * @returns {object|null} Trace object or null
 */
export function createTrace(traceName) {
  if (perf) {
    try {
      return trace(perf, traceName);
    } catch {
      return null;
    }
  }
  return null;
}
