const { param, body } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const courseProgressParamValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  validate,
];

const updateProgressValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  param('lessonId').isMongoId().withMessage('معرف الدرس غير صالح'),
  body('watchedSeconds').optional().isFloat({ min: 0 }).withMessage('مدة المشاهدة يجب أن تكون رقم موجب'),
  validate,
];

module.exports = {
  courseProgressParamValidator,
  updateProgressValidator,
};
