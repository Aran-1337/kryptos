const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const config = require('./config');
const errorHandler = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// ─── Security Middlewares ────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'http://localhost:3000', 'http://localhost:5000'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    xFrameOptions: { action: 'deny' },
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

if (config.trustProxy) {
  app.set('trust proxy', 1);
} else {
  app.set('trust proxy', false);
}

// Rate limiting (Baseline global protection on /api)
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
app.use('/api', globalLimiter);

// ─── General Middlewares ─────────────────────────────────────────────────────
app.use(compression());
app.use(
  express.json({
    limit: '10kb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
const { securitySanitizer } = require('./middlewares/sanitizer.middleware');
app.use(cookieParser());
app.use(securitySanitizer); // Prevent operator injection & prototype pollution
app.use(mongoSanitize()); // Strip NoSQL injection operators as second defense line

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ──────────────────────────────────────────────────────────────────
app.all('/api/ext/*', (req, res) => res.status(200).json({}));
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({ status: 'fail', message: `المسار ${req.originalUrl} غير موجود` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
