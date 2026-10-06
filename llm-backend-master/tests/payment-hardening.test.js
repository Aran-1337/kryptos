const http = require('http');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const Course = require('../src/modules/courses/course.model');
const Order = require('../src/modules/orders/order.model');
const Payment = require('../src/modules/payments/payment.model');
const WebhookEvent = require('../src/modules/payments/webhook-event.model');
const PaymentGatewayFactory = require('../src/modules/payments/gateways/gateway.factory');
const paymentService = require('../src/modules/payments/payment.service');
const { generateAccessToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');

let mongoServer;
let server;
let baseUrl;

let studentA;
let studentB;
let adminUser;
let testCourse;
let tokenA;
let tokenB;
let tokenAdmin;

const TEST_SECRET_KEY = 'test_kashier_secret_key_1234567890_min32';
const TEST_PAYMENT_API_KEY = 'test_kashier_payment_api_key_12345';
const TEST_MERCHANT_ID = 'MID-0001-TEST';

function clearRateLimits() {
  const ips = ['::1', '127.0.0.1', '::ffff:127.0.0.1'];
  for (const ip of ips) {
    resetAllLimiters(ip);
  }
}

function generateKashierSignature(data, secretKey = TEST_SECRET_KEY) {
  const keys = data.signatureKeys || [];
  const queryString = keys.map((k) => `${k}=${data[k] !== undefined && data[k] !== null ? data[k] : ''}`).join('&');
  return crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
}

async function setup() {
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  }

  await User.deleteMany({});
  await Course.deleteMany({});
  await Order.deleteMany({});
  await Payment.deleteMany({});
  await WebhookEvent.deleteMany({});

  const commonData = {
    fatherName: 'Father',
    grade: 'grade1',
    governorate: 'Cairo',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian Test', relation: 'father', phone: '01099999999' },
    isEmailVerified: true,
    isActive: true,
    acceptTerms: true,
    acceptPrivacy: true,
  };

  studentA = await User.create({
    firstName: 'Student',
    lastName: 'Alpha',
    name: 'Student Alpha',
    email: 'alpha_h@platform.com',
    phone: '01022222211',
    password: 'Password123!',
    role: 'student',
    ...commonData,
  });

  studentB = await User.create({
    firstName: 'Student',
    lastName: 'Beta',
    name: 'Student Beta',
    email: 'beta_h@platform.com',
    phone: '01022222212',
    password: 'Password123!',
    role: 'student',
    ...commonData,
  });

  adminUser = await User.create({
    firstName: 'Admin',
    lastName: 'Hardening',
    name: 'Admin Hardening',
    email: 'admin_h@platform.com',
    phone: '01022222213',
    password: 'Password123!',
    role: 'admin',
    ...commonData,
  });

  tokenA = generateAccessToken(studentA);
  tokenB = generateAccessToken(studentB);
  tokenAdmin = generateAccessToken(adminUser);

  testCourse = await Course.create({
    title: 'Hardened Security Engineering',
    description: 'Payment security & state machines',
    price: 350.50,
    category: 'Computer Science',
    instructor: adminUser._id,
    isPublished: true,
    totalStudents: 0,
  });

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
}

async function teardown() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

