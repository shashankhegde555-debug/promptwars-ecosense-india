import { z } from 'zod';

// ── Calculator Schema ────────────────────────────────────────────────────────

export const CalculatorSchema = z.discriminatedUnion('isCalculation', [
  z.object({
    isCalculation: z.literal(true),
    totalCarbonKg: z.number().min(0),
    category: z.enum(['transport', 'food', 'energy', 'shopping', 'waste']),
    breakdown: z.array(
      z.object({
        item: z.string().min(1),
        carbonKg: z.number().min(0),
        explanation: z.string().min(1),
      })
    ).min(1),
    equivalents: z.array(z.string()).min(1),
    tips: z.array(z.string()).min(1),
    impactLevel: z.enum(['low', 'moderate', 'high', 'very-high']),
  }),
  z.object({
    isCalculation: z.literal(false),
    reply: z.string().min(1),
  })
]);

// ── Insights Schema ──────────────────────────────────────────────────────────

export const InsightsSchema = z.object({
  summary: z.string().min(10),
  topSource: z.string().min(1),
  insights: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(10),
      potentialSavingKg: z.number().min(0),
      priority: z.enum(['high', 'medium', 'low']),
    })
  ).min(1),
  weeklyTrend: z.string().min(1),
  comparisonToAverage: z.string().min(1),
  cityInsight: z.string().optional(),
});

// ── Actions Schema ───────────────────────────────────────────────────────────

export const ActionsSchema = z.object({
  category: z.string().min(1),
  actions: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(10),
      savingKgPerYear: z.number().min(0),
      difficulty: z.enum(['easy', 'medium', 'committed']),
      icon: z.string().min(1),
      indiaContext: z.string().optional(),
    })
  ).length(6),
});

// ── Pledge Schema ────────────────────────────────────────────────────────────

export const PledgeSchema = z.object({
  status: z.enum(['on-track', 'slightly-behind', 'behind', 'achieved']),
  progressPercent: z.number().min(0).max(100),
  message: z.string().min(1),
  tips: z.array(
    z.object({
      action: z.string().min(1),
      savingKgPerDay: z.number().min(0),
      timeframe: z.enum(['today', 'this week', 'this month']),
      difficulty: z.enum(['easy', 'medium', 'committed']),
    })
  ).length(3),
  projectedEndKg: z.number().min(0),
  weeklyChallenge: z.string().min(1),
});

// ── Leaderboard Insight Schema ───────────────────────────────────────────────

export const LeaderboardInsightSchema = z.object({
  summary: z.string().min(10),
  highlight: z.string().min(1),
  topCategory: z.string().min(1),
  callToAction: z.string().min(1),
});

// ── Onboarding Schema ────────────────────────────────────────────────────────

export const OnboardingSchema = z.object({
  greeting: z.string().min(1),
  cityFact: z.string().min(1),
  quickWin: z.string().min(1),
  gridInfo: z.string().min(1),
});

/**
 * Parse and validate an AI JSON response against a Zod schema.
 * @param {string} text - Raw text from Gemini
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {{ data: object, error: string|null }}
 */
export function parseAIResponse(text, schema) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { data: null, error: 'No JSON found in AI response' };
    const parsed = JSON.parse(jsonMatch[0]);
    const result = schema.safeParse(parsed);
    if (!result.success) {
      return { data: null, error: result.error.message };
    }
    return { data: result.data, error: null };
  } catch (err) {
    return { data: null, error: `JSON parse error: ${err.message}` };
  }
}
