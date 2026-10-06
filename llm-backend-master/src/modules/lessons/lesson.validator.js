const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const sectionIdParamValidator = [
  param('sectionId').isMongoId().withMessage('معرف القسم غير صالح'),
  validate,
];

const lessonIdParamValidator = [
  param('lessonId').isMongoId().withMessage('معرف الدرس غير صالح'),
  validate,
];

const createLessonValidator = [
  param('sectionId').isMongoId().withMessage('معرف القسم غير صالح'),
  body('title').trim().notEmpty().withMessage('عنوان الدرس مطلوب'),
  body('order').optional().isInt({ min: 0 }).withMessage('ترتيب الدرس يجب أن يكون رقم غير سالب'),
  body('isFree').optional().isBoolean().withMessage('حقل مجاني يجب أن يكون قيمة منطقية'),
  validate,
];

module.exports = {
  sectionIdParamValidator,
  lessonIdParamValidator,
  createLessonValidator,
};
