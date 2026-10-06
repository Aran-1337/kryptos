const router = require('express').Router({ mergeParams: true });
const lessonService = require('./lesson.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const Lesson = require('./lesson.model');
const AppError = require('../../utils/AppError');
const { uploadVideo, verifyMagicBytes } = require('../../middlewares/upload.middleware');
const { uploadLimiter } = require('../../middlewares/rateLimiter.middleware');

const {
  sectionIdParamValidator,
  lessonIdParamValidator,
  createLessonValidator,
} = require('./lesson.validator');

const verifyLessonOwnership = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.lessonId).populate('course');
  if (!lesson) throw new AppError('الدرس غير موجود', 404);
  if (req.user.role !== 'admin' && lesson.course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('ليس لديك صلاحية لتعديل هذا الدرس', 403);
  }
  req.lesson = lesson;
  next();
});

router.get('/', sectionIdParamValidator, catchAsync(async (req, res) => {
  const lessons = await lessonService.getLessons(req.params.sectionId);
  sendResponse(res, 200, { lessons });
}));

// Secure video URL - requires auth
router.get('/:lessonId/video', protect, lessonIdParamValidator, catchAsync(async (req, res) => {
  const data = await lessonService.getSecureVideoUrl(req.params.lessonId, req.user._id, req.user.role);
  sendResponse(res, 200, data);
}));

router.use(protect);

router.post('/', restrictTo('admin', 'instructor'), createLessonValidator, catchAsync(async (req, res) => {
  const lesson = await lessonService.createLesson(req.params.sectionId, req.body, req.user._id, req.user.role);
  sendResponse(res, 201, { lesson }, 'تم إنشاء الدرس بنجاح');
}));

const handleVideoUpload = catchAsync(async (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'fail', message: 'يرجى رفع فيديو' });
  const lesson = await lessonService.uploadLessonVideo(req.params.lessonId, req.file, req.user._id, req.user.role);
  sendResponse(res, 200, { lesson }, 'تم رفع الفيديو بنجاح');
});

router.patch(
  '/:lessonId/video',
  restrictTo('admin', 'instructor'),
  lessonIdParamValidator,
  verifyLessonOwnership,
  uploadLimiter,
  uploadVideo.single('video'),
  verifyMagicBytes('video'),
  handleVideoUpload
);

router.post(
  '/:lessonId/video',
  restrictTo('admin', 'instructor'),
  lessonIdParamValidator,
  verifyLessonOwnership,
  uploadLimiter,
  uploadVideo.single('video'),
  verifyMagicBytes('video'),
  handleVideoUpload
);

router.patch(
  '/:lessonId',
  restrictTo('admin', 'instructor'),
  lessonIdParamValidator,
  verifyLessonOwnership,
  catchAsync(async (req, res) => {
    const lesson = await lessonService.updateLesson(req.params.lessonId, req.body, req.user._id, req.user.role);
    sendResponse(res, 200, { lesson }, 'تم تحديث الدرس بنجاح');
  })
);

router.delete(
  '/:lessonId',
  restrictTo('admin', 'instructor'),
  lessonIdParamValidator,
  verifyLessonOwnership,
  catchAsync(async (req, res) => {
    await lessonService.deleteLesson(req.params.lessonId, req.user._id, req.user.role);
    sendResponse(res, 200, {}, 'تم حذف الدرس بنجاح');
  })
);

module.exports = router;
