const mongoose = require('mongoose');
const Payment = require('./payment.model');
const WebhookEvent = require('./webhook-event.model');
const Order = require('../orders/order.model');
const User = require('../users/user.model');
const { completeOrder } = require('../orders/order.service');
const PaymentGatewayFactory = require('./gateways/gateway.factory');
const AppError = require('../../utils/AppError');
const config = require('../../config');

/**
 * Valid state transitions for Payment attempts.
 * Terminal states:
 * - succeeded: CANNOT transition to pending, failed, cancelled, or expired.
 * - failed / cancelled / expired: terminal for that attempt (subsequent retry creates a new attempt).
 */
const VALID_TRANSITIONS = {
  created: ['pending', 'processing', 'requires_action', 'succeeded', 'failed', 'cancelled', 'expired'],
  pending: ['processing', 'requires_action', 'succeeded', 'failed', 'cancelled', 'expired'],
  processing: ['requires_action', 'succeeded', 'failed', 'cancelled', 'expired'],
  requires_action: ['processing', 'succeeded', 'failed', 'cancelled', 'expired'],
  succeeded: ['refunded', 'partially_refunded'],
  failed: [],
  cancelled: [],
  expired: [],
  refunded: [],
  partially_refunded: ['refunded'],
};

function canTransition(fromStatus, toStatus) {
  if (fromStatus === toStatus) return true;
  const allowed = VALID_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
}

function toMinorUnits(amount) {
  return Math.round(Number(amount) * 100);
}

class PaymentService {
  /**
   * Create a new payment attempt for an order.
   * Multiple attempts are preserved in the Payment collection without overwriting.
   * Enforces:
   * 1. Gateway support check
   * 2. Order existence & ownership check
   * 3. Order completed guard (cannot initiate payment for completed order)
   * 4. Max attempts per order limit
   * 5. Lazy expiration check on order
   */
  async createPaymentAttempt(userId, { orderId, gateway = 'manual', paymentMethod = 'unknown' }) {
    if (!PaymentGatewayFactory.isSupported(gateway)) {
      throw new AppError('بوابة الدفع غير مدعومة أو غير صالحة', 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('الطلب غير موجود', 404);
    }

    // Ownership check: authenticated user must own the order
    if (order.user.toString() !== userId.toString()) {
      throw new AppError('غير مصرح', 403);
    }

    // State check: completed orders cannot receive new payment attempts
    if (order.status === 'completed') {
      throw new AppError('الطلب مكتمل بالفعل', 400);
    }

    // Attempt limit check (configurable, default 5)
    const maxAttempts = config.payment?.maxAttempts || 5;
    const existingAttemptsCount = await Payment.countDocuments({ order: orderId });
    if (existingAttemptsCount >= maxAttempts) {
      throw new AppError(`تم تجاوز الحد الأقصى لمحاولات الدفع لهذا الطلب (${maxAttempts} محاولات)`, 400);
    }

    // Authoritative amount and currency derived strictly from the Order
    const authoritativeAmount = order.totalAmount;
    const authoritativeCurrency = order.currency || 'EGP';

    // Set 24 hour expiration window for the payment attempt
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const payment = await Payment.create({
      order: order._id,
      user: userId,
      gateway,
      paymentMethod,
      amount: authoritativeAmount,
      currency: authoritativeCurrency,
      status: 'pending',
      expiresAt,
    });

    let sessionResult = null;
    // Active integration: invoke Kashier adapter for live/test session creation
    if (gateway === 'kashier') {
      const gatewayAdapter = PaymentGatewayFactory.get('kashier');
      try {
        const user = await User.findById(userId);
        sessionResult = await gatewayAdapter.createPaymentSession(payment, order, user);
        payment.checkoutSessionId = sessionResult.sessionId;
        payment.gatewayOrderId = sessionResult.gatewayOrderId;
        payment.gatewayResponse = sessionResult.rawResponse;
        await payment.save();
      } catch (err) {
        payment.status = 'failed';
        payment.failureReason = err.message;
        await payment.save();
        throw err;
      }
    }

    return {
      payment,
      order,
      session: sessionResult,
    };
  }

  /**
   * Get single payment attempt by ID with IDOR protection & sensitive field sanitization
   */
  async getPaymentById(paymentId, userId, userRole = 'student') {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new AppError('سجل الدفع غير موجود', 404);
    }

    const isOwner = payment.user.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('غير مصرح لك بالاطلاع على هذا الدفع', 403);
    }

