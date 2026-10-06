const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const bookIdParamValidator = [
  param('id').isMongoId().withMessage('معرف الكتاب غير صالح'),
  validate,
];

const createBookValidator = [
  body('title').trim().notEmpty().withMessage('عنوان الكتاب مطلوب'),
  body('price').optional().isFloat({ min: 0 }).withMessage('سعر الكتاب يجب أن يكون صفر أو أكثر'),
  body('isFree').optional().isBoolean().withMessage('حقل مجاني يجب أن يكون قيمة منطقية'),
  validate,
];

module.exports = {
  bookIdParamValidator,
  createBookValidator,
};