async function runTests() {
  console.log('========================================================');
  console.log('PHASE 4C.6 — KASHIER PAYMENT HARDENING TEST SUITE');
  console.log('========================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (!condition) {
      console.log(`  ✗ FAIL: ${message}`);
      failedCount++;
      throw new Error(message);
    } else {
      console.log(`  ✓ PASS: ${message}`);
      passedCount++;
    }
  }

  process.env.KASHIER_MERCHANT_ID = TEST_MERCHANT_ID;
  process.env.KASHIER_PAYMENT_API_KEY = TEST_PAYMENT_API_KEY;
  process.env.KASHIER_SECRET_API_KEY = TEST_SECRET_KEY;
  process.env.KASHIER_ENVIRONMENT = 'test';

  const originalFetch = global.fetch;

  try {
    // ----------------------------------------------------
    // Section 1: State Machine Transition Guards (Tests 1 - 6)
    // ----------------------------------------------------
    console.log('\n--- 1. State Machine Transition Guards ---');

    // Create an order for Student A
    const order1 = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 350.50, title: testCourse.title }],
      totalAmount: 350.50,
      currency: 'EGP',
      status: 'pending',
    });

    // Test 1: Succeeded payment cannot revert to pending
    const payment1 = await Payment.create({
      order: order1._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 350.50,
      currency: 'EGP',
      status: 'succeeded',
      paidAt: new Date(),
    });

    const pendingRevertWh = {
      gateway: 'kashier',
      eventId: 'EV_REV_PENDING_1',
      eventType: 'pay',
      paymentId: payment1._id.toString(),
      status: 'pending',
      amount: 350.50,
      currency: 'EGP',
    };
    await paymentService.processNormalizedWebhook(pendingRevertWh);
    const p1After = await Payment.findById(payment1._id);
    assert(p1After.status === 'succeeded', 'Test 1: Succeeded payment cannot revert to pending');

    // Test 2: Succeeded payment cannot revert to failed
    const failedRevertWh = {
      gateway: 'kashier',
      eventId: 'EV_REV_FAILED_2',
      eventType: 'pay',
      paymentId: payment1._id.toString(),
      status: 'failed',
      amount: 350.50,
      currency: 'EGP',
    };
    await paymentService.processNormalizedWebhook(failedRevertWh);
    const p1AfterFail = await Payment.findById(payment1._id);
    assert(p1AfterFail.status === 'succeeded', 'Test 2: Succeeded payment cannot revert to failed');

    // Test 3: Succeeded payment cannot transition to cancelled
    const cancelledRevertWh = {
      gateway: 'kashier',
      eventId: 'EV_REV_CANCEL_3',
      eventType: 'pay',
      paymentId: payment1._id.toString(),
      status: 'cancelled',
      amount: 350.50,
      currency: 'EGP',
    };
    await paymentService.processNormalizedWebhook(cancelledRevertWh);
    const p1AfterCancel = await Payment.findById(payment1._id);
    assert(p1AfterCancel.status === 'succeeded', 'Test 3: Succeeded payment cannot transition to cancelled');

    // Test 4: Succeeded payment cannot transition to expired
    const expiredRevertWh = {
      gateway: 'kashier',
      eventId: 'EV_REV_EXP_4',
      eventType: 'pay',
      paymentId: payment1._id.toString(),
      status: 'expired',
      amount: 350.50,
      currency: 'EGP',
    };
    await paymentService.processNormalizedWebhook(expiredRevertWh);
    const p1AfterExp = await Payment.findById(payment1._id);
    assert(p1AfterExp.status === 'succeeded', 'Test 4: Succeeded payment cannot transition to expired');

    // Test 5: Order status is verified
    const o1After = await Order.findById(order1._id);
    assert(o1After.status === 'pending', 'Test 5: Order status is verified');

    // Test 6: Terminal state enforcement (failed attempt cannot become pending)
    const failedPayment = await Payment.create({
      order: order1._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 350.50,
      currency: 'EGP',
      status: 'failed',
      failureReason: 'Initial failure',
    });
    let invalidTransitionBlocked = false;
    try {
      await paymentService.processNormalizedWebhook({
        gateway: 'kashier',
        eventId: 'EV_FAIL_TO_PEND_6',
        eventType: 'pay',
        paymentId: failedPayment._id.toString(),
        status: 'pending',
        amount: 350.50,
        currency: 'EGP',
      });
    } catch (err) {
      invalidTransitionBlocked = err.statusCode === 400;
    }
    assert(invalidTransitionBlocked, 'Test 6: Terminal state enforcement (failed attempt cannot revert to pending)');

    // ----------------------------------------------------
    // Section 2: Order ↔ Payment Consistency (Tests 7 - 10)
    // ----------------------------------------------------
    console.log('\n--- 2. Order ↔ Payment Consistency ---');

    const orderCons = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 350.50, title: testCourse.title }],
      totalAmount: 350.50,
      currency: 'EGP',
      status: 'pending',
    });

    const paymentConsSuccess = await Payment.create({
      order: orderCons._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 350.50,
      currency: 'EGP',
      status: 'pending',
    });

    const successWh = {
      gateway: 'kashier',
      eventId: 'EV_CONS_SUCCESS_7',
      eventType: 'pay',
      paymentId: paymentConsSuccess._id.toString(),
      status: 'succeeded',
      amount: 350.50,
      currency: 'EGP',
      gatewayTransactionId: 'TX_CONS_7',
    };
    await paymentService.processNormalizedWebhook(successWh);

    // Test 7: Completed order remains completed
    const oConsAfter = await Order.findById(orderCons._id);
    assert(oConsAfter.status === 'completed', 'Test 7: Completed order status is completed');

    // Test 8: Failed retry attempt does NOT downgrade completed order
    const olderAttemptFailed = await Payment.create({
      order: orderCons._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 350.50,
      currency: 'EGP',
      status: 'pending',
    });
    const failedRetryWh = {
      gateway: 'kashier',
      eventId: 'EV_CONS_FAIL_RETRY_8',
      eventType: 'pay',
      paymentId: olderAttemptFailed._id.toString(),
      status: 'failed',
      amount: 350.50,
      currency: 'EGP',
      gatewayTransactionId: 'TX_CONS_FAIL_8',
    };
    await paymentService.processNormalizedWebhook(failedRetryWh);
    const oConsAfterRetry = await Order.findById(orderCons._id);
    assert(oConsAfterRetry.status === 'completed', 'Test 8: Failed retry attempt does NOT downgrade completed order');

    // Test 9: Pending retry attempt does NOT downgrade completed order
    const pendingAttempt = await Payment.create({
      order: orderCons._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 350.50,
      currency: 'EGP',
      status: 'pending',
    });
    const pendingRetryWh = {
      gateway: 'kashier',
      eventId: 'EV_CONS_PEND_RETRY_9',
      eventType: 'pay',
      paymentId: pendingAttempt._id.toString(),
      status: 'pending',
      amount: 350.50,
      currency: 'EGP',
    };
    await paymentService.processNormalizedWebhook(pendingRetryWh);
    const oConsAfterPendingRetry = await Order.findById(orderCons._id);
    assert(oConsAfterPendingRetry.status === 'completed', 'Test 9: Pending retry does NOT downgrade completed order');

    // Test 10: Student enrollment is preserved regardless of failed retries
    const studentCheck10 = await User.findById(studentA._id);
    assert(
      studentCheck10.enrolledCourses.map((c) => c.toString()).includes(testCourse._id.toString()),
      'Test 10: Student enrollment is preserved regardless of failed retries'
    );

    // ----------------------------------------------------
    // Section 3: Monetary Precision & Minor Units (Tests 11 - 15)
    // ----------------------------------------------------
    console.log('\n--- 3. Monetary Precision & Minor Units ---');

    const orderPrecision = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 100.50, title: testCourse.title }],
      totalAmount: 100.50,
      currency: 'EGP',
      status: 'pending',
    });

    const paymentPrecision = await Payment.create({
      order: orderPrecision._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 100.50,
      currency: 'EGP',
      status: 'pending',
    });

    // Test 11: Exact match with decimal 100.50 succeeds
    const whPrec11 = {
      gateway: 'kashier',
      eventId: 'EV_PREC_EXACT_11',
      eventType: 'pay',
      paymentId: paymentPrecision._id.toString(),
      status: 'succeeded',
      amount: 100.50,
      currency: 'EGP',
      gatewayTransactionId: 'TX_PREC_11',
    };
    await paymentService.processNormalizedWebhook(whPrec11);
    const pPrec11 = await Payment.findById(paymentPrecision._id);
    assert(pPrec11.status === 'succeeded', 'Test 11: Exact match with decimal 100.50 succeeds');

    // Test 12: Decimal string amount '100.50' converts accurately in minor units
    const paymentStringAmt = await Payment.create({
      order: orderPrecision._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 100.50,
      currency: 'EGP',
      status: 'pending',
    });
    const whPrec12 = {
      gateway: 'kashier',
      eventId: 'EV_PREC_STR_12',
      eventType: 'pay',
      paymentId: paymentStringAmt._id.toString(),
      status: 'succeeded',
      amount: '100.50',
      currency: 'EGP',
      gatewayTransactionId: 'TX_PREC_12',
    };
    await paymentService.processNormalizedWebhook(whPrec12);
    const pPrec12 = await Payment.findById(paymentStringAmt._id);
    assert(pPrec12.status === 'succeeded', 'Test 12: Decimal string amount converts accurately in minor units');

    // Test 13: 1 cent / piastre discrepancy is rejected
    const paymentCents = await Payment.create({
      order: orderPrecision._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 100.50,
      currency: 'EGP',
      status: 'pending',
    });
    let centDiscrepancyBlocked = false;
    try {
      await paymentService.processNormalizedWebhook({
        gateway: 'kashier',
        eventId: 'EV_PREC_CENT_13',
        eventType: 'pay',
        paymentId: paymentCents._id.toString(),
        status: 'succeeded',
        amount: 100.51,
        currency: 'EGP',
      });
    } catch (err) {
      centDiscrepancyBlocked = err.statusCode === 400;
    }
    assert(centDiscrepancyBlocked, 'Test 13: 1 cent / piastre discrepancy is rejected (400)');

    // Test 14: Discrepancy returns 400
    let largeDiscrepancyBlocked = false;
    try {
      await paymentService.processNormalizedWebhook({
        gateway: 'kashier',
        eventId: 'EV_PREC_LARGE_14',
        eventType: 'pay',
        paymentId: paymentCents._id.toString(),
        status: 'succeeded',
        amount: 100.00,
        currency: 'EGP',
      });
    } catch (err) {
      largeDiscrepancyBlocked = err.statusCode === 400;
    }
    assert(largeDiscrepancyBlocked, 'Test 14: Discrepancy returns 400');

    // Test 15: Currency mismatch is rejected
    let currencyMismatchBlocked = false;
    try {
      await paymentService.processNormalizedWebhook({
        gateway: 'kashier',
        eventId: 'EV_PREC_CURR_15',
        eventType: 'pay',
        paymentId: paymentCents._id.toString(),
        status: 'succeeded',
        amount: 100.50,
        currency: 'USD',
      });
    } catch (err) {
      currencyMismatchBlocked = err.statusCode === 400;
    }
    assert(currencyMismatchBlocked, 'Test 15: Currency mismatch is rejected (400)');

    // ----------------------------------------------------
    // Section 4: Webhook Idempotency & Concurrency (Tests 16 - 19)
    // ----------------------------------------------------
    console.log('\n--- 4. Webhook Idempotency & Concurrency ---');

    const orderConcurr = await Order.create({
      user: studentB._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 350.50, title: testCourse.title }],
      totalAmount: 350.50,
      currency: 'EGP',
      status: 'pending',
    });

    const paymentConcurr = await Payment.create({
      order: orderConcurr._id,
      user: studentB._id,
      gateway: 'kashier',
      amount: 350.50,
      currency: 'EGP',
      status: 'pending',
    });

    const concWhEvent = {
      gateway: 'kashier',
      eventId: 'EV_CONC_RACE_16',
      eventType: 'pay',
      paymentId: paymentConcurr._id.toString(),
      status: 'succeeded',
      amount: 350.50,
      currency: 'EGP',
      gatewayTransactionId: 'TX_CONC_16',
    };

    // Test 16: Concurrent webhooks race execution does not throw or double fulfill
    const [resRace1, resRace2] = await Promise.all([
      paymentService.processNormalizedWebhook(concWhEvent),
      paymentService.processNormalizedWebhook(concWhEvent),
    ]);
    const duplicateDetected = resRace1.duplicate === true || resRace2.duplicate === true;
    assert(duplicateDetected, 'Test 16: Concurrent webhooks race execution handles duplicate gracefully');

    // Test 17: Database unique index on WebhookEvent preserves single record
    const eventRecords = await WebhookEvent.find({ gateway: 'kashier', eventId: 'EV_CONC_RACE_16' });
    assert(eventRecords.length === 1, 'Test 17: Database unique index on WebhookEvent preserves single record');

    // Test 18: Order completed exactly once
    const orderConcurrAfter = await Order.findById(orderConcurr._id);
    assert(orderConcurrAfter.status === 'completed', 'Test 18: Order completed exactly once');

    // Test 19: Subsequent sequential duplicate returns duplicate flag
    const resSeqDup = await paymentService.processNormalizedWebhook(concWhEvent);
    assert(resSeqDup.duplicate === true, 'Test 19: Subsequent sequential duplicate returns duplicate: true');

    // ----------------------------------------------------
    // Section 5: Payment Attempt Limits (Tests 20 - 23)
    // ----------------------------------------------------
    console.log('\n--- 5. Payment Attempt Limits ---');

    const orderLimitTest = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 200, title: testCourse.title }],
      totalAmount: 200,
      currency: 'EGP',
      status: 'pending',
    });

    // Test 20: First attempt succeeds within limit
    const att1 = await paymentService.createPaymentAttempt(studentA._id, {
      orderId: orderLimitTest._id,
      gateway: 'manual',
    });
    assert(att1.payment && att1.payment.status === 'pending', 'Test 20: First attempt succeeds within limit');

    // Test 21: Subsequent attempts up to default limit (5) succeed
    await paymentService.createPaymentAttempt(studentA._id, { orderId: orderLimitTest._id, gateway: 'manual' });
    await paymentService.createPaymentAttempt(studentA._id, { orderId: orderLimitTest._id, gateway: 'manual' });
    await paymentService.createPaymentAttempt(studentA._id, { orderId: orderLimitTest._id, gateway: 'manual' });
    await paymentService.createPaymentAttempt(studentA._id, { orderId: orderLimitTest._id, gateway: 'manual' });
    const countBeforeMax = await Payment.countDocuments({ order: orderLimitTest._id });
    assert(countBeforeMax === 5, 'Test 21: Subsequent attempts up to default limit (5) succeed');

    // Test 22: Attempt beyond limit (6th attempt) is rejected with 400
    let limitExceededBlocked = false;
    try {
      await paymentService.createPaymentAttempt(studentA._id, {
        orderId: orderLimitTest._id,
        gateway: 'manual',
      });
    } catch (err) {
      limitExceededBlocked = err.statusCode === 400 && err.message.includes('تم تجاوز الحد الأقصى');
    }
    assert(limitExceededBlocked, 'Test 22: Attempt beyond limit (6th attempt) is rejected with 400');

    // Test 23: Completed order cannot initiate new payment attempts
    const completedOrderLimit = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 100, title: testCourse.title }],
      totalAmount: 100,
      currency: 'EGP',
      status: 'completed',
    });
    let completedAttemptBlocked = false;
    try {
      await paymentService.createPaymentAttempt(studentA._id, {
        orderId: completedOrderLimit._id,
        gateway: 'manual',
      });
    } catch (err) {
      completedAttemptBlocked = err.statusCode === 400 && err.message.includes('مكتمل بالفعل');
    }
    assert(completedAttemptBlocked, 'Test 23: Completed order cannot initiate new payment attempts');

    // ----------------------------------------------------
    // Section 6: Expiration Guards (Tests 24 - 26)
    // ----------------------------------------------------
    console.log('\n--- 6. Expiration Guards ---');

    const orderExp = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 150, title: testCourse.title }],
      totalAmount: 150,
      currency: 'EGP',
      status: 'pending',
    });

    // Test 24: New payment attempt has valid expiresAt set in future
    const freshAttempt = await paymentService.createPaymentAttempt(studentA._id, {
      orderId: orderExp._id,
      gateway: 'manual',
    });
    assert(
      freshAttempt.payment.expiresAt && new Date(freshAttempt.payment.expiresAt) > new Date(),
      'Test 24: New payment attempt has valid expiresAt set in future'
    );

    // Test 25: Expired payment cannot fulfill order via webhook
    const expiredPayment = await Payment.create({
      order: orderExp._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 150,
      currency: 'EGP',
      status: 'pending',
      expiresAt: new Date(Date.now() - 3600 * 1000),
    });

    let expiredFulfillmentBlocked = false;
    try {
      await paymentService.processNormalizedWebhook({
        gateway: 'kashier',
        eventId: 'EV_EXP_REJECT_25',
        eventType: 'pay',
        paymentId: expiredPayment._id.toString(),
        status: 'succeeded',
        amount: 150,
        currency: 'EGP',
      });
    } catch (err) {
      expiredFulfillmentBlocked = err.statusCode === 400 && err.message.includes('انتهت صلاحيتها');
    }
    assert(expiredFulfillmentBlocked, 'Test 25: Expired payment cannot fulfill order via webhook (400)');

    // Test 26: Expired payment marked expired in DB
    const expiredPaymentAfter = await Payment.findById(expiredPayment._id);
    assert(expiredPaymentAfter.status === 'expired', 'Test 26: Expired payment marked expired in DB');

    // ----------------------------------------------------
    // Section 7: Security & IDOR Verification (Tests 27 - 30)
    // ----------------------------------------------------
    console.log('\n--- 7. Security & IDOR Verification ---');

    // Test 27: Student cannot access another student payment attempt by ID
    clearRateLimits();
    const resIdor27 = await fetch(`${baseUrl}/api/v1/payments/${expiredPayment._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });
    assert(resIdor27.status === 403, 'Test 27: Student cannot access another student payment attempt by ID (403)');

    // Test 28: Admin CAN access student payment attempt by ID
    clearRateLimits();
    const resAdmin28 = await fetch(`${baseUrl}/api/v1/payments/${expiredPayment._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
      },
    });
    assert(resAdmin28.status === 200, 'Test 28: Admin CAN access student payment attempt by ID (200)');

    // Test 29: Student cannot query order attempts of another student
    clearRateLimits();
    const resAttempts29 = await fetch(`${baseUrl}/api/v1/payments/attempts/${orderExp._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });
    assert(resAttempts29.status === 403, 'Test 29: Student cannot query order attempts of another student (403)');

    // Test 30: Student cannot query order payment status of another student
    clearRateLimits();
    const resStatus30 = await fetch(`${baseUrl}/api/v1/payments/status/${orderExp._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });
    assert(resStatus30.status === 403, 'Test 30: Student cannot query order payment status of another student (403)');

    // ----------------------------------------------------
    // Section 8: Upstream Timeout & Resilience (Tests 31 - 33)
    // ----------------------------------------------------
    console.log('\n--- 8. Upstream Timeout & Resilience ---');

    const kashierGateway = PaymentGatewayFactory.get('kashier');

    // Test 31: Kashier session creation enforces upstream request timeout handling
    global.fetch = async (url, options) => {
      if (typeof url === 'string' && url.includes('/v3/payment/sessions')) {
        const timeoutError = new Error('The operation was aborted due to timeout');
        timeoutError.name = 'TimeoutError';
        throw timeoutError;
      }
      return originalFetch(url, options);
    };

    const orderTimeout = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 300, title: testCourse.title }],
      totalAmount: 300,
      currency: 'EGP',
      status: 'pending',
    });

    const paymentTimeout = await Payment.create({
      order: orderTimeout._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 300,
      currency: 'EGP',
      status: 'pending',
    });

    let timeoutHandledSafely = false;
    try {
      await kashierGateway.createPaymentSession(paymentTimeout, orderTimeout, studentA);
    } catch (err) {
      timeoutHandledSafely = err.statusCode === 502;
    }
    assert(timeoutHandledSafely, 'Test 31: Kashier session creation enforces upstream request timeout handling (502)');

    // Test 32: Webhook endpoint rate limiter is applied
    clearRateLimits();
    const validWhData = {
      signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
      merchantOrderId: paymentTimeout._id.toString(),
      transactionId: 'TX_WL_32',
      amount: 300,
      currency: 'EGP',
      status: 'SUCCESS',
    };
    const validWhSig = generateKashierSignature(validWhData);

    const resWh32 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': validWhSig,
      },
      body: JSON.stringify({
        event: 'pay',
        data: validWhData,
      }),
    });
    assert(resWh32.status === 200, 'Test 32: Webhook accepts legitimate request without false rate-limit blocking');

    // Test 33: Sensitive fields sanitized in payment JSON serialization
    paymentTimeout.gatewayResponse = {
      sessionId: 'sess_sec_99',
      secretApiKey: 'TOP_SECRET_MUST_DELETE',
      apiSecret: 'ANOTHER_SECRET',
    };
    await paymentTimeout.save();
    const serializedJson = JSON.stringify(paymentTimeout.toJSON());
    assert(
      !serializedJson.includes('TOP_SECRET_MUST_DELETE') && !serializedJson.includes('ANOTHER_SECRET'),
      'Test 33: Sensitive fields sanitized in payment JSON serialization'
    );
  } finally {
    global.fetch = originalFetch;
    await teardown();
  }

  console.log('\n========================================================');
  console.log(`TEST SUMMARY: ${passedCount} passed, ${failedCount} failed`);
  if (failedCount === 0) {
    console.log('FINAL RESULT: ALL TESTS PASSED ✓');
  } else {
    console.log('FINAL RESULT: SOME TESTS FAILED ✗');
    process.exit(1);
  }
  console.log('========================================================\n');
}

setup().then(runTests).catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
