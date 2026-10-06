const router = require('express').Router();
const courseController = require('./course.controller');
const { protect, restrictTo, requirePermission } = require('../../middlewares/auth.middleware');
const Course = require('./course.model');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const { uploadImage, uploadVideo, verifyMagicBytes } = require('../../middlewares/upload.middleware');

const {
  courseIdParamValidator,
  createCourseValidator,
  updateCourseValidator,
} = require('./course.validator');
const { uploadLimiter, searchLimiter } = require('../../middlewares/rateLimiter.middleware');

const verifyCourseOwnership = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('ليس لديك صلاحية لتعديل هذا الكورس', 403);
  }
  req.course = course;
  next();
});

// Management route for authorized staff/instructors (must precede /:id)
router.get('/manage', protect, requirePermission('courses', 'courses.read'), courseController.getManageCourses);

// Public routes
router.get('/', searchLimiter, courseController.getCourses);
router.get('/:id', courseIdParamValidator, courseController.getCourse);

// Protected routes
router.use(protect);
router.post('/', requirePermission('courses', 'courses.create'), createCourseValidator, courseController.createCourse);
router.patch('/:id', requirePermission('courses', 'courses.update'), updateCourseValidator, courseController.updateCourse);
router.delete('/:id', requirePermission('courses', 'courses.delete'), courseIdParamValidator, courseController.deleteCourse);
router.patch(
  '/:id/thumbnail',
  requirePermission('courses', 'courses.update'),
  courseIdParamValidator,
  verifyCourseOwnership,
  uploadLimiter,
  uploadImage.single('thumbnail'),
  verifyMagicBytes('image'),
  courseController.uploadThumbnail
);
router.patch(
  '/:id/preview-video',
  requirePermission('courses', 'courses.update'),
  courseIdParamValidator,
  verifyCourseOwnership,
  uploadLimiter,
  uploadVideo.single('video'),
  verifyMagicBytes('video'),
  courseController.uploadPreviewVideo
);
router.patch('/:id/publish', requirePermission('courses', 'courses.update'), courseIdParamValidator, courseController.publishCourse);

module.exports = router;
