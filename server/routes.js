import express from 'express';
import xss from 'xss';
import { generateWithGemini, writeCloudLog, uploadToGCS, insertCalculationAnalytics, insertPledgeAnalytics, reportError } from './googleServices.js';
import { CALCULATOR_INSTRUCTION, INSIGHTS_INSTRUCTION, ACTIONS_INSTRUCTION, PLEDGE_INSTRUCTION, LEADERBOARD_INSTRUCTION, ONBOARDING_INSTRUCTION } from './prompts.js';
import { CalculatorSchema, InsightsSchema, ActionsSchema, PledgeSchema, LeaderboardInsightSchema, OnboardingSchema, parseAIResponse } from './schemas.js';
import { cacheKey, cacheGet, cacheSet } from './cache.js';
import { CACHE, LIMITS, HTTP } from './constants.js';
import { ValidationError, AIServiceError } from './errors.js';
import { logger } from './logger.js';

const router = express.Router();

// ── Health Check ─────────────────────────────────────────────────────────────

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ecosense-india', timestamp: new Date().toISOString() });
});

// ── Calculator ───────────────────────────────────────────────────────────────

router.post('/calculate', async (req, res, next) => {
  try {
    const { activity, city } = req.body;
    if (!activity || typeof activity !== 'string') {
      throw new ValidationError('activity is required and must be a string');
    }
    if (activity.length > LIMITS.CALCULATOR_INPUT) {
      throw new ValidationError(`activity exceeds maximum length of ${LIMITS.CALCULATOR_INPUT}`);
    }

    const sanitized = xss(activity.trim());
    const cityContext = city ? ` (User is in ${city})` : '';
    const key = cacheKey(CACHE.ACTIONS, sanitized + cityContext);
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    const raw = await generateWithGemini(CALCULATOR_INSTRUCTION, sanitized + cityContext);
    const { data, error } = parseAIResponse(raw, CalculatorSchema);
    if (error) throw new AIServiceError(`Invalid AI response: ${error}`);

    cacheSet(key, data, 1800);

    // Analytics (non-blocking)
    insertCalculationAnalytics({
      category: data.category,
      carbonKg: data.totalCarbonKg,
      requestId: req.id,
      city: city || 'unknown',
    }).catch(() => {});

    await writeCloudLog('INFO', 'Carbon calculated', { category: data.category, requestId: req.id });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ── AI Insights ──────────────────────────────────────────────────────────────

router.post('/insights', async (req, res, next) => {
  try {
    const { activities, city, totalDays } = req.body;
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      throw new ValidationError('activities must be a non-empty array');
    }

    const key = cacheKey(CACHE.INSIGHTS, { activities: activities.slice(0, 20), city });
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    const summary = activities
      .slice(0, 30)
      .map(a => `${a.category}: ${a.carbonKg}kg (${a.name || 'activity'})`)
      .join(', ');

    const userMessage = `User activities over ${totalDays || 7} days in ${city || 'India'}: ${summary}`;
    const raw = await generateWithGemini(INSIGHTS_INSTRUCTION, userMessage);
    const { data, error } = parseAIResponse(raw, InsightsSchema);
    if (error) throw new AIServiceError(`Invalid AI response: ${error}`);

    cacheSet(key, data, 3600);
    await writeCloudLog('INFO', 'Insights generated', { city: city || 'unknown', requestId: req.id });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ── Eco-Actions ──────────────────────────────────────────────────────────────

router.post('/actions', async (req, res, next) => {
  try {
    const { category, city } = req.body;
    if (!category) throw new ValidationError('category is required');

    const key = cacheKey(CACHE.ACTIONS, { category, city });
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    const userMessage = `Generate reduction actions for category: ${category}. User is in ${city || 'India'}.`;
    const raw = await generateWithGemini(ACTIONS_INSTRUCTION, userMessage);
    const { data, error } = parseAIResponse(raw, ActionsSchema);
    if (error) throw new AIServiceError(`Invalid AI response: ${error}`);

    cacheSet(key, data, 86400); // 24h cache — actions don't change often
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ── Pledge Tips ───────────────────────────────────────────────────────────────

router.post('/pledge/tips', async (req, res, next) => {
  try {
    const { targetReductionPercent, baselineKgPerDay, currentKgPerDay, daysIntoMonth, daysRemaining, city } = req.body;
    if (!targetReductionPercent || !baselineKgPerDay || currentKgPerDay === undefined) {
      throw new ValidationError('targetReductionPercent, baselineKgPerDay, currentKgPerDay are required');
    }

    const userMessage = JSON.stringify({
      targetReductionPercent,
      baselineKgPerDay,
      currentKgPerDay,
      daysIntoMonth: daysIntoMonth || 1,
      daysRemaining: daysRemaining || 30,
      city: city || 'India',
    });

    const raw = await generateWithGemini(PLEDGE_INSTRUCTION, userMessage);
    const { data, error } = parseAIResponse(raw, PledgeSchema);
    if (error) throw new AIServiceError(`Invalid AI response: ${error}`);

    // Analytics
    insertPledgeAnalytics({
      targetReductionPercent,
      currentKgPerDay,
      city: city || 'unknown',
      requestId: req.id,
    }).catch(() => {});

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ── Leaderboard ───────────────────────────────────────────────────────────────

router.post('/leaderboard/insight', async (req, res, next) => {
  try {
    const { totalUsers, totalCO2Avoided, topCity, topCategory, weekNumber } = req.body;

    const key = cacheKey(CACHE.LEADERBOARD, { weekNumber });
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    const userMessage = JSON.stringify({ totalUsers, totalCO2Avoided, topCity, topCategory, weekNumber });
    const raw = await generateWithGemini(LEADERBOARD_INSTRUCTION, userMessage);
    const { data, error } = parseAIResponse(raw, LeaderboardInsightSchema);
    if (error) throw new AIServiceError(`Invalid AI response: ${error}`);

    cacheSet(key, data, 3600);

    // Export weekly snapshot to GCS
    uploadToGCS(`leaderboard/week-${weekNumber || 'current'}.json`, { data, generatedAt: new Date().toISOString() }).catch(() => {});

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ── Onboarding ────────────────────────────────────────────────────────────────

router.post('/onboarding', async (req, res, next) => {
  try {
    const { city } = req.body;
    if (!city) throw new ValidationError('city is required');

    const key = cacheKey(CACHE.STATS, { city });
    const cached = cacheGet(key);
    if (cached) return res.json(cached);

    const raw = await generateWithGemini(ONBOARDING_INSTRUCTION, `User's city: ${city}`);
    const { data, error } = parseAIResponse(raw, OnboardingSchema);
    if (error) throw new AIServiceError(`Invalid AI response: ${error}`);

    cacheSet(key, data, 86400);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ── Error Handler ─────────────────────────────────────────────────────────────

router.use((err, req, res, _next) => {
  const status = err.statusCode || HTTP.INTERNAL_ERROR;
  const code = err.code || 'INTERNAL_ERROR';

  if (!err.isOperational) {
    reportError(err, { requestId: req.id });
  }

  logger.error({ err, requestId: req.id }, err.message);

  res.status(status).json({
    error: err.message || 'Something went wrong',
    code,
    requestId: req.id,
  });
});

export default router;
