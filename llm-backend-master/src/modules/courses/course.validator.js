const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const courseIdParamValidator = [
  param('id').isMongoId().withMessage('معرف الكورس غير صالح'),
  validate,
];

const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('عنوان الكورس مطلوب')
    .isLength({ min: 3, max: 150 })
    .withMessage('عنوان الكورس يجب أن يكون بين 3 و 150 حرف'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('وصف الكورس مطلوب'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('تصنيف الكورس مطلوب'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('سعر الكورس يجب أن يكون صفر أو أكثر'),

  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('سعر الخصم يجب أن يكون صفر أو أكثر')
    .custom((val, { req }) => {
      if (req.body.price !== undefined && Number(val) > Number(req.body.price)) {
        throw new Error('سعر الخصم لا يمكن أن يكون أكبر من السعر الأصلي');
      }
      return true;
    }),

  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('مستوى الكورس غير صالح'),

  body('isFree')
    .optional()
    .isBoolean()
    .withMessage('حقل مجاني يجب أن يكون قيمة منطقية'),

  validate,
];

const updateCourseValidator = [
  param('id').isMongoId().withMessage('معرف الكورس غير صالح'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('عنوان الكورس يجب أن يكون بين 3 و 150 حرف'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('سعر الكورس يجب أن يكون صفر أو أكثر'),

  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('سعر الخصم يجب أن يكون صفر أو أكثر'),

  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('مستوى الكورس غير صالح'),

  body('isFree')
    .optional()
    .isBoolean()
    .withMessage('حقل مجاني يجب أن يكون قيمة منطقية'),

  validate,
];

module.exports = {
  courseIdParamValidator,
  createCourseValidator,
  updateCourseValidator,
};
