const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const Course = require('../src/modules/courses/course.model');
const Order = require('../src/modules/orders/order.model');
const { completeOrder } = require('../src/modules/orders/order.service');
const { generateAccessToken } = require('../src/utils/jwt');

let mongoServer;
let server;
let baseUrl;

// Fixtures
let studentUser;
let adminUser;
let testCourse;
let pendingOrder;
let studentToken;
let adminToken;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up Payment Security Test Environment ===${colors.reset}`);
  
  // Start MongoMemoryServer if not already connected
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB: ${uri}`);
  }

  // Clear test collections
  await User.deleteMany({});
  await Course.deleteMany({});
  await Order.deleteMany({});

  // Seed Admin
  adminUser = await User.create({
    firstName: 'Admin',
    fatherName: 'System',
    lastName: 'Manager',
    email: 'admin.sec@platform.com',
    phone: '01011111111',
    password: 'Password123!',
    grade: 'grade1',
    governorate: 'Cairo',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Parent Admin', relation: 'father', phone: '01011111112' },
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
    acceptTerms: true,
    acceptPrivacy: true,
  });

  // Seed Student
  studentUser = await User.create({
    firstName: 'Ahmed',
    fatherName: 'Student',
    lastName: 'Test',
    email: 'student.sec@platform.com',
    phone: '01022222222',
    password: 'Password123!',
    grade: 'grade1',
    governorate: 'Giza',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Parent Student', relation: 'father', phone: '01022222223' },
    role: 'student',
    isEmailVerified: true,
    isActive: true,
    acceptTerms: true,
    acceptPrivacy: true,
    enrolledCourses: [],
  });

  // Seed Course
  testCourse = await Course.create({
    title: 'Advanced Mathematics',
    slug: 'advanced-mathematics',
    description: 'Comprehensive calculus and algebra course',
    price: 350,
    category: 'Mathematics',
    level: 'advanced',
    instructor: adminUser._id,
    isPublished: true,
    totalStudents: 0,
  });

  // Seed Pending Order
  pendingOrder = await Order.create({
    user: studentUser._id,
    items: [{
      itemType: 'course',
      item: testCourse._id,
      price: 350,
      title: testCourse.title,
    }],
    totalAmount: 350,
    currency: 'EGP',
    status: 'pending',
    paymentMethod: 'manual',
    paymentGateway: 'manual',
  });

  // Generate JWTs
  studentToken = generateAccessToken(studentUser._id, studentUser.role);
  adminToken = generateAccessToken(adminUser._id, adminUser.role);

  // Start HTTP server on random free port
  await new Promise((resolve) => {
    server = http.createServer(app).listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server running at: ${baseUrl}`);
      resolve();
    });
  });
}

async function teardown() {
  console.log(`\n${colors.cyan}=== Tearing down test environment ===${colors.reset}`);
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
  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  async function test(name, fn) {
    try {
      await fn();
      results.push({ name, status: 'PASSED' });
      passedCount++;
      console.log(`  ${colors.green}✓ PASS:${colors.reset} ${name}`);
    } catch (err) {
      results.push({ name, status: 'FAILED', error: err.message });
      failedCount++;
      console.log(`  ${colors.red}✗ FAIL:${colors.reset} ${name}`);
      console.log(`    ${colors.red}Error: ${err.message}${colors.reset}`);
    }
  }

  console.log(`\n${colors.bold}${colors.cyan}=== RUNNING PAYMENT SECURITY TEST SUITE ===${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: Unauthenticated public request with gateway=manual must be blocked (403)
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 1: Unauthenticated POST /payments/webhook/manual is blocked (403 Forbidden)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/webhook/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: pendingOrder._id.toString() }),
    });

    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden, received ${res.status}`);
    }

    const data = await res.json();
    if (!data.message || !data.message.includes('غير مصرح بإجراء الدفع اليدوي')) {
      throw new Error(`Expected Arabic error message rejecting manual webhook, got: ${JSON.stringify(data)}`);
    }

    // Verify DB state: order must still be pending
    const orderInDb = await Order.findById(pendingOrder._id);
    if (orderInDb.status !== 'pending') {
      throw new Error(`Order status was modified to "${orderInDb.status}"! Expected "pending".`);
    }

    // Verify user not enrolled
    const studentInDb = await User.findById(studentUser._id);
    if (studentInDb.enrolledCourses.includes(testCourse._id)) {
      throw new Error(`Student was illegally enrolled in course!`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Authenticated student CANNOT approve manual payment (403 Forbidden)
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 2: Normal student token cannot approve manual payment via PATCH /orders/:id/approve (403 Forbidden)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${pendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ transactionId: 'hack_tx_123', note: 'Self approval' }),
    });

    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden, received ${res.status}`);
    }

    // Verify DB state: order must still be pending
    const orderInDb = await Order.findById(pendingOrder._id);
    if (orderInDb.status !== 'pending') {
      throw new Error(`Order status was modified to "${orderInDb.status}"! Expected "pending".`);
    }

    // Verify user not enrolled
    const studentInDb = await User.findById(studentUser._id);
    if (studentInDb.enrolledCourses.includes(testCourse._id)) {
      throw new Error(`Student was illegally enrolled in course!`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Authenticated Admin CAN approve manual payment (200 OK)
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 3: Authorized admin approves manual payment via PATCH /orders/:id/approve (200 OK)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${pendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        transactionId: 'vodafone_cash_987654',
        method: 'vodafone_cash',
        note: 'Approved after receipt confirmation',
      }),
    });

    if (res.status !== 200) {
      const errBody = await res.text();
      throw new Error(`Expected HTTP 200 OK, received ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    if (data.data.order.status !== 'completed') {
      throw new Error(`Expected order.status to be 'completed', got '${data.data.order.status}'`);
    }

    // Verify DB state: order completed
    const orderInDb = await Order.findById(pendingOrder._id);
    if (orderInDb.status !== 'completed') {
      throw new Error(`Order in DB status is ${orderInDb.status}`);
    }
    if (orderInDb.transactionId !== 'vodafone_cash_987654') {
      throw new Error(`Expected transactionId vodafone_cash_987654, got ${orderInDb.transactionId}`);
    }

    // Verify student is now enrolled
    const studentInDb = await User.findById(studentUser._id);
    const hasCourse = studentInDb.enrolledCourses.some(c => c.toString() === testCourse._id.toString());
    if (!hasCourse) {
      throw new Error(`Student enrolledCourses does not contain course ${testCourse._id}`);
    }

    // Verify course totalStudents incremented to 1
    const courseInDb = await Course.findById(testCourse._id);
    if (courseInDb.totalStudents !== 1) {
      throw new Error(`Expected course totalStudents to be 1, got ${courseInDb.totalStudents}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Idempotency & Repeat Protection
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 4: Repeat admin approval is idempotent (200 OK, no duplicate enrollment/student count)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${pendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        transactionId: 'vodafone_cash_repeat_tx',
        method: 'vodafone_cash',
      }),
    });

    if (res.status !== 200) {
      throw new Error(`Expected HTTP 200 OK on idempotent retry, received ${res.status}`);
    }

    // Verify student enrollment count did NOT duplicate
    const studentInDb = await User.findById(studentUser._id);
    const enrollmentOccurrences = studentInDb.enrolledCourses.filter(
      c => c.toString() === testCourse._id.toString()
    ).length;
    if (enrollmentOccurrences !== 1) {
      throw new Error(`Duplicate course found in enrolledCourses! Count: ${enrollmentOccurrences}`);
    }

    // Verify course totalStudents remains 1, NOT 2
    const courseInDb = await Course.findById(testCourse._id);
    if (courseInDb.totalStudents !== 1) {
      throw new Error(`Course totalStudents erroneously incremented to ${courseInDb.totalStudents}! Expected 1.`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4b: Backward-compatible route POST /complete/:orderId is admin-only
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 4b: Backward-compatible POST /orders/complete/:orderId rejects student (403) and accepts admin (200)', async () => {
    // 1. Student attempt -> 403 Forbidden
    const studentRes = await fetch(`${baseUrl}/api/v1/orders/complete/${pendingOrder._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ gateway: 'manual' }),
    });
    if (studentRes.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for student on /complete/:orderId, got ${studentRes.status}`);
    }

    // 2. Admin attempt -> 200 OK (idempotent completion)
    const adminRes = await fetch(`${baseUrl}/api/v1/orders/complete/${pendingOrder._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ gateway: 'manual' }),
    });
    if (adminRes.status !== 200) {
      throw new Error(`Expected HTTP 200 OK for admin on /complete/:orderId, got ${adminRes.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5: Invalid Mongo ID rejected with 400 Bad Request
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 5: Malformed order ID in approval route returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/not-a-valid-mongo-id/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ transactionId: 'test' }),
    });

    if (res.status !== 400) {
      throw new Error(`Expected HTTP 400 Bad Request for invalid mongo ID, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 6: Order Service unit level idempotency & invalid state rejection
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 6: completeOrder direct service tests (idempotency, invalid ID, non-pending status)', async () => {
    // 6a: Invalid Mongo ID
    let caughtInvalidId = false;
    try {
      await completeOrder('invalid-id-string', { gateway: 'manual' });
    } catch (err) {
      caughtInvalidId = true;
      if (err.statusCode !== 400) throw new Error(`Expected status 400, got ${err.statusCode}`);
    }
    if (!caughtInvalidId) throw new Error('completeOrder should throw on invalid order ID');

    // 6b: Idempotent call on already completed order
    const completedAgain = await completeOrder(pendingOrder._id.toString(), { gateway: 'manual' });
    if (completedAgain.status !== 'completed') {
      throw new Error(`Expected status 'completed', got '${completedAgain.status}'`);
    }

    // 6c: Reject non-pending (e.g. failed) order
    const failedOrder = await Order.create({
      user: studentUser._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 100, title: 'Test' }],
      totalAmount: 100,
      status: 'failed',
    });

    let caughtFailedOrder = false;
    try {
      await completeOrder(failedOrder._id.toString(), { gateway: 'manual' });
    } catch (err) {
      caughtFailedOrder = true;
      if (err.statusCode !== 400) throw new Error(`Expected status 400 for non-pending order, got ${err.statusCode}`);
    }
    if (!caughtFailedOrder) throw new Error('completeOrder should reject transitioning failed order');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 7 (Edge): Unconfigured gateway webhook returns 503 Service Unavailable
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 7: Webhook for unconfigured Stripe gateway returns 503 Service Unavailable', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const res = await fetch(`${baseUrl}/api/v1/payments/webhook/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (res.status !== 503) {
      throw new Error(`Expected HTTP 503 for unconfigured gateway, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 8 (Edge): Unsupported gateway returns 400 Bad Request
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 8: Webhook for unsupported gateway parameter returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/webhook/crypto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (res.status !== 400) {
      throw new Error(`Expected HTTP 400 for unsupported gateway, received ${res.status}`);
    }
  });

  // Print Summary
  console.log(`\n${colors.bold}=== TEST SUMMARY ===${colors.reset}`);
  console.log(`Total:  ${results.length}`);
  console.log(`Passed: ${colors.green}${passedCount}${colors.reset}`);
  console.log(`Failed: ${failedCount > 0 ? colors.red : colors.green}${failedCount}${colors.reset}\n`);

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exitCode = 1;
  } finally {
    await teardown();
  }
}

main();
