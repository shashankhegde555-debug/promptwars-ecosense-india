import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import xss from 'xss';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger.js';
import { LIMITS } from './constants.js';

// ── Security Headers ────────────────────────────────────────────────────────

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: [
        "'self'",
        'https://*.googleapis.com',
        'https://*.firebaseio.com',
        'https://firestore.googleapis.com',
        'https://identitytoolkit.googleapis.com',
        'https://securetoken.googleapis.com',
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
});

// ── CORS ────────────────────────────────────────────────────────────────────

export const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://ecosense-india.run.app', /\.run\.app$/]
    : ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
});

// ── Rate Limiting ───────────────────────────────────────────────────────────

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', code: 'RATE_LIMIT' },
});

// ── Request ID ──────────────────────────────────────────────────────────────

export function requestId(req, res, next) {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
}

// ── Request Logger ──────────────────────────────────────────────────────────

export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      id: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
}

// ── XSS Sanitizer ───────────────────────────────────────────────────────────

export function sanitizeInput(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
}

function sanitizeObject(obj) {
  if (typeof obj === 'string') return xss(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitizeObject(v)]));
  }
  return obj;
}

// ── Input Length Guard ──────────────────────────────────────────────────────

export function validateInputLength(field, maxLen) {
  return (req, res, next) => {
    const val = req.body?.[field];
    if (val && typeof val === 'string' && val.length > maxLen) {
      return res.status(400).json({
        error: `${field} exceeds maximum length of ${maxLen} characters`,
        code: 'VALIDATION_ERROR',
      });
    }
    next();
  };
}

// ── Compression ─────────────────────────────────────────────────────────────

export const compressionMiddleware = compression();
