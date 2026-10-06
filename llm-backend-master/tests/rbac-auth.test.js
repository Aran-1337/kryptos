const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const TeamMember = require('../src/modules/team/team.model');
const Course = require('../src/modules/courses/course.model');
const Order = require('../src/modules/orders/order.model');
const { generateAccessToken } = require('../src/utils/jwt');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

let mongoServer;
let server;
let baseUrl;

// Fixtures
let adminUser;
let studentUser;
let teamMemberWithStudentsPerm;
let teamMemberWithPaymentsPerm;
let teamMemberWithCoursesOnly;
let testCourse;
let testPendingOrder;

// Tokens
let adminToken;
let studentToken;
let memberWithStudentsToken;
let memberWithPaymentsToken;
let memberWithCoursesOnlyToken;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up RBAC & Auth Security Test Environment ===${colors.reset}`);

  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB: ${uri}`);
  }

  // Clear collections
  await User.deleteMany({});
  await TeamMember.deleteMany({});
  await Course.deleteMany({});
  await Order.deleteMany({});

  // 1. Seed Admin
  adminUser = await User.create({
    firstName: 'Platform',
    fatherName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@platform.com',
    phone: '01099999991',
    password: 'Password123!',
    grade: 'grade1',
    governorate: 'Cairo',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian Admin', relation: 'father', phone: '01099999992' },
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
    acceptTerms: true,
    acceptPrivacy: true,
  });

  // 2. Seed Student
  studentUser = await User.create({
    firstName: 'Student',
    fatherName: 'Regular',
    lastName: 'Learner',
    email: 'student.rbac@platform.com',
    phone: '01088888881',
    password: 'Password123!',
    grade: 'grade1',
    governorate: 'Giza',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian Student', relation: 'father', phone: '01088888882' },
    role: 'student',
    isEmailVerified: true,
    isActive: true,
    acceptTerms: true,
    acceptPrivacy: true,
    enrolledCourses: [],
  });

  // 3. Seed TeamMember with 'students' permission
  teamMemberWithStudentsPerm = await TeamMember.create({
    name: 'Sarah StudentManager',
    email: 'sarah.students@platform.com',
    password: 'Password123!',
    role: 'assistant',
    permissions: ['students'],
    isAccepted: true,
    isActive: true,
  });

  // 4. Seed TeamMember with 'payments' permission (and orders.approve)
  teamMemberWithPaymentsPerm = await TeamMember.create({
    name: 'Tarek Finance',
    email: 'tarek.finance@platform.com',
    password: 'Password123!',
    role: 'assistant',
    permissions: ['payments'],
    isAccepted: true,
    isActive: true,
  });

  // 5. Seed TeamMember with 'courses' only
  teamMemberWithCoursesOnly = await TeamMember.create({
    name: 'Kareem Academic',
    email: 'kareem.courses@platform.com',
    password: 'Password123!',
    role: 'assistant',
    permissions: ['courses'],
    isAccepted: true,
    isActive: true,
  });

  // 6. Seed Course
  testCourse = await Course.create({
    title: 'Biology 101',
    slug: 'biology-101',
    description: 'Cell structure and genetics',
    price: 250,
    category: 'Biology',
    level: 'beginner',
    instructor: adminUser._id,
    isPublished: true,
    totalStudents: 0,
  });

  // 7. Seed Order
  testPendingOrder = await Order.create({
    user: studentUser._id,
    items: [{
      itemType: 'course',
      item: testCourse._id,
      price: 250,
      title: testCourse.title,
    }],
    totalAmount: 250,
    currency: 'EGP',
    status: 'pending',
    paymentMethod: 'manual',
    paymentGateway: 'manual',
  });

  // Generate Tokens
  adminToken = generateAccessToken(adminUser._id, adminUser.role, { type: 'user' });
  studentToken = generateAccessToken(studentUser._id, studentUser.role, { type: 'user' });
  memberWithStudentsToken = generateAccessToken(teamMemberWithStudentsPerm._id, 'assistant', { type: 'team_member' });
  memberWithPaymentsToken = generateAccessToken(teamMemberWithPaymentsPerm._id, 'assistant', { type: 'team_member' });
  memberWithCoursesOnlyToken = generateAccessToken(teamMemberWithCoursesOnly._id, 'assistant', { type: 'team_member' });

  // Start HTTP server on dynamic port
  await new Promise((resolve) => {
    server = http.createServer(app).listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`RBAC Test server running at: ${baseUrl}`);
      resolve();
    });
  });
}

