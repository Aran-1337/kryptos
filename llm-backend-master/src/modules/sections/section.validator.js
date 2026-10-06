const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const courseIdParamValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  validate,
];

const sectionIdParamValidator = [
  param('sectionId').isMongoId().withMessage('معرف القسم غير صالح'),
  validate,
];

const createSectionValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  body('title').trim().notEmpty().withMessage('عنوان القسم مطلوب'),
  validate,
];

const updateSectionValidator = [
  param('sectionId').isMongoId().withMessage('معرف القسم غير صالح'),
  body('title').optional().trim().notEmpty().withMessage('عنوان القسم لا يمكن أن يكون فارغاً'),
  body('order').optional().isInt({ min: 0 }).withMessage('الترتيب يجب أن يكون رقم موجب'),
  validate,
];

module.exports = {
  courseIdParamValidator,
  sectionIdParamValidator,
  createSectionValidator,
  updateSectionValidator,
};