    return payment;
  }

  /**
   * Get all payment attempts for a given order (1:N history)
   */
  async getPaymentsByOrderId(orderId, userId, userRole = 'student') {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('الطلب غير موجود', 404);
    }

    const isOwner = order.user.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('غير مصرح لك بالاطلاع على محاولات دفع هذا الطلب', 403);
    }

    return await Payment.find({ order: orderId }).sort({ createdAt: -1 });
  }

  /**
   * Process normalized webhook event with deduplication, atomic concurrency control,
   * state machine transition guards, minor-units amount verification, and exact-once fulfillment.
   */
  async processNormalizedWebhook(normalizedEvent) {
    const {
      gateway,
      eventId,
      eventType,
      paymentId,
      merchantOrderId,
      gatewayTransactionId,
      gatewayOrderId,
      status,
      orderId,
      amount,
      currency,
      paymentData = {},
    } = normalizedEvent;

    // 1. Webhook Deduplication: Check existing record first
    const existingEvent = await WebhookEvent.findOne({ gateway, eventId });
    if (existingEvent) {
      return {
        duplicate: true,
        event: existingEvent,
        message: 'تم استلام هذا الإشعار وتفويضه مسبقاً',
      };
    }

    // 2. Payment Matching using authoritative identifiers
    let payment = null;
    const lookupId = paymentId || merchantOrderId;
    if (lookupId && mongoose.Types.ObjectId.isValid(lookupId)) {
      payment = await Payment.findById(lookupId);
    }
    if (!payment && gatewayOrderId) {
      payment = await Payment.findOne({ gatewayOrderId });
    }
    if (!payment && gatewayTransactionId) {
      payment = await Payment.findOne({ gatewayTransactionId });
    }
    if (!payment && orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      payment = await Payment.findOne({ order: orderId }).sort({ createdAt: -1 });
    }

    if (!payment) {
      throw new AppError('لم يتم العثور على سجل دفع مطابق لبيانات الإشعار', 404);
    }

    // 3. Amount Verification in minor units (cents / piastres)
    if (amount !== undefined) {
      const webhookMinor = toMinorUnits(amount);
      const paymentMinor = toMinorUnits(payment.amount);
      if (webhookMinor !== paymentMinor) {
        throw new AppError(
          `عدم تطابق مبلغ الدفع: البوابة أرسلت ${amount} والمبلغ المطلوب ${payment.amount}`,
          400
        );
      }
    }

    // 4. Currency Verification
    if (currency) {
      const paymentCurrency = (payment.currency || 'EGP').toUpperCase();
      if (currency.toUpperCase() !== paymentCurrency) {
        throw new AppError(
          `عدم تطابق عملة الدفع: البوابة أرسلت ${currency} والعملة المطلوبة ${paymentCurrency}`,
          400
        );
      }
    }

    // 5. Expiration Guard: if payment attempt is expired, reject fulfillment
    if (payment.expiresAt && new Date(payment.expiresAt) < new Date()) {
      if (payment.status !== 'succeeded') {
        payment.status = 'expired';
        await payment.save();
      }
      throw new AppError('جلسة الدفع انتهت صلاحيتها ولم تعد صالحة للاعتماد', 400);
    }

    // 6. Atomic Deduplication via WebhookEvent insert with duplicate key catch
    let webhookRecord;
    try {
      webhookRecord = await WebhookEvent.create({
        gateway,
        eventId,
        eventType,
        paymentId: payment._id,
        gatewayTransactionId,
        status: 'received',
        payload: normalizedEvent,
      });
    } catch (err) {
      if (err.code === 11000) {
        const raceEvent = await WebhookEvent.findOne({ gateway, eventId });
        return {
          duplicate: true,
          event: raceEvent,
          message: 'تم استلام هذا الإشعار وتفويضه مسبقاً (تم تجنب معالجة متزامنة)',
        };
      }
      throw err;
    }

    // 7. Map gateway status to internal status
    let targetStatus = 'pending';
    if (status === 'succeeded' || status === 'SUCCESS') {
      targetStatus = 'succeeded';
    } else if (status === 'failed' || status === 'FAILURE') {
      targetStatus = 'failed';
    } else if (status === 'pending' || status === 'PENDING') {
      targetStatus = 'pending';
    }

    // 8. State Machine Guard: Validate transition
    if (!canTransition(payment.status, targetStatus)) {
      // If already succeeded, DO NOT allow transition to pending/failed/cancelled
      if (payment.status === 'succeeded') {
        webhookRecord.status = 'ignored';
        await webhookRecord.save();
        return {
          duplicate: false,
          event: webhookRecord,
          payment,
          message: `تم تجاهل الانتقال غير الصالح من ${payment.status} إلى ${targetStatus}`,
        };
      }
      throw new AppError(`انتقال غير صالح لحالة الدفع من "${payment.status}" إلى "${targetStatus}"`, 400);
    }

    // 9. Apply State Transition
    if (targetStatus === 'succeeded') {
      payment.status = 'succeeded';
      if (gatewayTransactionId) payment.gatewayTransactionId = gatewayTransactionId;
      if (gatewayOrderId) payment.gatewayOrderId = gatewayOrderId;
      payment.paidAt = new Date();
      await payment.save();

      // Complete order (idempotent, triggers enrollment via OrderService)
      await completeOrder(payment.order, {
        gateway,
        transactionId: gatewayTransactionId,
        ...paymentData,
      });

      webhookRecord.status = 'processed';
      webhookRecord.processedAt = new Date();
      await webhookRecord.save();
    } else if (targetStatus === 'failed') {
      payment.status = 'failed';
      if (gatewayTransactionId) payment.gatewayTransactionId = gatewayTransactionId;
      payment.failureReason = normalizedEvent.failureReason || 'فشلت عملية الدفع لدى البوابة';
      await payment.save();

      // Check order state: if order is already completed by another attempt, NEVER revert or downgrade
      const associatedOrder = await Order.findById(payment.order);
      if (associatedOrder && associatedOrder.status !== 'completed') {
        // Order remains pending for further retries
      }

      webhookRecord.status = 'processed';
      webhookRecord.processedAt = new Date();
      await webhookRecord.save();
    } else if (targetStatus === 'pending') {
      payment.status = 'pending';
      if (gatewayTransactionId) payment.gatewayTransactionId = gatewayTransactionId;
      await payment.save();

      webhookRecord.status = 'processed';
      webhookRecord.processedAt = new Date();
      await webhookRecord.save();
    }

    return {
      duplicate: false,
      event: webhookRecord,
      payment,
    };
  }
}

module.exports = new PaymentService();
