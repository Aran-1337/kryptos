const router = require('express').Router({ mergeParams: true });
const { Quiz, QuizAttempt } = require('./quiz.model');
const Course = require('../courses/course.model');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');
const { protect, restrictTo, requireEnrollment } = require('../../middlewares/auth.middleware');
const AppError = require('../../utils/AppError');

const {
  courseIdParamValidator,
  createQuizValidator,
  submitQuizValidator,
  quizIdParamValidator,
} = require('./quiz.validator');

router.get('/', courseIdParamValidator, protect, requireEnrollment, catchAsync(async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId, isPublished: true })
    .select('-questions.options.isCorrect -questions.correctAnswer');
  sendResponse(res, 200, { quizzes });
}));

router.post('/', courseIdParamValidator, protect, restrictTo('admin', 'instructor'), createQuizValidator, catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('ليس لديك صلاحية لإضافة اختبار لهذا الكورس', 403);
  }

  const allowed = ['title', 'description', 'passingScore', 'maxAttempts', 'duration', 'questions'];
  const cleanData = {};
  for (const f of allowed) {
    if (req.body[f] !== undefined) cleanData[f] = req.body[f];
  }
  const quiz = await Quiz.create({ ...cleanData, course: req.params.courseId, isPublished: true });
  sendResponse(res, 201, { quiz }, 'تم إنشاء الاختبار بنجاح');
}));

router.delete('/:quizId', quizIdParamValidator, protect, restrictTo('admin', 'instructor'), catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('غير مصرح', 403);
  }
  const quiz = await Quiz.findOne({ _id: req.params.quizId, course: req.params.courseId });
  if (!quiz) throw new AppError('الاختبار غير موجود في هذا الكورس', 404);
  await Quiz.findByIdAndDelete(req.params.quizId);
  sendResponse(res, 200, {}, 'تم حذف الاختبار بنجاح');
}));

// Submit quiz attempt
router.post('/:quizId/submit', submitQuizValidator, protect, requireEnrollment, catchAsync(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.quizId, course: req.params.courseId });
  if (!quiz) throw new AppError('الاختبار غير موجود', 404);

  // Check max attempts
  const attemptCount = await QuizAttempt.countDocuments({ user: req.user._id, quiz: quiz._id });
  if (attemptCount >= quiz.maxAttempts) {
    throw new AppError(`لقد استنفدت جميع محاولاتك (${quiz.maxAttempts})`, 400);
  }

  // Grade answers
  const { answers } = req.body;
  let totalPoints = 0;
  let earnedPoints = 0;
  const gradedAnswers = [];

  for (const question of quiz.questions) {
    totalPoints += question.points;
    const userAnswer = answers.find(a => a.questionId === question._id.toString());
    let isCorrect = false;

    if (question.type === 'multiple_choice') {
      const correctOption = question.options.find(o => o.isCorrect);
      isCorrect = correctOption?.text === userAnswer?.answer;
    } else if (question.type === 'true_false') {
      isCorrect = question.correctAnswer === userAnswer?.answer;
    }

    if (isCorrect) earnedPoints += question.points;
    gradedAnswers.push({ question: question._id, answer: userAnswer?.answer, isCorrect, points: isCorrect ? question.points : 0 });
  }

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = percentage >= quiz.passingScore;

  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers: gradedAnswers,
    score: earnedPoints,
    percentage,
    passed,
    attemptNumber: attemptCount + 1,
    completedAt: new Date(),
  });

  sendResponse(res, 200, { attempt, passed, percentage, score: earnedPoints, totalPoints }, passed ? 'أحسنت! لقد اجتزت الاختبار' : 'لم تجتز الاختبار. حاول مرة أخرى');
}));

module.exports = router;
