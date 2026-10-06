const router = require('express').Router();
const LiveSession = require('./liveSession.model');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const AppError = require('../../utils/AppError');
const { liveReminderQueue } = require('../../services/queue.service');
const { paginate, paginateResponse } = require('../../helpers/pagination');

router.get('/', catchAsync(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = { status: { $in: ['scheduled', 'live'] } };
  const [sessions, total] = await Promise.all([
    LiveSession.find(filter).populate('instructor', 'name avatar').skip(skip).limit(limit).sort({ startDate: 1 }),
    LiveSession.countDocuments(filter),
  ]);
  sendResponse(res, 200, paginateResponse(sessions, total, page, limit));
}));

const {
  liveSessionIdParamValidator,
  createLiveSessionValidator,
  updateLiveSessionStatusValidator,
} = require('./liveSession.validator');

router.use(protect);

router.post('/', restrictTo('admin', 'instructor'), createLiveSessionValidator, catchAsync(async (req, res) => {
  const allowed = ['title', 'description', 'startDate', 'duration', 'meetingUrl', 'courseId'];
  const cleanData = {};
  for (const f of allowed) {
    if (req.body[f] !== undefined) cleanData[f] = req.body[f];
  }
  const session = await LiveSession.create({ ...cleanData, instructor: req.user._id, status: 'scheduled', registeredStudents: [] });

  // Schedule reminder 5 minutes before
  const reminderDelay = new Date(session.startDate).getTime() - Date.now() - 5 * 60 * 1000;
  if (reminderDelay > 0) {
    await liveReminderQueue.add('reminder', { sessionId: session._id }, { delay: reminderDelay });
  }

  sendResponse(res, 201, { session }, 'تم إنشاء الجلسة المباشرة بنجاح');
}));

router.post('/:id/register', liveSessionIdParamValidator, catchAsync(async (req, res) => {
  const session = await LiveSession.findById(req.params.id);
  if (!session) throw new AppError('الجلسة غير موجودة', 404);
  if (session.status !== 'scheduled') throw new AppError('لا يمكن التسجيل في هذه الجلسة', 400);

  if (session.registeredStudents.includes(req.user._id)) {
    throw new AppError('أنت مسجل بالفعل في هذه الجلسة', 400);
  }

  await LiveSession.findByIdAndUpdate(req.params.id, {
    $addToSet: { registeredStudents: req.user._id },
  });

  sendResponse(res, 200, {}, 'تم التسجيل في الجلسة المباشرة بنجاح');
}));

router.patch('/:id/status', restrictTo('admin', 'instructor'), updateLiveSessionStatusValidator, catchAsync(async (req, res) => {
  const session = await LiveSession.findById(req.params.id);
  if (!session) throw new AppError('الجلسة غير موجودة', 404);
  if (req.user.role !== 'admin' && session.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('غير مصرح', 403);
  }

  const ALLOWED_TRANSITIONS = {
    scheduled: ['live', 'cancelled'],
    live: ['ended', 'cancelled'],
    ended: [],
    cancelled: [],
  };

  const newStatus = req.body.status;
  if (session.status !== newStatus) {
    const validNextStates = ALLOWED_TRANSITIONS[session.status] || [];
    if (!validNextStates.includes(newStatus)) {
      throw new AppError(`انتقال غير صالح لحالة الجلسة من "${session.status}" إلى "${newStatus}"`, 400);
    }
  }

  session.status = newStatus;
  await session.save();
  sendResponse(res, 200, { session }, 'تم تحديث حالة الجلسة');
}));

router.delete('/:id', restrictTo('admin', 'instructor'), liveSessionIdParamValidator, catchAsync(async (req, res) => {
  const session = await LiveSession.findById(req.params.id);
  if (!session) throw new AppError('الجلسة غير موجودة', 404);
  if (req.user.role !== 'admin' && session.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('غير مصرح', 403);
  }
  await LiveSession.findByIdAndDelete(req.params.id);
  sendResponse(res, 200, {}, 'تم حذف الجلسة المباشرة بنجاح');
}));

module.exports = router;
