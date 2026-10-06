const courseRepo = require('./course.repository');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../services/cloudinary.service');
const AppError = require('../../utils/AppError');
const { paginate, paginateResponse } = require('../../helpers/pagination');

const ALLOWED_COURSE_FIELDS = [
  'title', 'description', 'category', 'price', 'discountPrice',
  'level', 'isFree', 'subject', 'grade', 'language',
  'requirements', 'whatYouWillLearn',
];

const createCourse = async (data, instructorId) => {
  const cleanData = {};
  for (const field of ALLOWED_COURSE_FIELDS) {
    if (data[field] !== undefined) {
      cleanData[field] = data[field];
    }
  }
  return courseRepo.create({ ...cleanData, instructor: instructorId, isPublished: false, totalStudents: 0 });
};

const getCourses = async (query) => {
  const { page, limit, skip } = paginate(query);
  const filter = courseRepo.buildSearchFilter(query);
  const sort = courseRepo.buildSort(query);

  const [courses, total] = await Promise.all([
    courseRepo.findAll({ filter, skip, limit, sort }),
    courseRepo.countDocuments(filter),
  ]);

  return paginateResponse(courses, total, page, limit);
};

const getManageCourses = async (query, userId, role) => {
  const { page, limit, skip } = paginate(query);
  
  // Filter for management:
  // Admin/Super Admin can see all courses (published or draft).
  // Instructor can see only their own courses (published or draft).
  const filter = {};
  if (role !== 'admin' && role !== 'super_admin') {
    filter.instructor = userId;
  }

  // Optional status filter: 'published', 'draft', or 'all' (default is all for management)
  if (query.status === 'published' || query.isPublished === 'true') {
    filter.isPublished = true;
  } else if (query.status === 'draft' || query.isPublished === 'false') {
    filter.isPublished = false;
  }

  if (query.search && typeof query.search === 'string') {
    filter.$text = { $search: query.search.trim().slice(0, 100) };
  }
  if (query.category && typeof query.category === 'string') {
    filter.category = query.category.trim();
  }
  if (query.level && typeof query.level === 'string') {
    filter.level = query.level.trim();
  }

  const sort = courseRepo.buildSort(query);

  const [courses, total] = await Promise.all([
    courseRepo.findAll({ filter, skip, limit, sort }),
    courseRepo.countDocuments(filter),
  ]);

  return paginateResponse(courses, total, page, limit);
};

const getCourseById = async (id) => {
  const course = await courseRepo.findById(id);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  return course;
};

const getInstructorId = (course) => (course?.instructor?._id || course?.instructor)?.toString();

const updateCourse = async (id, data, userId, role) => {
  const course = await courseRepo.findById(id);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  const instructorId = getInstructorId(course);
  if (role !== 'admin' && instructorId !== userId.toString()) {
    throw new AppError('ليس لديك صلاحية لتعديل هذا الكورس', 403);
  }

  // Reject sensitive fields from being mass assigned
  const blockedFields = ['instructor', 'ratingsAverage', 'ratingsQuantity', 'totalStudents', 'sections', 'enrolledStudents'];
  for (const b of blockedFields) {
    if (data[b] !== undefined) {
      throw new AppError(`غير مسموح بتعديل الحقل ${b}`, 400);
    }
  }

  const cleanData = {};
  for (const field of ALLOWED_COURSE_FIELDS) {
    if (data[field] !== undefined) {
      cleanData[field] = data[field];
    }
  }
  return courseRepo.updateById(id, cleanData);
};

const deleteCourse = async (id, userId, role) => {
  const course = await courseRepo.findById(id);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  const instructorId = getInstructorId(course);
  if (role !== 'admin' && instructorId !== userId.toString()) {
    throw new AppError('ليس لديك صلاحية لحذف هذا الكورس', 403);
  }
  if (course.thumbnail?.publicId) await deleteFromCloudinary(course.thumbnail.publicId);
  await courseRepo.deleteById(id);
};

const uploadCourseThumbnail = async (courseId, file, userId, role) => {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  const instructorId = getInstructorId(course);
  if (role !== 'admin' && instructorId !== userId.toString()) {
    throw new AppError('ليس لديك صلاحية لتعديل هذا الكورس', 403);
  }

  const oldPublicId = course.thumbnail?.publicId;

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'courses/thumbnails',
    transformation: [{ width: 1280, height: 720, crop: 'fill' }],
  });

  const updatedCourse = await courseRepo.updateById(courseId, {
    thumbnail: { publicId: result.public_id, url: result.secure_url },
  });

  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId, 'image').catch(() => {});
  }

  return updatedCourse;
};

const uploadPreviewVideo = async (courseId, file, userId, role) => {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  const instructorId = getInstructorId(course);
  if (role !== 'admin' && instructorId !== userId.toString()) {
    throw new AppError('ليس لديك صلاحية لتعديل هذا الكورس', 403);
  }

  const oldPublicId = course.previewVideo?.publicId;

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'courses/previews',
    resource_type: 'video',
    eager: [{ format: 'mp4' }],
  });

  const updatedCourse = await courseRepo.updateById(courseId, {
    previewVideo: {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      duration: result.duration,
      thumbnail: result.eager?.[0]?.secure_url,
      format: result.format,
      size: result.bytes,
    },
  });

  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId, 'video').catch(() => {});
  }

  return updatedCourse;
};

const publishCourse = async (courseId, userId, role) => {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new AppError('الكورس غير موجود', 404);
  const instructorId = getInstructorId(course);
  if (role !== 'admin' && instructorId !== userId.toString()) {
    throw new AppError('غير مصرح', 403);
  }
  return courseRepo.updateById(courseId, { isPublished: true, publishedAt: new Date() });
};

module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, uploadCourseThumbnail, uploadPreviewVideo, publishCourse, getManageCourses };
