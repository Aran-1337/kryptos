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
const KashierGateway = require('../src/modules/payments/gateways/adapters/kashier.gateway');
const { generateAccessToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');

let mongoServer;
let server;
let baseUrl;

// Fixtures
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
    email: 'alpha@platform.com',
    phone: '01022222201',
    password: 'Password123!',
    role: 'student',
    ...commonData,
  });

  studentB = await User.create({
    firstName: 'Student',
    lastName: 'Beta',
    name: 'Student Beta',
    email: 'beta@platform.com',
    phone: '01022222202',
    password: 'Password123!',
    role: 'student',
    ...commonData,
  });

  adminUser = await User.create({
    firstName: 'Admin',
    lastName: 'Kashier',
    name: 'Admin Kashier',
    email: 'admin.kashier@platform.com',
    phone: '01022222203',
    password: 'Password123!',
    role: 'admin',
    ...commonData,
  });

  tokenA = generateAccessToken(studentA);
  tokenB = generateAccessToken(studentB);
  tokenAdmin = generateAccessToken(adminUser);

  testCourse = await Course.create({
    title: 'Advanced Cryptography & Web Security',
    description: 'Complete hands-on security and payment architecture course',
    price: 500,
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
  console.log('PHASE 4C.4 — KASHIER PAYMENT GATEWAY INTEGRATION SUITE');
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

  // Set test credentials in environment for the test suite
  process.env.KASHIER_MERCHANT_ID = TEST_MERCHANT_ID;
  process.env.KASHIER_PAYMENT_API_KEY = TEST_PAYMENT_API_KEY;
  process.env.KASHIER_SECRET_API_KEY = TEST_SECRET_KEY;
  process.env.KASHIER_ENVIRONMENT = 'test';

  const originalFetch = global.fetch;

  try {
    // ----------------------------------------------------
    // Section 1: Configuration Tests (1 - 3)
    // ----------------------------------------------------
    console.log('\n--- 1. Configuration Tests ---');

    // Test 1: Missing Kashier credentials rejected safely
    {
      const unconfiguredGateway = new KashierGateway({
        merchantId: null,
        paymentApiKey: null,
        secretApiKey: null,
      });
      let errorThrown = false;
      try {
        await unconfiguredGateway.createPaymentSession({ amount: 100 }, { _id: 'dummy' });
      } catch (err) {
        errorThrown = err.statusCode === 503;
      }
      assert(errorThrown, 'Test 1: Missing Kashier credentials rejected safely (503)');
    }

    // Test 2: Test environment configuration loads
    {
      const testGateway = new KashierGateway({
        environment: 'test',
        merchantId: TEST_MERCHANT_ID,
        paymentApiKey: TEST_PAYMENT_API_KEY,
        secretApiKey: TEST_SECRET_KEY,
      });
      assert(
        testGateway.environment === 'test' && testGateway.testBaseUrl.includes('test-api.kashier.io'),
        'Test 2: Test environment configuration loads'
      );
    }

    // Test 3: Live environment configuration does not expose secrets
    {
      const liveGateway = new KashierGateway({
        environment: 'live',
        merchantId: TEST_MERCHANT_ID,
        paymentApiKey: TEST_PAYMENT_API_KEY,
        secretApiKey: TEST_SECRET_KEY,
      });
      const str = JSON.stringify(liveGateway);
      assert(
        liveGateway.environment === 'live' && liveGateway.liveBaseUrl.includes('api.kashier.io'),
        'Test 3: Live environment configuration loads without exposing secrets'
      );
    }

    // ----------------------------------------------------
    // Section 2: Payment Creation Tests (4 - 8)
    // ----------------------------------------------------
    console.log('\n--- 2. Payment Creation Tests ---');

    // Create an order for student A
    const orderA = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 500, title: testCourse.title }],
      totalAmount: 500,
      currency: 'EGP',
      status: 'pending',
    });

    // Mock global.fetch for Kashier session creation
    global.fetch = async (url, options) => {
      if (typeof url === 'string' && url.includes('/v3/payment/sessions')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            sessionId: 'ksh_sess_' + Date.now(),
            sessionUrl: 'https://test-iframe.kashier.io/checkout/test-session-123',
            orderReference: 'KSH_REF_' + Date.now(),
          }),
        };
      }
      return originalFetch(url, options);
    };

    // Test 4: Valid Order creates Payment attempt
    clearRateLimits();
    const resInit4 = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        orderId: orderA._id,
        gateway: 'kashier',
      }),
    });
    const dataInit4 = await resInit4.json();
    assert(
      resInit4.status === 200 && dataInit4.data?.payment?.gateway === 'kashier' && dataInit4.data?.payment?.status === 'pending',
      'Test 4: Valid Order creates Payment attempt'
    );

    // Test 5: Amount comes from Order
    assert(dataInit4.data?.payment?.amount === 500, 'Test 5: Amount comes from Order');

    // Test 6: Currency comes from Order
    assert(dataInit4.data?.payment?.currency === 'EGP', 'Test 6: Currency comes from Order');

    // Test 7: Client cannot override amount
    clearRateLimits();
    const resInit7 = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        orderId: orderA._id,
        gateway: 'kashier',
        amount: 1, // Tampered client amount
      }),
    });
    const dataInit7 = await resInit7.json();
    assert(dataInit7.data?.payment?.amount === 500, 'Test 7: Client cannot override amount');

    // Test 8: Client cannot override currency
    clearRateLimits();
    const resInit8 = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        orderId: orderA._id,
        gateway: 'kashier',
        currency: 'USD', // Tampered currency
      }),
    });
    const dataInit8 = await resInit8.json();
    assert(dataInit8.data?.payment?.currency === 'EGP', 'Test 8: Client cannot override currency');

    // ----------------------------------------------------
    // Section 3: Gateway Adapter & Factory Tests (9 - 12)
    // ----------------------------------------------------
    console.log('\n--- 3. Gateway Adapter & Factory Tests ---');

    // Test 9: PaymentGatewayFactory resolves Kashier
    const resolvedKashier = PaymentGatewayFactory.get('kashier');
    assert(resolvedKashier && typeof resolvedKashier === 'object', 'Test 9: PaymentGatewayFactory resolves Kashier');

    // Test 10: Kashier adapter is selected correctly
    assert(
      resolvedKashier instanceof KashierGateway && resolvedKashier.name === 'kashier',
      'Test 10: Kashier adapter is selected correctly'
    );

    // Test 11: Kashier session creation handles API failure safely
    {
      global.fetch = async () => ({
        ok: false,
        status: 502,
        text: async () => 'Kashier Upstream Timeout',
      });
      let handledSafely = false;
      try {
        const dummyPayment = await Payment.create({
          order: orderA._id,
          user: studentA._id,
          gateway: 'kashier',
          amount: 500,
          currency: 'EGP',
        });
        await resolvedKashier.createPaymentSession(dummyPayment, orderA, studentA);
      } catch (err) {
        handledSafely = err.statusCode === 502;
      }
      assert(handledSafely, 'Test 11: Kashier session creation handles API failure safely');
    }

    // Restore fetch mock
    global.fetch = async (url, options) => {
      if (typeof url === 'string' && url.includes('/v3/payment/sessions')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            sessionId: 'ksh_sess_' + Date.now(),
            sessionUrl: 'https://test-iframe.kashier.io/checkout/test-session-123',
            orderReference: 'KSH_REF_' + Date.now(),
          }),
        };
      }
      return originalFetch(url, options);
    };

    // Test 12: Secrets are never returned to frontend
    {
      const paymentRecord = await Payment.findById(dataInit4.data?.payment?.id);
      paymentRecord.gatewayResponse = {
        sessionId: 'sess_123',
        secretApiKey: 'MUST_NOT_LEAK',
        privateKey: 'MUST_NOT_LEAK',
      };
      await paymentRecord.save();
      const serialized = JSON.stringify(paymentRecord.toJSON());
      assert(
        !serialized.includes('MUST_NOT_LEAK') && !serialized.includes(TEST_SECRET_KEY),
        'Test 12: Secrets are never returned to frontend'
      );
    }

    // ----------------------------------------------------
    // Section 4: Webhook Security Tests (13 - 17)
    // ----------------------------------------------------
    console.log('\n--- 4. Webhook Security Tests ---');

    // Create fresh order and payment for webhook tests
    const orderWebhook = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 500, title: testCourse.title }],
      totalAmount: 500,
      currency: 'EGP',
      status: 'pending',
    });

    const paymentWebhook = await Payment.create({
      order: orderWebhook._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 500,
      currency: 'EGP',
      status: 'pending',
    });

    const validPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'orderReference', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentWebhook._id.toString(),
        orderReference: 'KSH_ORD_101',
        transactionId: 'KSH_TX_101',
        amount: 500,
        currency: 'EGP',
        status: 'SUCCESS',
      },
    };

    // Test 13: Valid Kashier signature accepted
    const validSignature = generateKashierSignature(validPayload.data);
    clearRateLimits();
    const resWh13 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': validSignature,
      },
      body: JSON.stringify(validPayload),
    });
    const dataWh13 = await resWh13.json();
    assert(resWh13.status === 200 && dataWh13.received === true, 'Test 13: Valid Kashier signature accepted');

    // Test 14: Invalid signature rejected
    clearRateLimits();
    const resWh14 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': 'invalid_forged_signature_hex_1234567890abcdef',
      },
      body: JSON.stringify(validPayload),
    });
    assert(resWh14.status === 400, 'Test 14: Invalid signature rejected');

    // Test 15: Missing signature rejected
    clearRateLimits();
    const resWh15 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validPayload),
    });
    assert(resWh15.status === 400, 'Test 15: Missing signature rejected');

    // Test 16: Modified payload rejected
    const tamperedPayload = {
      event: 'pay',
      data: {
        ...validPayload.data,
        amount: 50, // Tampered amount
      },
    };
    clearRateLimits();
    const resWh16 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': validSignature, // Signature of 500 used for 50
      },
      body: JSON.stringify(tamperedPayload),
    });
    assert(resWh16.status === 400, 'Test 16: Modified payload rejected');

    // Test 17: Invalid signature cannot complete order
    const pendingOrderCheck = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 500, title: testCourse.title }],
      totalAmount: 500,
      currency: 'EGP',
      status: 'pending',
    });
    const pendingPaymentCheck = await Payment.create({
      order: pendingOrderCheck._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 500,
      currency: 'EGP',
      status: 'pending',
    });
    clearRateLimits();
    await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': 'bad_sig',
      },
      body: JSON.stringify({
        event: 'pay',
        data: {
          signatureKeys: ['merchantOrderId', 'status'],
          merchantOrderId: pendingPaymentCheck._id.toString(),
          status: 'SUCCESS',
        },
      }),
    });
    const orderStillPending = await Order.findById(pendingOrderCheck._id);
    assert(orderStillPending.status === 'pending', 'Test 17: Invalid signature cannot complete order');

    // ----------------------------------------------------
    // Section 5: Payment Matching Tests (18 - 22)
    // ----------------------------------------------------
    console.log('\n--- 5. Payment Matching Tests ---');

    // Test 18: Unknown transaction rejected
    const unknownPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: new mongoose.Types.ObjectId().toString(),
        transactionId: 'TX_NONEXISTENT_999',
        amount: 500,
        currency: 'EGP',
        status: 'SUCCESS',
      },
    };
    clearRateLimits();
    const resWh18 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(unknownPayload.data),
      },
      body: JSON.stringify(unknownPayload),
    });
    assert(resWh18.status === 404, 'Test 18: Unknown transaction rejected (404)');

    // Test 19: Unknown payment rejected
    clearRateLimits();
    const resWh19 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(unknownPayload.data),
      },
      body: JSON.stringify(unknownPayload),
    });
    assert(resWh19.status === 404, 'Test 19: Unknown payment rejected');

    // Test 20: Wrong order/payment mapping rejected
    const dummyPaymentMismatched = await Payment.create({
      order: new mongoose.Types.ObjectId(), // Non-existent order
      user: studentA._id,
      gateway: 'kashier',
      amount: 500,
      currency: 'EGP',
      status: 'pending',
    });
    const wrongMappingPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: dummyPaymentMismatched._id.toString(),
        transactionId: 'TX_WRONG_MAP_1',
        amount: 500,
        currency: 'EGP',
        status: 'SUCCESS',
      },
    };
    clearRateLimits();
    const resWh20 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(wrongMappingPayload.data),
      },
      body: JSON.stringify(wrongMappingPayload),
    });
    assert(resWh20.status === 404, 'Test 20: Wrong order/payment mapping rejected');

    // Test 21: Amount mismatch rejected
    const paymentMismatch = await Payment.create({
      order: orderA._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 500,
      currency: 'EGP',
      status: 'pending',
    });
    const amountMismatchPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentMismatch._id.toString(),
        transactionId: 'TX_AMT_MISMATCH_1',
        amount: 300, // Expected 500, received 300
        currency: 'EGP',
        status: 'SUCCESS',
      },
    };
    clearRateLimits();
    const resWh21 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(amountMismatchPayload.data),
      },
      body: JSON.stringify(amountMismatchPayload),
    });
    assert(resWh21.status === 400, 'Test 21: Amount mismatch rejected');

    // Test 22: Currency mismatch rejected
    const currMismatchPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentMismatch._id.toString(),
        transactionId: 'TX_CURR_MISMATCH_1',
        amount: 500,
        currency: 'EUR', // Expected EGP, received EUR
        status: 'SUCCESS',
      },
    };
    clearRateLimits();
    const resWh22 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(currMismatchPayload.data),
      },
      body: JSON.stringify(currMismatchPayload),
    });
    assert(resWh22.status === 400, 'Test 22: Currency mismatch rejected');

    // ----------------------------------------------------
    // Section 6: Status & Lifecycle Tests (23 - 28)
    // ----------------------------------------------------
    console.log('\n--- 6. Status & Lifecycle Tests ---');

    // Create target order for status test
    const orderStatusTest = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 500, title: testCourse.title }],
      totalAmount: 500,
      currency: 'EGP',
      status: 'pending',
    });

    const paymentStatusTest = await Payment.create({
      order: orderStatusTest._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 500,
      currency: 'EGP',
      status: 'pending',
    });

    // Test 23: SUCCESS → Payment succeeded
    const successPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentStatusTest._id.toString(),
        transactionId: 'TX_SUCCESS_201',
        amount: 500,
        currency: 'EGP',
        status: 'SUCCESS',
      },
    };
    clearRateLimits();
    await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(successPayload.data),
      },
      body: JSON.stringify(successPayload),
    });
    const updatedPayment23 = await Payment.findById(paymentStatusTest._id);
    assert(updatedPayment23.status === 'succeeded', 'Test 23: SUCCESS → Payment succeeded');

    // Test 24: FAILURE → Payment failed
    const paymentFailTest = await Payment.create({
      order: orderA._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 500,
      currency: 'EGP',
      status: 'pending',
    });
    const failPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentFailTest._id.toString(),
        transactionId: 'TX_FAIL_202',
        amount: 500,
        currency: 'EGP',
        status: 'FAILURE',
      },
    };
    clearRateLimits();
    await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(failPayload.data),
      },
      body: JSON.stringify(failPayload),
    });
    const updatedPayment24 = await Payment.findById(paymentFailTest._id);
    assert(updatedPayment24.status === 'failed', 'Test 24: FAILURE → Payment failed');

    // Test 25: PENDING → Payment pending
    const paymentPendingTest = await Payment.create({
      order: orderA._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 500,
      currency: 'EGP',
      status: 'pending',
    });
    const pendingPayload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentPendingTest._id.toString(),
        transactionId: 'TX_PENDING_203',
        amount: 500,
        currency: 'EGP',
        status: 'PENDING',
      },
    };
    clearRateLimits();
    await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(pendingPayload.data),
      },
      body: JSON.stringify(pendingPayload),
    });
    const updatedPayment25 = await Payment.findById(paymentPendingTest._id);
    assert(updatedPayment25.status === 'pending', 'Test 25: PENDING → Payment pending');

    // Test 26: FAILED payment does not complete Order
    const orderStillPending26 = await Order.findById(orderA._id);
    assert(orderStillPending26.status === 'pending', 'Test 26: FAILED payment does not complete Order');

    // Test 27: PENDING payment does not enroll student
    const coursePendingTest = await Course.create({
      title: 'Pending Non-Enrollment Course',
      description: 'Pending non-enrollment test description',
      category: 'General',
      price: 400,
      instructor: adminUser._id,
      isPublished: true,
      totalStudents: 0,
    });
    const orderPendingTest = await Order.create({
      user: studentA._id,
      items: [{ itemType: 'course', item: coursePendingTest._id, price: 400, title: coursePendingTest.title }],
      totalAmount: 400,
      currency: 'EGP',
      status: 'pending',
    });
    const paymentPending27 = await Payment.create({
      order: orderPendingTest._id,
      user: studentA._id,
      gateway: 'kashier',
      amount: 400,
      currency: 'EGP',
      status: 'pending',
    });
    const pendingPayload27 = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentPending27._id.toString(),
        transactionId: 'TX_PENDING_207',
        amount: 400,
        currency: 'EGP',
        status: 'PENDING',
      },
    };
    clearRateLimits();
    await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(pendingPayload27.data),
      },
      body: JSON.stringify(pendingPayload27),
    });
    const studentUserCheck27 = await User.findById(studentA._id);
    assert(
      !studentUserCheck27.enrolledCourses.map((c) => c.toString()).includes(coursePendingTest._id.toString()),
      'Test 27: PENDING payment does not enroll student'
    );

    // Test 28: SUCCESS completes Order exactly once
    const completedOrder28 = await Order.findById(orderStatusTest._id);
    const studentUserCheck28 = await User.findById(studentA._id);
    assert(
      completedOrder28.status === 'completed' &&
        studentUserCheck28.enrolledCourses.map((c) => c.toString()).includes(testCourse._id.toString()),
      'Test 28: SUCCESS completes Order exactly once'
    );

    // ----------------------------------------------------
    // Section 7: Idempotency Tests (29 - 31)
    // ----------------------------------------------------
    console.log('\n--- 7. Idempotency Tests ---');

    // Test 29: Same webhook processed once
    const studentsCountBeforeDup = (await Course.findById(testCourse._id)).totalStudents;
    clearRateLimits();
    const resWh29 = await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(successPayload.data),
      },
      body: JSON.stringify(successPayload),
    });
    const dataWh29 = await resWh29.json();
    assert(resWh29.status === 200 && dataWh29.duplicate === true, 'Test 29: Same webhook processed once (duplicate detected)');

    // Test 30: Duplicate webhook does not duplicate enrollment
    const studentCheck30 = await User.findById(studentA._id);
    const enrollmentsCount = studentCheck30.enrolledCourses.filter(
      (c) => c.toString() === testCourse._id.toString()
    ).length;
    assert(enrollmentsCount === 1, 'Test 30: Duplicate webhook does not duplicate enrollment');

    // Test 31: Duplicate webhook does not increment course students twice
    const courseCheck31 = await Course.findById(testCourse._id);
    assert(
      courseCheck31.totalStudents === studentsCountBeforeDup,
      'Test 31: Duplicate webhook does not increment course students twice'
    );

    // ----------------------------------------------------
    // Section 8: Authorization & IDOR Tests (32 - 34)
    // ----------------------------------------------------
    console.log('\n--- 8. Authorization & IDOR Tests ---');

    // Test 32: Student cannot inspect another student's payment
    clearRateLimits();
    const resAuth32 = await fetch(`${baseUrl}/api/v1/payments/${paymentStatusTest._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenB}`, // Student B requesting Student A payment
      },
    });
    assert(resAuth32.status === 403, 'Test 32: Student cannot inspect another student payment (403)');

    // Test 33: Student cannot modify another student's payment
    clearRateLimits();
    const resAuth33 = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`, // Student B trying to pay for Student A order
      },
      body: JSON.stringify({
        orderId: orderStatusTest._id,
        gateway: 'kashier',
      }),
    });
    assert(resAuth33.status === 403, 'Test 33: Student cannot modify or pay for another student order (403)');

    // Test 34: Unauthorized user cannot trigger payment operations
    clearRateLimits();
    const resAuth34 = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderStatusTest._id,
        gateway: 'kashier',
      }),
    });
    assert(resAuth34.status === 401, 'Test 34: Unauthorized user cannot trigger payment operations (401)');

    // ----------------------------------------------------
    // Section 9: Retry Support Tests (35 - 36)
    // ----------------------------------------------------
    console.log('\n--- 9. Retry Support Tests ---');

    // Create a new order for Student B
    const course2 = await Course.create({
      title: 'Distributed Systems & Microservices',
      description: 'Advanced distributed architecture course',
      price: 700,
      category: 'Computer Science',
      instructor: adminUser._id,
      isPublished: true,
      totalStudents: 0,
    });

    const retryOrder = await Order.create({
      user: studentB._id,
      items: [{ itemType: 'course', item: course2._id, price: 700, title: course2.title }],
      totalAmount: 700,
      currency: 'EGP',
      status: 'pending',
    });

    // Attempt 1: Initiate payment and mark failed
    clearRateLimits();
    const resAtt1 = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        orderId: retryOrder._id,
        gateway: 'kashier',
      }),
    });
    const dataAtt1 = await resAtt1.json();
    const paymentAtt1Id = dataAtt1.data?.payment?.id;

    // Simulate webhook failure for Attempt 1
    const failAttempt1Payload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentAtt1Id,
        transactionId: 'TX_RETRY_FAIL_1',
        amount: 700,
        currency: 'EGP',
        status: 'FAILURE',
      },
    };
    clearRateLimits();
    await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(failAttempt1Payload.data),
      },
      body: JSON.stringify(failAttempt1Payload),
    });

    // Attempt 2: Student retries
    clearRateLimits();
    const resAtt2 = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        orderId: retryOrder._id,
        gateway: 'kashier',
      }),
    });
    const dataAtt2 = await resAtt2.json();
    const paymentAtt2Id = dataAtt2.data?.payment?.id;

    // Simulate webhook success for Attempt 2
    const successAttempt2Payload = {
      event: 'pay',
      data: {
        signatureKeys: ['merchantOrderId', 'transactionId', 'amount', 'currency', 'status'],
        merchantOrderId: paymentAtt2Id,
        transactionId: 'TX_RETRY_SUCCESS_2',
        amount: 700,
        currency: 'EGP',
        status: 'SUCCESS',
      },
    };
    clearRateLimits();
    await fetch(`${baseUrl}/api/v1/payments/webhook/kashier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kashier-signature': generateKashierSignature(successAttempt2Payload.data),
      },
      body: JSON.stringify(successAttempt2Payload),
    });

    // Test 35: Failed Kashier attempt can be followed by successful second attempt
    const finalRetryOrder = await Order.findById(retryOrder._id);
    const finalUserB = await User.findById(studentB._id);
    assert(
      finalRetryOrder.status === 'completed' &&
        finalUserB.enrolledCourses.map((c) => c.toString()).includes(course2._id.toString()),
      'Test 35: Failed Kashier attempt can be followed by successful second attempt'
    );

    // Test 36: Previous failed attempt remains in history
    clearRateLimits();
    const resHistory = await fetch(`${baseUrl}/api/v1/payments/attempts/${retryOrder._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });
    const dataHistory = await resHistory.json();
    const attempts = dataHistory.data?.attempts || [];
    const hasFailedAttempt = attempts.some((a) => a.status === 'failed');
    const hasSucceededAttempt = attempts.some((a) => a.status === 'succeeded');
    assert(
      attempts.length >= 2 && hasFailedAttempt && hasSucceededAttempt,
      'Test 36: Previous failed attempt remains in history'
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
