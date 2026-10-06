/**
 * Input Sanitization & Anti-Injection Middleware
 * ──────────────────────────────────────────────
 * Defends against:
 * 1. NoSQL operator injection ($ne, $gt, $where, etc.)
 * 2. Prototype pollution (__proto__, constructor, prototype)
 * 3. Dotted field traversal injection
 */

const hasDangerousKeys = (data, depth = 0) => {
  if (!data || typeof data !== 'object' || depth > 20) return false;

  const keys = Object.getOwnPropertyNames(data);
  for (const key of keys) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return true;
    }
    if (key.startsWith('$') || key.includes('.')) {
      return true;
    }
    const val = data[key];
    if (val && typeof val === 'object') {
      if (hasDangerousKeys(val, depth + 1)) return true;
    }
  }
  return false;
};

/**
 * Express middleware to sanitize and reject dangerous request payloads
 */
const securitySanitizer = (req, res, next) => {
  if (req.body && typeof req.body === 'object' && hasDangerousKeys(req.body)) {
    return res.status(400).json({
      status: 'fail',
      message: 'بيانات الطلب تحتوي على محارف أو مشغلات استعلام غير مسموح بها',
    });
  }

  if (req.query && typeof req.query === 'object' && hasDangerousKeys(req.query)) {
    return res.status(400).json({
      status: 'fail',
      message: 'معاملات البحث تحتوي على محارف أو مشغلات استعلام غير مسموح بها',
    });
  }

  if (req.params && typeof req.params === 'object' && hasDangerousKeys(req.params)) {
    return res.status(400).json({
      status: 'fail',
      message: 'معرفات المسار تحتوي على محارف غير صالحة',
    });
  }

  next();
};

module.exports = {
  hasDangerousKeys,
  securitySanitizer,
};
