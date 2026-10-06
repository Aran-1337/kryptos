const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const liveSessionIdParamValidator = [
  param('id').isMongoId().withMessage('معرف الجلسة غير صالح'),
  validate,
];

const createLiveSessionValidator = [
  body('title').trim().notEmpty().withMessage('عنوان الجلسة مطلوب'),
  body('startDate').notEmpty().withMessage('تاريخ بدء الجلسة مطلوب').isISO8601().withMessage('تاريخ بدء الجلسة غير صالح'),
  body('duration').notEmpty().withMessage('مدة الجلسة مطلوبة').isFloat({ min: 1 }).withMessage('مدة الجلسة يجب أن تكون دقيقة واحدة على الأقل'),
  body('meetingUrl').optional().isURL().withMessage('رابط الجلسة غير صالح'),
  validate,
];

const updateLiveSessionStatusValidator = [
  param('id').isMongoId().withMessage('معرف الجلسة غير صالح'),
  body('status').isIn(['scheduled', 'live', 'ended', 'cancelled']).withMessage('حالة الجلسة غير صالحة'),
  validate,
];

module.exports = {
  liveSessionIdParamValidator,
  createLiveSessionValidator,
  updateLiveSessionStatusValidator,
};
