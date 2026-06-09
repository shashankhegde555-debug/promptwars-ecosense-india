import { vi } from 'vitest';
import '@testing-library/jest-dom';

// ── Mock DOM APIs ────────────────────────────────────────────────────────────
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ── Mock Firebase ────────────────────────────────────────────────────────────
vi.mock('firebase/app', () => ({
  initializeApp: () => ({}),
}));

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: null }),
  GoogleAuthProvider: class {},
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: (auth, callback) => {
    callback(null);
    return () => {};
  },
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => ({ exists: () => false, data: () => ({}) })),
  getDocs: vi.fn(() => ({ docs: [] })),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: (q, callback) => {
    callback({ docs: [] });
    return () => {};
  },
  serverTimestamp: () => new Date(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: () => ({}),
  logEvent: vi.fn(),
}));

vi.mock('firebase/performance', () => ({
  getPerformance: () => ({}),
  trace: () => ({ start: () => {}, stop: () => {} }),
}));

// ── Mock Google Cloud SDKs ──────────────────────────────────────────────────
vi.mock('@google-cloud/logging', () => ({
  Logging: class {
    log() {
      return { entry: () => ({}), write: () => Promise.resolve() };
    }
  },
}));

vi.mock('@google-cloud/storage', () => ({
  Storage: class {
    bucket() {
      return { file: () => ({ save: () => Promise.resolve() }) };
    }
  },
}));

vi.mock('@google-cloud/bigquery', () => {
  const bq = class {
    dataset() {
      return {
        table: () => ({ insert: () => Promise.resolve() }),
      };
    }
    query() {
      return Promise.resolve([[]]);
    }
  };
  bq.timestamp = (date) => date;
  return { BigQuery: bq };
});

vi.mock('@google-cloud/secret-manager', () => ({
  SecretManagerServiceClient: class {
    accessSecretVersion() {
      return Promise.resolve([{ payload: { data: { toString: () => 'mock-secret' } } }]);
    }
  },
}));

vi.mock('@google-cloud/error-reporting', () => ({
  ErrorReporting: class {
    report() {}
  },
}));

// ── Mock Gemini Generative AI dynamically based on system instructions ──────
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel(options) {
      const instr = (options?.systemInstruction || '').toLowerCase();
      return {
        generateContent: () => {
          let payload = {
            isCalculation: true,
            totalCarbonKg: 1.2,
            category: 'transport',
            breakdown: [{ item: 'Auto ride', carbonKg: 1.2, explanation: '0.09 kg/km' }],
            equivalents: ['Charging 50 phones'],
            tips: ['Use public transport'],
            impactLevel: 'low',
          };

          if (instr.includes('calculator') || instr.includes('ecosense assistant')) {
            payload = {
              isCalculation: true,
              totalCarbonKg: 1.2,
              category: 'transport',
              breakdown: [{ item: 'Auto ride', carbonKg: 1.2, explanation: '0.09 kg/km' }],
              equivalents: ['Charging 50 phones'],
              tips: ['Use public transport'],
              impactLevel: 'low',
            };
          } else if (instr.includes('insights')) {
            payload = {
              summary: 'You are doing great this week. Keep active.',
              topSource: 'energy',
              insights: [{ title: 'Switch AC off', description: 'Using AC for 8 hours is high.', potentialSavingKg: 3.2, priority: 'high' }],
              weeklyTrend: 'Decreasing by 10%',
              comparisonToAverage: 'Below India average',
              cityInsight: 'Chennai is warm today.',
            };
          } else if (instr.includes('actions')) {
            payload = {
              category: 'transport',
              actions: Array(6).fill({
                title: 'Walk short distances',
                description: 'Walking instead of taking vehicles is excellent for health and footprint.',
                savingKgPerYear: 120,
                difficulty: 'easy',
                icon: '🚶',
                indiaContext: 'FAME scheme EV tips',
              }),
            };
          } else if (instr.includes('pledge')) {
            payload = {
              status: 'on-track',
              progressPercent: 50,
              message: 'Great progress this month!',
              tips: Array(3).fill({
                action: 'Turn off appliances when not in use',
                savingKgPerDay: 0.5,
                timeframe: 'today',
                difficulty: 'easy',
              }),
              projectedEndKg: 100,
              weeklyChallenge: 'Do one vegetarian day',
            };
          } else if (instr.includes('leaderboard') || instr.includes('community analyst')) {
            payload = {
              summary: 'Our community has avoided a significant amount of carbon this week.',
              highlight: 'Avoided 2.3 tonnes of CO2',
              topCategory: 'transport',
              callToAction: 'Track all activities to stay updated',
            };
          } else if (instr.includes('welcome guide') || instr.includes('onboarding')) {
            payload = {
              greeting: 'Welcome to Mumbai!',
              cityFact: 'Mumbai has local train grid options.',
              quickWin: 'Use Local train instead of cab.',
              gridInfo: 'Maharashtra grid factor is 0.71 kg/kWh.',
            };
          }

          return Promise.resolve({
            response: {
              text: () => JSON.stringify(payload),
            },
          });
        },
      };
    }
  },
}));

// Mock native fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);
