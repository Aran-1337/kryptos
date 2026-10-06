const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const egyptPhone = /^(010|011|012|015)\d{8}$/;
const nameRegex  = /^[\u0600-\u06FFa-zA-Z\s]+$/;

const sensitiveFields = [
  'role',
  'permissions',
  'isBanned',
  'isActive',
  'wallet',
  'balance',
  'enrolledCourses',
  'certificates',
  'wishlist',
  'password',
  'refreshTokens',
  'isEmailVerified',
  'emailVerificationToken',
  'passwordResetToken',
  'devices',
  'fcmTokens',
];

const updateProfileValidator = [
  // Reject Mass Assignment of sensitive fields
  body().custom((value, { req }) => {
    const attemptedFields = Object.keys(req.body || {});
    const forbiddenFound = attemptedFields.filter(f => sensitiveFields.includes(f));
    if (forbiddenFound.length > 0) {
      throw new Error(`غير مصرح بتعديل الحقول الحساسة: ${forbiddenFound.join(', ')}`);
    }
    return true;
  }),

  // Field constraints when provided
  body('firstName').optional().trim().notEmpty().withMessage('الاسم الأول لا يمكن أن يكون فارغاً')
    .matches(nameRegex).withMessage('الاسم الأول لا يحتوي على أرقام أو رموز'),
  body('fatherName').optional().trim().notEmpty().withMessage('اسم الأب لا يمكن أن يكون فارغاً')
    .matches(nameRegex).withMessage('اسم الأب لا يحتوي على أرقام أو رموز'),
  body('lastName').optional().trim().notEmpty().withMessage('اسم العائلة لا يمكن أن يكون فارغاً')
    .matches(nameRegex).withMessage('اسم العائلة لا يحتوي على أرقام أو رموز'),
  body('phone').optional().matches(egyptPhone).withMessage('رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010/011/012/015'),
  body('grade').optional().isIn(['grade1', 'grade2']).withMessage('الصف الدراسي غير صالح'),
  body('educationType').optional().isIn(['arabic', 'languages']).withMessage('نوع التعليم غير صالح'),
  body('gender').optional().isIn(['male', 'female']).withMessage('الجنس غير صالح'),
  validate,
];

const userIdParamValidator = [
  param('id').isMongoId().withMessage('معرف المستخدم غير صالح'),
  validate,
];

module.exports = {
  updateProfileValidator,
  userIdParamValidator,
  sensitiveFields,
};
