const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const teamMemberIdParamValidator = [
  param('id').isMongoId().withMessage('معرف عضو الفريق غير صالح'),
  validate,
];

const teamLoginValidator = [
  body('email').isEmail().withMessage('البريد الإلكتروني غير صالح').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('كلمة المرور مطلوبة'),
  validate,
];

const inviteMemberValidator = [
  body('name').trim().notEmpty().withMessage('اسم عضو الفريق مطلوب'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صالح').normalizeEmail(),
  body('permissions').isArray().withMessage('الصلاحيات يجب أن تكون مصفوفة'),
  body('role').not().exists().withMessage('غير مصرح بتحديد الدور مباشرة'),
  validate,
];

const acceptInviteValidator = [
  body('token').isString().notEmpty().withMessage('رمز الدعوة مطلوب'),
  body('password').isString().isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  validate,
];

const updatePermissionsValidator = [
  param('id').isMongoId().withMessage('معرف عضو الفريق غير صالح'),
  body('permissions').isArray().withMessage('الصلاحيات يجب أن تكون مصفوفة'),
  validate,
];

module.exports = {
  teamMemberIdParamValidator,
  teamLoginValidator,
  inviteMemberValidator,
  acceptInviteValidator,
  updatePermissionsValidator,
};
