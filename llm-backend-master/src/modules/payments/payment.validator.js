const { param, body } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');
const AppError = require('../../utils/AppError');

/**
 * Webhook route validator
 * CRITICAL SECURITY: Public webhook route must NEVER accept manual payment completion.
 */
const webhookValidator = [
  (req, res, next) => {
    if (req.params.gateway === 'manual') {
      return next(
        new AppError(
          'غير مصرح بإجراء الدفع اليدوي عبر الـ Webhook العام. يجب اعتماد الدفع من لوحة الإدارة بواسطة المشرف',
          403
        )
      );
    }
    next();
  },
  param('gateway')
    .trim()
    .notEmpty()
    .withMessage('بوابة الدفع مطلوبة')
    .isIn(['kashier', 'stripe', 'paymob', 'fawry'])
    .withMessage('بوابة الدفع غير مدعومة أو غير صالحة'),
  validate,
];

/**
 * Initiate payment validator
 */
const initiatePaymentValidator = [
  body('orderId')
    .notEmpty()
    .withMessage('معرف الطلب مطلوب')
    .isMongoId()
    .withMessage('معرف الطلب غير صالح'),
  body('gateway')
    .optional()
    .isIn(['manual', 'kashier', 'stripe', 'paymob', 'fawry'])
    .withMessage('بوابة الدفع غير صالحة'),
  body('paymentMethod')
    .optional()
    .trim(),
  validate,
];

/**
 * Admin manual payment approval validator
 */
const approvePaymentValidator = [
  param('id')
    .notEmpty()
    .withMessage('معرف الطلب مطلوب')
    .isMongoId()
    .withMessage('معرف الطلب غير صالح'),
  body('transactionId')
    .optional()
    .trim(),
  body('method')
    .optional()
    .trim(),
  body('note')
    .optional()
    .trim(),
  validate,
];

module.exports = {
  webhookValidator,
  initiatePaymentValidator,
  approvePaymentValidator,
};
