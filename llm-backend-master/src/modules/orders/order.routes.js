const router = require('express').Router();
const orderService = require('./order.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');
const { protect, restrictTo, requirePermission } = require('../../middlewares/auth.middleware');
const { approvePaymentValidator } = require('../payments/payment.validator');
const { createOrderValidator, completeOrderParamValidator, orderIdParamValidator } = require('./order.validator');

const { orderLimiter } = require('../../middlewares/rateLimiter.middleware');

router.use(protect);

router.post(
  '/',
  orderLimiter,
  createOrderValidator,
  catchAsync(async (req, res) => {
    const order = await orderService.createOrder(req.user._id, req.body.items);
    sendResponse(res, 201, { order }, 'تم إنشاء الطلب بنجاح');
  })
);

router.get(
  '/my-orders',
  catchAsync(async (req, res) => {
    const result = await orderService.getUserOrders(req.user._id, req.query);
    sendResponse(res, 200, result);
  })
);

router.get(
  '/:id',
  orderIdParamValidator,
  catchAsync(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id, req.user._id, req.user);
    sendResponse(res, 200, { order });
  })
);

// ─── Admin/Team Manual Payment Approval ───────────────────────────────────────
router.patch(
  '/:id/approve',
  requirePermission('orders.approve', 'payments'),
  approvePaymentValidator,
  catchAsync(async (req, res) => {
    const paymentData = {
      gateway: 'manual',
      transactionId: req.body.transactionId || `manual_${Date.now()}`,
      method: req.body.method || 'cash',
      approvedBy: req.user._id,
      approvedAt: new Date(),
      note: req.body.note,
    };

    const order = await orderService.completeOrder(req.params.id, paymentData);
    sendResponse(res, 200, { order }, 'تمت الموافقة على الدفع وإكمال الطلب بنجاح');
  })
);

// ─── Complete Order (Backward-compatible) ────────────────────────────────────
router.post(
  '/complete/:orderId',
  requirePermission('orders.approve', 'payments'),
  completeOrderParamValidator,
  catchAsync(async (req, res) => {
    const order = await orderService.completeOrder(req.params.orderId, req.body);
    sendResponse(res, 200, { order }, 'تم إكمال الطلب بنجاح');
  })
);

module.exports = router;
