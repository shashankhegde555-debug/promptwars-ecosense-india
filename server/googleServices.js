/**
 * @fileoverview Google Cloud services integration for EcoSense India.
 *
 * Server-side GCP services (7):
 *  1. Gemini 2.5 Flash      — AI calculations, insights, actions, pledge, leaderboard
 *  2. Cloud Logging          — Structured observability
 *  3. Cloud Storage          — Analytics exports, leaderboard snapshots
 *  4. BigQuery               — Pledge trends, community aggregate analytics
 *  5. Secret Manager         — Secure API key management
 *  6. Error Reporting        — Production error tracking
 *  7. Cloud Run              — Deployment (see Dockerfile)
 *
 * Client-side Firebase services (5) — in src/firebase.js:
 *  8.  Firebase Auth         — Google Sign-In
 *  9.  Firestore             — Activity, pledge, leaderboard persistence
 *  10. Firebase Analytics    — User engagement events
 *  11. Firebase Performance  — Real User Monitoring
 *  12. Google Fonts          — Inter typeface CDN
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logging } from '@google-cloud/logging';
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';
import { ErrorReporting } from '@google-cloud/error-reporting';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import config from './config.js';
import { logger } from './logger.js';
import { AIServiceError } from './errors.js';

// ── 1. Gemini 2.5 Flash ─────────────────────────────────────────────────────

export const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * Generate content using Gemini with a system instruction.
 * @param {string} systemInstruction - Gemini system prompt
 * @param {string} userMessage - User input
 * @returns {Promise<string>} Generated text
 */
export async function generateWithGemini(systemInstruction, userMessage) {
  const modelName = config.gemini.model; // 'gemini-2.5-flash'
  let lastError = null;
  const maxRetries = 3;
  let delay = 1000; // start with 1s delay

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: { responseMimeType: 'application/json' },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      });
      const result = await model.generateContent(userMessage);
      return result.response.text();
    } catch (err) {
      lastError = err;
      logger.warn(`Failed to generate with ${modelName} on attempt ${attempt}: ${err.message}.`);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      }
    }
  }
  throw new AIServiceError(`Gemini service failed after ${maxRetries} attempts: ${lastError?.message || lastError}`);
}

// Helper to check if GCP clients should be initialized.
// Requires GOOGLE_APPLICATION_CREDENTIALS to be set so that on non-GCP
// hosts like Render (which have no service account), all GCP SDK clients
// are silently skipped and the server starts cleanly.
function shouldInitGCP() {
  const hasCredentials =
    !!process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.K_SERVICE != null; // K_SERVICE is set by Cloud Run automatically
  return (config.isProduction || config.nodeEnv === 'test') && hasCredentials;
}

// ── 2. Cloud Logging ────────────────────────────────────────────────────────
// Lazy-initialized and only active in production/test environments

let _cloudLog = null;
function getCloudLog() {
  if (!shouldInitGCP()) return null;
  if (!_cloudLog) {
    try {
      const cloudLogging = new Logging({ projectId: config.gcp.projectId });
      _cloudLog = cloudLogging.log('ecosense-server');
    } catch {
      return null;
    }
  }
  return _cloudLog;
}

export async function writeCloudLog(severity, message, data = {}) {
  try {
    const cloudLog = getCloudLog();
    if (!cloudLog) return;
    const entry = cloudLog.entry(
      { severity, resource: { type: 'cloud_run_revision' } },
      { message, ...data, service: 'ecosense-india', timestamp: new Date().toISOString() }
    );
    await cloudLog.write(entry);
  } catch {
    // Fail silently in case of logging network errors
  }
}

// ── 3. Cloud Storage ────────────────────────────────────────────────────────

let _storage = null;
function getStorage() {
  if (!shouldInitGCP()) return null;
  if (!_storage) {
    try { _storage = new Storage({ projectId: config.gcp.projectId }); } catch { return null; }
  }
  return _storage;
}

export async function uploadToGCS(fileName, data) {
  try {
    const store = getStorage();
    if (!store) {
      logger.info({ file: fileName }, 'GCS upload skipped (local dev mode)');
      return null;
    }
    const bucket = store.bucket(config.gcp.bucketName);
    const file = bucket.file(fileName);
    await file.save(JSON.stringify(data, null, 2), {
      contentType: 'application/json',
      metadata: { cacheControl: 'public, max-age=3600' },
    });
    logger.info({ bucket: config.gcp.bucketName, file: fileName }, 'Uploaded to GCS');
    return `gs://${config.gcp.bucketName}/${fileName}`;
  } catch (err) {
    logger.warn({ error: err.message }, 'GCS upload failed');
    return null;
  }
}