async function teardown() {
  console.log(`\n${colors.cyan}=== Tearing down RBAC test environment ===${colors.reset}`);
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
      results.push({ name, status: 'PASS' });
      passedCount++;
      console.log(`  ${colors.green}✓ PASS:${colors.reset} ${name}`);
    } catch (err) {
      results.push({ name, status: 'FAIL', error: err.message });
      failedCount++;
      console.log(`  ${colors.red}✗ FAIL:${colors.reset} ${name}`);
      console.log(`    ${colors.red}Error: ${err.message}${colors.reset}`);
    }
  }

  console.log(`\n${colors.bold}${colors.cyan}=== RUNNING RBAC & IDENTITY SECURITY TEST SUITE ===${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1 — Valid Admin accesses protected admin endpoint -> 200 OK
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 1 — Valid Admin accesses protected student list endpoint (200 OK)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.status !== 200) {
      throw new Error(`Expected HTTP 200, received ${res.status}`);
    }
    const data = await res.json();
    if (data.status !== 'success') {
      throw new Error(`Expected success response, got: ${JSON.stringify(data)}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2 — Valid Student accesses admin-only endpoint -> 403 Forbidden
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 2 — Valid Student accesses admin user management endpoint (403 Forbidden)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for student accessing /users, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3 — Valid TeamMember logs in and accesses an allowed protected endpoint -> 200 OK
  // (Specifically verifies the TeamMember/User identity resolution bug is fixed)
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 3 — TeamMember login & identity resolution to access allowed endpoint (200 OK)', async () => {
    // 3a: Perform login via team login API
    const loginRes = await fetch(`${baseUrl}/api/v1/team/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sarah.students@platform.com',
        password: 'Password123!',
      }),
    });

    if (loginRes.status !== 200) {
      throw new Error(`Team login failed with HTTP ${loginRes.status}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.data.accessToken;
    if (!token) throw new Error('No accessToken returned in team login');

    // 3b: Access protected endpoint /api/v1/users with the newly obtained token
    const accessRes = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (accessRes.status !== 200) {
      throw new Error(
        `TeamMember access returned HTTP ${accessRes.status} instead of 200 OK. Identity resolution failed!`
      );
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4 — TeamMember Without Permission accesses endpoint -> 403 Forbidden
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 4 — TeamMember with only "courses" attempts to access "students" route (403 Forbidden)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${memberWithCoursesOnlyToken}` },
    });
    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5 — TeamMember With Permission accesses allowed endpoint -> 200 OK
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 5 — TeamMember with "students" permission accesses /users (200 OK)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${memberWithStudentsToken}` },
    });
    if (res.status !== 200) {
      throw new Error(`Expected HTTP 200 OK, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 6 — Invalid Token -> 401 Unauthorized
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 6 — Tampered / Invalid token returns 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: 'Bearer this.is.an.invalid.jwt.token' },
    });
    if (res.status !== 401) {
      throw new Error(`Expected HTTP 401 Unauthorized for malformed token, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 7 — Expired Token -> 401 Unauthorized
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 7 — Expired token returns 401 Unauthorized', async () => {
    const expiredToken = jwt.sign(
      { id: adminUser._id, role: 'admin', type: 'user' },
      config.jwt.secret,
      { expiresIn: '-1s' }
    );

    const res = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    if (res.status !== 401) {
      throw new Error(`Expected HTTP 401 Unauthorized for expired token, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 8 — Student Payment Approval -> 403 Forbidden
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 8 — Student attempting PATCH /orders/:id/approve returns 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${testPendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ transactionId: 'hack_tx' }),
    });
    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 9 — TeamMember Without orders.approve -> 403 Forbidden
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 9 — TeamMember without payments permission attempting order approval returns 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${testPendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberWithCoursesOnlyToken}`,
      },
      body: JSON.stringify({ transactionId: 'courses_only_tx' }),
    });
    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for member without payments, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 10 — Authorized Admin Payment Approval -> 200 OK & Idempotent
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 10 — Authorized Admin Payment Approval returns 200 OK with idempotency', async () => {
    // 10a: Initial approval by admin
    const res1 = await fetch(`${baseUrl}/api/v1/orders/${testPendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ transactionId: 'admin_official_tx_100', method: 'cash' }),
    });

    if (res1.status !== 200) {
      throw new Error(`Expected HTTP 200 OK for admin approval, received ${res1.status}`);
    }

    const data1 = await res1.json();
    if (data1.data.order.status !== 'completed') {
      throw new Error(`Expected completed order, got ${data1.data.order.status}`);
    }

    // 10b: Idempotent repeat approval
    const res2 = await fetch(`${baseUrl}/api/v1/orders/${testPendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ transactionId: 'admin_official_tx_100_repeat' }),
    });

    if (res2.status !== 200) {
      throw new Error(`Expected HTTP 200 OK for repeat admin approval, received ${res2.status}`);
    }

    // Verify course enrollment count
    const studentInDb = await User.findById(studentUser._id);
    const count = studentInDb.enrolledCourses.filter(c => c.toString() === testCourse._id.toString()).length;
    if (count !== 1) {
      throw new Error(`Expected student to be enrolled exactly 1 time, found: ${count}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // BONUS TEST 11 — TeamMember WITH payments permission CAN approve orders -> 200 OK
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 11 — Authorized TeamMember with "payments" permission CAN approve orders (200 OK)', async () => {
    // Create another pending order
    const secondOrder = await Order.create({
      user: studentUser._id,
      items: [{ itemType: 'course', item: testCourse._id, price: 100, title: 'Test' }],
      totalAmount: 100,
      currency: 'EGP',
      status: 'pending',
    });

    const res = await fetch(`${baseUrl}/api/v1/orders/${secondOrder._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberWithPaymentsToken}`,
      },
      body: JSON.stringify({ transactionId: 'finance_tarek_tx', method: 'fawry' }),
    });

    if (res.status !== 200) {
      throw new Error(`Expected HTTP 200 OK for member with payments permission, got ${res.status}`);
    }

    const data = await res.json();
    if (data.data.order.status !== 'completed') {
      throw new Error(`Expected order completed, got ${data.data.order.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // BONUS TEST 12 — Legacy Token Backward Compatibility (tokens without "type")
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 12 — Legacy token without "type" discriminator resolves properly', async () => {
    // 1. Legacy Admin Token
    const legacyAdminToken = jwt.sign(
      { id: adminUser._id, role: 'admin' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    const adminRes = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${legacyAdminToken}` },
    });
    if (adminRes.status !== 200) {
      throw new Error(`Legacy admin token failed with HTTP ${adminRes.status}`);
    }

    // 2. Legacy TeamMember Token
    const legacyMemberToken = jwt.sign(
      { id: teamMemberWithStudentsPerm._id, role: 'assistant' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    const memberRes = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${legacyMemberToken}` },
    });
    if (memberRes.status !== 200) {
      throw new Error(`Legacy team member token failed with HTTP ${memberRes.status}`);
    }
  });

  // Print Summary
  console.log(`\n${colors.bold}=== RBAC & IDENTITY TEST SUMMARY ===${colors.reset}`);
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
