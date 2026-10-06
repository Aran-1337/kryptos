require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  mongo: {
    uri: process.env.MONGO_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },

  encryption: {
    key: process.env.ENCRYPTION_KEY,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },

  trustProxy: process.env.TRUST_PROXY === 'true',

  maxDevices: 2,

  payment: {
    maxAttempts: parseInt(process.env.PAYMENT_MAX_ATTEMPTS, 10) || 5,
    sessionTimeoutMs: parseInt(process.env.PAYMENT_SESSION_TIMEOUT_MS, 10) || 10000,
  },

  kashier: {
    merchantId: process.env.KASHIER_MERCHANT_ID,
    paymentApiKey: process.env.KASHIER_PAYMENT_API_KEY,
    secretApiKey: process.env.KASHIER_SECRET_API_KEY,
    environment: (process.env.KASHIER_ENVIRONMENT || 'test').toLowerCase(),
    testBaseUrl: process.env.KASHIER_TEST_BASE_URL || 'https://test-api.kashier.io',
    liveBaseUrl: process.env.KASHIER_LIVE_BASE_URL || 'https://api.kashier.io',
  },

  validateProductionConfig: function (cfg = this) {
    if (cfg.env === 'production') {
      const errors = [];
      if (!cfg.jwt?.secret || cfg.jwt.secret.includes('change_in_production') || cfg.jwt.secret.length < 32) {
        errors.push('JWT_SECRET must be configured with a secure random key (at least 32 characters) in production');
      }
      if (!cfg.jwt?.refreshSecret || cfg.jwt.refreshSecret.includes('change_in_production') || cfg.jwt.refreshSecret.length < 32) {
        errors.push('JWT_REFRESH_SECRET must be configured with a secure random key (at least 32 characters) in production');
      }
      if (!cfg.mongo?.uri) {
        errors.push('MONGO_URI must be provided in production');
      }
      if (errors.length > 0) {
        const err = new Error(`Production Configuration Validation Failed:\n- ${errors.join('\n- ')}`);
        err.validationErrors = errors;
        throw err;
      }
    }
  },
};