// ── 4. BigQuery ─────────────────────────────────────────────────────────────

let _bigquery = null;
function getBigQuery() {
  if (!shouldInitGCP()) return null;
  if (!_bigquery) {
    try { _bigquery = new BigQuery({ projectId: config.gcp.projectId }); } catch { return null; }
  }
  return _bigquery;
}

export async function insertCalculationAnalytics(data) {
  try {
    const bq = getBigQuery();
    if (!bq) {
      logger.info({ category: data.category }, 'Calculation analytics logged (BigQuery skipped in local dev)');
      return true;
    }
    const dataset = bq.dataset(config.gcp.bigqueryDataset);
    const table = dataset.table('calculations');
    await table.insert([{ ...data, timestamp: BigQuery.timestamp(new Date()) }]);
    logger.info({ category: data.category }, 'Calculation analytics → BigQuery');
    return true;
  } catch (err) {
    logger.warn({ error: err.message }, 'BigQuery insert skipped');
    return false;
  }
}

export async function insertPledgeAnalytics(data) {
  try {
    const bq = getBigQuery();
    if (!bq) {
      logger.info({ userId: data.userId }, 'Pledge analytics logged (BigQuery skipped in local dev)');
      return true;
    }
    const dataset = bq.dataset(config.gcp.bigqueryDataset);
    const table = dataset.table('pledges');
    await table.insert([{ ...data, timestamp: BigQuery.timestamp(new Date()) }]);
    logger.info({ userId: data.userId }, 'Pledge analytics → BigQuery');
    return true;
  } catch (err) {
    logger.warn({ error: err.message }, 'BigQuery pledge insert skipped');
    return false;
  }
}

export async function getLeaderboardStats() {
  try {
    const bq = getBigQuery();
    if (!bq) return [];
    const query = `
      SELECT city, AVG(reductionPercent) as avg_reduction, COUNT(*) as users
      FROM \`${config.gcp.projectId}.${config.gcp.bigqueryDataset}.leaderboard\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
      GROUP BY city
      ORDER BY avg_reduction DESC
      LIMIT 10
    `;
    const [rows] = await bq.query({ query });
    return rows;
  } catch (err) {
    logger.warn({ error: err.message }, 'BigQuery leaderboard query skipped');
    return [];
  }
}

export async function getCalculationStats() {
  try {
    const bq = getBigQuery();
    if (!bq) return [];
    const query = `
      SELECT category, COUNT(*) as calculations, AVG(carbonKg) as avg_carbon
      FROM \`${config.gcp.projectId}.${config.gcp.bigqueryDataset}.calculations\`
      GROUP BY category
      ORDER BY calculations DESC
      LIMIT 10
    `;
    const [rows] = await bq.query({ query });
    return rows;
  } catch (err) {
    logger.warn({ error: err.message }, 'BigQuery stats query skipped');
    return [];
  }
}

// ── 5. Secret Manager ───────────────────────────────────────────────────────
// Lazy-initialized and only active in production

let _secretManager = null;
function getSecretManager() {
  if (!shouldInitGCP()) return null;
  if (!_secretManager) {
    try { _secretManager = new SecretManagerServiceClient(); } catch { return null; }
  }
  return _secretManager;
}

export async function getSecret(secretName) {
  try {
    const sm = getSecretManager();
    if (!sm) return null;
    const name = `projects/${config.gcp.projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await sm.accessSecretVersion({ name });
    return version.payload.data.toString('utf8');
  } catch (err) {
    logger.warn({ error: err.message }, 'Secret Manager access skipped (using env vars)');
    return null;
  }
}

// ── 6. Error Reporting ──────────────────────────────────────────────────────

let _errorReporting = null;
function getErrorReporting() {
  if (!shouldInitGCP()) return null;
  if (!_errorReporting) {
    try {
      _errorReporting = new ErrorReporting({
        projectId: config.gcp.projectId,
        reportMode: 'always',
        serviceContext: { service: 'ecosense-india', version: '1.0.0' },
      });
    } catch {
      return null;
    }
  }
  return _errorReporting;
}

export function reportError(error, context = {}) {
  try {
    const errRep = getErrorReporting();
    if (errRep) {
      errRep.report(error);
    }
  } catch {
    // Ignore error reporting failures
  }
  logger.error({ error: error.message, ...context }, 'Application error');
}
