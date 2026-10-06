const Lesson = require('./lesson.model');
const Section = require('../sections/section.model');
const Course = require('../courses/course.model');
const { uploadToCloudinary, deleteFromCloudinary, generateSignedUrl } = require('../../services/cloudinary.service');
const AppError = require('../../utils/AppError');

const ALLOWED_LESSON_FIELDS = ['title', 'description', 'duration', 'isFree', 'order'];

const createLesson = async (sectionId, data, userId, role) => {
  const section = await Section.findById(sectionId).populate('course');
  if (!section) throw new AppError('القسم غير موجود', 404);
  if (role !== 'admin' && section.course.instructor.toString() !== userId.toString()) {
    throw new AppError('غير مصرح', 403);
  }

  const cleanData = {};
  for (const f of ALLOWED_LESSON_FIELDS) {
    if (data[f] !== undefined) cleanData[f] = data[f];
  }

  const lesson = await Lesson.create({ ...cleanData, section: sectionId, course: section.course._id });
  await Section.findByIdAndUpdate(sectionId, { $push: { lessons: lesson._id } });
  await Course.findByIdAndUpdate(section.course._id, { $inc: { totalLessons: 1 } });
  return lesson;
};

const getLessons = (sectionId) => Lesson.find({ section: sectionId }).sort('order').select('-video.publicId -video.secureUrl -attachments.publicId -attachments.secureUrl');

const uploadLessonVideo = async (lessonId, file, userId, role) => {
  const lesson = await Lesson.findById(lessonId).select('+video.publicId +video.secureUrl').populate('course');
  if (!lesson) throw new AppError('الدرس غير موجود', 404);
  if (role !== 'admin' && lesson.course.instructor.toString() !== userId.toString()) {
    throw new AppError('ليس لديك صلاحية لتعديل هذا الدرس', 403);
  }

  const oldPublicId = lesson.video?.publicId;

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'lessons/videos',
    resource_type: 'video',
    type: 'authenticated', // Private - requires signed URL
  });

  const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, {
    video: {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      duration: result.duration,
      thumbnail: result.eager?.[0]?.secure_url,
      format: result.format,
      size: result.bytes,
    },
  }, { new: true });

  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId, 'video').catch(() => {});
  }

  return updatedLesson;
};

const getSecureVideoUrl = async (lessonId, userId, userRole) => {
  const lesson = await Lesson.findById(lessonId).select('+video.publicId +video.secureUrl');
  if (!lesson) throw new AppError('الدرس غير موجود', 404);
  if (!lesson.video?.publicId) throw new AppError('لا يوجد فيديو لهذا الدرس', 404);

  // Free lessons are accessible to all; for paid lessons verify access
  if (!lesson.isFree) {
    if (userRole === 'student') {
      const User = require('../users/user.model');
      const user = await User.findById(userId);
      const isEnrolled = user?.enrolledCourses?.some(id => id.toString() === lesson.course.toString());
      if (!isEnrolled) throw new AppError('يجب شراء الكورس أولاً', 403);
    } else if (userRole === 'instructor') {
      const Course = require('../courses/course.model');
      const course = await Course.findById(lesson.course);
      const isOwner = course && course.instructor.toString() === userId.toString();
      if (!isOwner) {
        const User = require('../users/user.model');
        const user = await User.findById(userId);
        const isEnrolled = user?.enrolledCourses?.some(id => id.toString() === lesson.course.toString());
        if (!isEnrolled) throw new AppError('يجب شراء الكورس أولاً', 403);
      }
    }
  }

  // Generate signed URL valid for 1 hour
  const signedUrl = generateSignedUrl(lesson.video.publicId, 'video', 3600);
  return { url: signedUrl, duration: lesson.video.duration, expiresIn: 3600 };
};

const updateLesson = async (lessonId, data, userId, role) => {
  const lesson = await Lesson.findById(lessonId).populate('course');
  if (!lesson) throw new AppError('الدرس غير موجود', 404);
  if (role !== 'admin' && lesson.course.instructor.toString() !== userId.toString()) {
    throw new AppError('ليس لديك صلاحية لتعديل هذا الدرس', 403);
  }

  const cleanData = {};
  for (const f of ALLOWED_LESSON_FIELDS) {
    if (data[f] !== undefined) cleanData[f] = data[f];
  }

  return Lesson.findByIdAndUpdate(lessonId, cleanData, { new: true, runValidators: true });
};

const deleteLesson = async (lessonId, userId, role) => {
  const lesson = await Lesson.findById(lessonId).populate('course');
  if (!lesson) throw new AppError('الدرس غير موجود', 404);
  if (role !== 'admin' && lesson.course.instructor.toString() !== userId.toString()) {
    throw new AppError('ليس لديك صلاحية لحذف هذا الدرس', 403);
  }

  if (lesson.video?.publicId) {
    await deleteFromCloudinary(lesson.video.publicId, 'video').catch(() => {});
  }

  await Section.findByIdAndUpdate(lesson.section, { $pull: { lessons: lessonId } });
  await Course.findByIdAndUpdate(lesson.course._id, { $inc: { totalLessons: -1 } });
  await Lesson.findByIdAndDelete(lessonId);
};

module.exports = { createLesson, getLessons, uploadLessonVideo, getSecureVideoUrl, updateLesson, deleteLesson };
