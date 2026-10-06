const { body, param } = require('express-validator');
const validate = require('../../middlewares/validate.middleware');

const courseIdParamValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  validate,
];

const createQuizValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  body('title').trim().notEmpty().withMessage('عنوان الاختبار مطلوب'),
  body('passingScore').optional().isInt({ min: 0, max: 100 }).withMessage('درجة النجاح يجب أن تكون بين 0 و 100'),
  body('maxAttempts').optional().isInt({ min: 1 }).withMessage('عدد المحاولات يجب أن يكون 1 على الأقل'),
  body('duration').optional().isInt({ min: 1 }).withMessage('مدة الاختبار يجب أن تكون دقيقة واحدة على الأقل'),
  body('questions').optional().isArray().withMessage('الأسئلة يجب أن تكون مصفوفة'),
  validate,
];

const submitQuizValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  param('quizId').isMongoId().withMessage('معرف الاختبار غير صالح'),
  body('answers').isArray().withMessage('إجابات الأسئلة مطلوبة كمصفوفة'),
  validate,
];

const quizIdParamValidator = [
  param('courseId').isMongoId().withMessage('معرف الكورس غير صالح'),
  param('quizId').isMongoId().withMessage('معرف الاختبار غير صالح'),
  validate,
];

module.exports = {
  courseIdParamValidator,
  createQuizValidator,
  submitQuizValidator,
  quizIdParamValidator,
};
