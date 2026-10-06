const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('عناصر الطلب مطلوبة كمصفوفة تحتوي على عنصر واحد على الأقل'),
  body('items.*.courseId')
    .notEmpty()
    .withMessage('معرف الكورس مطلوب لكل عنصر')
    .isMongoId()
    .withMessage('معرف الكورس غير صالح'),
  validate,
];

const completeOrderParamValidator = [
  param('orderId')
    .isMongoId()
    .withMessage('معرف الطلب غير صالح'),
  validate,
];

const orderIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('معرف الطلب غير صالح'),
  validate,
];

module.exports = {
  createOrderValidator,
  completeOrderParamValidator,
  orderIdParamValidator,
};
