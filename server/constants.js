// HTTP Status Codes
export const HTTP = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  INTERNAL: 'INTERNAL_ERROR',
};

// Cache prefixes
export const CACHE = {
  ACTIONS: 'actions_',
  INSIGHTS: 'insights_',
  LEADERBOARD: 'leaderboard_',
  STATS: 'stats_',
};

// API endpoint paths
export const ENDPOINTS = {
  CALCULATE: '/api/calculate',
  INSIGHTS: '/api/insights',
  ACTIONS: '/api/actions',
  PLEDGE_TIPS: '/api/pledge/tips',
  LEADERBOARD: '/api/leaderboard',
  LEADERBOARD_INSIGHT: '/api/leaderboard/insight',
  STATS: '/api/stats',
  HEALTH: '/api/health',
};

// Input limits
export const LIMITS = {
  CALCULATOR_INPUT: 500,
  ACTIVITY_NAME: 200,
  PLEDGE_CONTEXT: 1000,
};
