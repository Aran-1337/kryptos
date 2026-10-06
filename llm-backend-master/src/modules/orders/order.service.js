const Order = require('./order.model');
const Course = require('../courses/course.model');
const User = require('../users/user.model');
const AppError = require('../../utils/AppError');
const { paginate, paginateResponse } = require('../../helpers/pagination');
const { emailQueue, notificationQueue } = require('../../services/queue.service');
const { emailTemplates } = require('../../services/email.service');
const mongoose = require('mongoose');

const withTransaction = async (work) => {
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (err) {
    session = null;
  }

  if (!session) {
    return await work(null);
  }

  try {
    const result = await work(session);
    if (session.inTransaction()) {
      await session.commitTransaction();
    }
    return result;
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction().catch(() => {});
    }
    // If standalone MongoDB does not support transactions, retry without session
    if (err.message && err.message.includes('Transaction numbers are only allowed on a replica set member')) {
      session.endSession();
      session = null;
      return await work(null);
    }
    throw err;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

/**
 * Create order and enroll student in course
 * Designed to support any payment gateway
 */
const createOrder = async (userId, items) => {
  return await withTransaction(async (session) => {
    const opts = session ? { session } : {};
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const courseQuery = Course.findById(item.courseId);
      if (session) courseQuery.session(session);
      const course = await courseQuery;
      if (!course) throw new AppError(`الكورس ${item.courseId} غير موجود`, 404);
      if (!course.isPublished) throw new AppError('الكورس غير متاح حالياً', 400);

      // Check if already enrolled
      const userQuery = User.findById(userId);
      if (session) userQuery.session(session);
      const user = await userQuery;
      if (user.enrolledCourses.includes(course._id)) {
        throw new AppError(`أنت مسجل بالفعل في كورس "${course.title}"`, 400);
      }

      const price = course.isFree ? 0 : (course.discountPrice && course.discountExpires > Date.now() ? course.discountPrice : course.price);
      totalAmount += price;
      orderItems.push({ itemType: 'course', item: course._id, price, title: course.title });
    }

    const [order] = await Order.create([{
      user: userId,
      items: orderItems,
      totalAmount,
      status: totalAmount === 0 ? 'completed' : 'pending',
    }], opts);

    // If free, enroll immediately
    if (totalAmount === 0) {
      await enrollUserInCourses(userId, orderItems.map(i => i.item), session);
    }

    // Send confirmation email
    const user = await User.findById(userId);
    const template = emailTemplates.orderConfirmation(user.name, order);
    await emailQueue.add('order-email', { to: user.email, ...template });

    return order;
  });
};

/**
 * Complete order after successful payment or admin approval.
 * IDEMPOTENT: If the order is already completed, returns existing order safely
 * without repeating course enrollments or sending duplicate notifications.
 */
const completeOrder = async (orderId, paymentData = {}) => {
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError('معرف الطلب غير صالح', 400);
  }

  return await withTransaction(async (session) => {
    const opts = session ? { session } : {};
    const orderQuery = Order.findById(orderId);
    if (session) orderQuery.session(session);
    const order = await orderQuery;

    if (!order) throw new AppError('الطلب غير موجود', 404);

    // Idempotency: If already completed, safely return order without duplicate fulfillment
    if (order.status === 'completed') {
      return order;
    }

    // Only pending orders can be transitioned to completed
    if (order.status !== 'pending') {
      throw new AppError(`لا يمكن إكمال طلب بحالة "${order.status}"`, 400);
    }

    order.status = 'completed';
    order.paymentMethod = paymentData.method || 'manual';
    order.paymentGateway = paymentData.gateway || 'manual';
    order.transactionId = paymentData.transactionId || `tx_${Date.now()}`;
    order.paymentDetails = paymentData;
    await order.save(opts);

    const courseIds = order.items.filter(i => i.itemType === 'course').map(i => i.item);
    await enrollUserInCourses(order.user, courseIds, session);

    console.log(
      `[PAYMENT AUDIT] Order ${order._id} completed via gateway: ${paymentData.gateway}, transactionId: ${paymentData.transactionId}${
        paymentData.approvedBy ? `, approvedBy: ${paymentData.approvedBy}` : ''
      }`
    );

    return order;
  });
};

const enrollUserInCourses = async (userId, courseIds, session) => {
  const opts = session ? { session } : {};
  await User.findByIdAndUpdate(userId, {
    $addToSet: { enrolledCourses: { $each: courseIds } },
  }, opts);

  await Course.updateMany(
    { _id: { $in: courseIds } },
    { $inc: { totalStudents: 1 } },
    opts
  );

  // Send enrollment notification
  await notificationQueue.add('enrollment', {
    userId,
    title: 'تم التسجيل بنجاح! 🎉',
    body: `تم تسجيلك في ${courseIds.length} كورس`,
    type: 'course',
    channels: ['in_app'],
  });
};

const getUserOrders = async (userId, query) => {
  const { page, limit, skip } = paginate(query);
  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Order.countDocuments({ user: userId }),
  ]);
  return paginateResponse(orders, total, page, limit);
};

const getOrderById = async (orderId, userId, user) => {
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError('معرف الطلب غير صالح', 400);
  }
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('الطلب غير موجود', 404);

  const isOwner = order.user.toString() === userId.toString();
  const isAdminOrFinance = user.role === 'admin' || user.permissions?.includes('*') || user.permissions?.includes('payments');

  if (!isOwner && !isAdminOrFinance) {
    throw new AppError('غير مصرح لك بالاطلاع على هذا الطلب', 403);
  }

  return order;
};

module.exports = { createOrder, completeOrder, getUserOrders, getOrderById };
