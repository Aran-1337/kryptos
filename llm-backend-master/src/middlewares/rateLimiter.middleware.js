const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Factory to create rate limiters with consistent options:
 * - standardHeaders: true (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After on 429)
 * - legacyHeaders: false (disable X-RateLimit-* headers)
 * - statusCode: 429
 * - Uniform JSON response: { status: 'fail', message: '...' }
 */
const createLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً',
    keyGenerator = (req) => req.ip,
    skip = () => false,
  } = options;

  return rateLimit({
    windowMs,
    limit: max,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: { status: 'fail', message },
    handler: (req, res, next, opts) => {
      res.status(opts.statusCode).json(opts.message);
    },
    keyGenerator,
    skip,
    validate: { xForwardedForHeader: false, default: true },
  });
};

// 1. Global Baseline API Limiter (applied to /api)
const globalLimiter = createLimiter({
  windowMs: config.rateLimit?.windowMs || 15 * 60 * 1000,
  max: config.rateLimit?.max || 100,
  message: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً',
});

// 2. Auth Limiter (login, register, team login)
// Max 10 requests / 15 minutes per IP
// Keyed strictly by IP to prevent account-lockout DoS on victims
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX) || 10,
  message: 'محاولات تسجيل دخول كثيرة جداً. يرجى المحاولة بعد 15 دقيقة',
});

// 3. Password Reset Limiter (forgot-password, reset-password, change-password)
// Max 5 requests / 15 minutes per IP
const passwordResetLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_PASSWORD_RESET_MAX) || 5,
  message: 'محاولات استعادة كلمة المرور كثيرة جداً. يرجى المحاولة لاحقاً',
});

// 4. OTP & Verification Limiter (verify-email, resend-verification, accept-invite)
// Max 5 requests / 15 minutes per IP
const otpLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_OTP_MAX) || 5,
  message: 'تجاوزت الحد المسموح لمحاولات التحقق. يرجى المحاولة لاحقاً',
});

// 5. Account Enumeration Protection (check-availability)
// Max 20 requests / 15 minutes per IP
const availabilityLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AVAILABILITY_MAX) || 20,
  message: 'محاولات فحص الحساب كثيرة جداً. يرجى المحاولة لاحقاً',
});

// 6. File Upload Limiter (avatars, thumbnails, videos, books)
// Max 50 uploads / 15 minutes
// Keyed by Authenticated User ID if logged in (isolated per user on shared network), else IP
const uploadLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX) || 50,
  message: 'تجاوزت الحد المسموح لرفع الملفات. يرجى المحاولة لاحقاً',
  keyGenerator: (req) => (req.user?._id ? `user_${req.user._id}` : req.ip),
});

// 7. Order & Payment Initiation Limiter
// Max 30 requests / 15 minutes
// Keyed by Authenticated User ID if logged in, else IP
const orderLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_ORDER_MAX) || 30,
  message: 'طلبات دفع/شراء كثيرة جداً. يرجى المحاولة لاحقاً',
  keyGenerator: (req) => (req.user?._id ? `user_${req.user._id}` : req.ip),
});

// 8. Search Queries Limiter (expensive DB search operations)
// Max 60 requests / 1 minute per IP
// Only applies when search query parameter is present
const searchLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_SEARCH_MAX) || 60,
  message: 'طلبات بحث كثيرة جداً. يرجى الانتظار دقيقة',
  skip: (req) => !req.query?.search,
});

// 9. Webhook Rate Limiter (payment gateways)
// High threshold to permit bursts of legitimate webhooks & gateway retries while blocking flooding
const webhookLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_WEBHOOK_MAX) || 300,
  message: 'طلبات إشعارات الدفع كثيرة جداً',
});

/**
 * Utility helper to reset rate limit keys across all limiters (useful for testing)
 */
const resetAllLimiters = (key) => {
  const limiters = [
    globalLimiter,
    authLimiter,
    passwordResetLimiter,
    otpLimiter,
    availabilityLimiter,
    uploadLimiter,
    orderLimiter,
    searchLimiter,
    webhookLimiter,
  ];
  limiters.forEach((l) => {
    if (l && typeof l.resetKey === 'function') {
      try {
        l.resetKey(key);
      } catch (e) {}
    }
  });
};

module.exports = {
  createLimiter,
  globalLimiter,
  authLimiter,
  passwordResetLimiter,
  otpLimiter,
  availabilityLimiter,
  uploadLimiter,
  orderLimiter,
  searchLimiter,
  webhookLimiter,
  resetAllLimiters,
};
