const router = require('express').Router();
const Order = require('../orders/order.model');
const { completeOrder } = require('../orders/order.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');
const { protect } = require('../../middlewares/auth.middleware');
const AppError = require('../../utils/AppError');
const crypto = require('crypto');
const {
  webhookValidator,
  initiatePaymentValidator,
} = require('./payment.validator');
const { orderLimiter, webhookLimiter } = require('../../middlewares/rateLimiter.middleware');

const paymentService = require('./payment.service');
const PaymentGatewayFactory = require('./gateways/gateway.factory');

// ─── Initiate Payment ────────────────────────────────────────────────────────
router.post(
  '/initiate',
  protect,
  orderLimiter,
  initiatePaymentValidator,
  catchAsync(async (req, res) => {
    const { orderId, gateway = 'manual', paymentMethod = 'unknown' } = req.body;

    const { payment, order, session } = await paymentService.createPaymentAttempt(req.user._id, {
      orderId,
      gateway,
      paymentMethod,
    });

    sendResponse(
      res,
      200,
      {
        orderId: order._id,
        amount: order.totalAmount,
        currency: order.currency,
        gateway: payment.gateway,
        checkoutUrl: session?.checkoutUrl,
        sessionId: session?.sessionId,
        payment: {
          id: payment._id,
          _id: payment._id,
          status: payment.status,
          gateway: payment.gateway,
          paymentMethod: payment.paymentMethod,
          amount: payment.amount,
          currency: payment.currency,
          createdAt: payment.createdAt,
        },
      },
      'جاهز للدفع'
    );
  })
);

// ─── Webhook Handler (called by external payment gateways) ───────────────────
router.post(
  '/webhook/:gateway',
  webhookLimiter,
  webhookValidator,
  catchAsync(async (req, res, next) => {
    const { gateway } = req.params;

    // Security check: Manual payments must NEVER be processed by public webhooks
    if (gateway === 'manual') {
      return next(
        new AppError(
          'غير مصرح بإجراء الدفع اليدوي عبر الـ Webhook العام. يجب اعتماد الدفع من لوحة الإدارة بواسطة المشرف',
          403
        )
      );
    }

    if (gateway === 'kashier') {
      const kashierGateway = PaymentGatewayFactory.get('kashier');
      // Cryptographically verify webhook signature
      kashierGateway.verifyWebhook(req.headers, req.body, req.rawBody);
      // Parse payload to normalized event
      const normalizedEvent = kashierGateway.parseWebhookEvent(req.body);
      // Process event through PaymentService (matching, amount verification, idempotency, fulfillment)
      const result = await paymentService.processNormalizedWebhook(normalizedEvent);
      return res.status(200).json({ received: true, duplicate: result.duplicate });
    }

    if (gateway === 'stripe' || gateway === 'paymob' || gateway === 'fawry') {
      // Unimplemented gateways return controlled 503 / 501
      return next(
        new AppError(`بوابة ${gateway} غير مهيأة أو قيد الإعداد في هذه المرحلة`, 503)
      );
    }

    return next(new AppError(`بوابة الدفع "${gateway}" غير مدعومة`, 400));
  })
);

// ─── Get Payment Attempts for Order (1:N History) ────────────────────────────
router.get(
  '/attempts/:orderId',
  protect,
  catchAsync(async (req, res) => {
    const attempts = await paymentService.getPaymentsByOrderId(
      req.params.orderId,
      req.user._id,
      req.user.role
    );
    sendResponse(res, 200, { attempts });
  })
);

// ─── Get Order Payment Status ────────────────────────────────────────────────
router.get(
  '/status/:orderId',
  protect,
  catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.orderId).select(
      'status totalAmount currency paymentGateway transactionId user'
    );
    if (!order) throw new AppError('الطلب غير موجود', 404);
    if (
      order.user?.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new AppError('غير مصرح', 403);
    }
    sendResponse(res, 200, { order });
  })
);

// ─── Get Single Payment by ID (IDOR Protected) ───────────────────────────────
router.get(
  '/:paymentId',
  protect,
  catchAsync(async (req, res) => {
    const payment = await paymentService.getPaymentById(
      req.params.paymentId,
      req.user._id,
      req.user.role
    );
    sendResponse(res, 200, { payment });
  })
);

module.exports = router;
