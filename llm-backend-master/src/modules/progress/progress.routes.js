const router = require('express').Router();
const Progress = require('./progress.model');
const Course = require('../courses/course.model');
const Lesson = require('../lessons/lesson.model');
const { certificateQueue } = require('../../services/queue.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');
const { protect, requireEnrollment } = require('../../middlewares/auth.middleware');
const AppError = require('../../utils/AppError');
const { courseProgressParamValidator, updateProgressValidator } = require('./progress.validator');

router.use(protect);

// Get progress for a course
router.get('/:courseId', courseProgressParamValidator, requireEnrollment, catchAsync(async (req, res) => {
  const progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId })
    .populate('lastWatchedLesson', 'title')
    .populate('completedLessons', 'title');
  sendResponse(res, 200, { progress });
}));

// Update lesson progress with Anti-Tampering enforcement
router.post('/:courseId/lessons/:lessonId', updateProgressValidator, requireEnrollment, catchAsync(async (req, res) => {
  const { watchedSeconds, isCompleted } = req.body;
  const { courseId, lessonId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new AppError('الكورس غير موجود', 404);

  // Anti-Tampering: verify lesson exists and belongs to this course
  const lesson = await Lesson.findOne({ _id: lessonId, course: courseId }).select('+video.duration');
  if (!lesson) throw new AppError('الدرس غير موجود في هذا الكورس', 404);

  const watched = Math.max(0, Number(watchedSeconds) || 0);
  const videoDuration = lesson.video?.duration || 0;

  // Anti-Tampering:
  // If the lesson has a video duration > 0, completion requires watching at least 80% of the video.
  // Blind client-supplied isCompleted: true without adequate watch time is rejected / ignored.
  let isLegitimatelyCompleted = false;
  if (videoDuration > 0) {
    isLegitimatelyCompleted = watched >= (videoDuration * 0.8);
  } else {
    isLegitimatelyCompleted = Boolean(isCompleted);
  }

  let progress = await Progress.findOne({ user: req.user._id, course: courseId });

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      course: courseId,
      totalLessons: course.totalLessons || 0,
      completedLessons: [],
      lessonProgress: [],
    });
  }

  // Check if lesson was already completed
  const isAlreadyCompleted = progress.completedLessons.some(id => id.toString() === lessonId.toString());
  const finalCompletedStatus = isAlreadyCompleted || isLegitimatelyCompleted;

  // Update per-lesson progress
  const lessonProgressIndex = progress.lessonProgress.findIndex(lp => lp.lesson?.toString() === lessonId.toString());

  if (lessonProgressIndex >= 0) {
    const existingWatched = progress.lessonProgress[lessonProgressIndex].watchedSeconds || 0;
    progress.lessonProgress[lessonProgressIndex].watchedSeconds = Math.max(existingWatched, watched);
    progress.lessonProgress[lessonProgressIndex].isCompleted = finalCompletedStatus;
    progress.lessonProgress[lessonProgressIndex].lastWatchedAt = watched;
  } else {
    progress.lessonProgress.push({
      lesson: lessonId,
      watchedSeconds: watched,
      isCompleted: finalCompletedStatus,
      lastWatchedAt: watched,
    });
  }

  // Mark lesson as completed if legitimately earned
  if (finalCompletedStatus && !isAlreadyCompleted) {
    progress.completedLessons.push(lessonId);
  }

  progress.lastWatchedLesson = lessonId;
  progress.lastWatchedAt = watched;

  // Calculate total watch time accurately across lessons
  progress.totalWatchTime = progress.lessonProgress.reduce((sum, lp) => sum + (lp.watchedSeconds || 0), 0);

  // Calculate completion percentage based on course's total lessons
  const total = course.totalLessons > 0 ? course.totalLessons : (progress.totalLessons > 0 ? progress.totalLessons : 1);
  progress.completionPercentage = Math.min(100, Math.round((progress.completedLessons.length / total) * 100));

  // Check if course is completed
  if (progress.completionPercentage === 100 && !progress.isCompleted) {
    progress.isCompleted = true;
    progress.completedAt = new Date();
    // Queue certificate generation
    await certificateQueue.add('generate-cert', { userId: req.user._id, courseId });
  }

  await progress.save();
  sendResponse(res, 200, { progress }, 'تم تحديث التقدم بنجاح');
}));

module.exports = router;
