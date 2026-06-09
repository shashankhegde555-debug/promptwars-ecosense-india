import 'dotenv/config';
import express from 'express';
import { helmetMiddleware, corsMiddleware, compressionMiddleware, rateLimiter, requestId, requestLogger, sanitizeInput } from './server/middleware.js';
import router from './server/routes.js';
import { logger } from './server/logger.js';
import config from './server/config.js';
import { writeCloudLog } from './server/googleServices.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(requestId);
app.use(requestLogger);
app.use(sanitizeInput);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', rateLimiter, router);

// ── Serve React SPA (production) ──────────────────────────────────────────────
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/{*path}', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// ── Start Server ──────────────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  logger.info(`🌿 EcoSense India API running on port ${config.port} [${config.nodeEnv}]`);
  // Only write to Cloud Logging in production (avoids gRPC auth errors in local dev)
  if (config.isProduction) {
    writeCloudLog('INFO', 'Server started', { port: config.port, env: config.nodeEnv });
  }
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after 10s');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Prevent GCP SDK async credential errors from killing the process in local dev
process.on('unhandledRejection', (reason) => {
  const msg = reason?.message || String(reason);
  if (msg.includes('credentials') || msg.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
    logger.warn('GCP credentials not configured — GCP services disabled in local dev');
  } else {
    logger.error({ err: msg }, 'Unhandled rejection');
  }
});

export default app;
