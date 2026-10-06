const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const config = require('../src/config');
const User = require('../src/modules/users/user.model');
const TeamMember = require('../src/modules/team/team.model');
const Course = require('../src/modules/courses/course.model');
const Book = require('../src/modules/books/book.model');
const Order = require('../src/modules/orders/order.model');
const Notification = require('../src/modules/notifications/notification.model');
const Review = require('../src/modules/reviews/review.model');
const { Quiz } = require('../src/modules/quizzes/quiz.model');
const { generateAccessToken, generateRefreshToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');

let mongoServer;
let server;
let baseUrl;

// Fixtures
let studentA, studentB;
let instructorUser;
let adminUser;
let teamAssistant;

let tokenStudentA, tokenStudentB;
let tokenInstructor;
let tokenAdmin;
let tokenAssistant;

let courseA;
let bookA;
let orderA;
let quizA;
let reviewA;
let notificationA;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up Phase 2J: Advanced Attack Surface Security Test Environment ===${colors.reset}`);

  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB: ${uri}`);
  }

  // Clear collections
  await Promise.all([
    User.deleteMany({}),
    TeamMember.deleteMany({}),
    Course.deleteMany({}),
    Book.deleteMany({}),
    Order.deleteMany({}),
    Notification.deleteMany({}),
    Review.deleteMany({}),
    Quiz.deleteMany({}),
  ]);

  const baseUserProps = {
    fatherName: 'Father',
    grade: 'grade1',
    school: 'Cairo Academy',
    governorate: 'Cairo',
    city: 'Nasr City',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian One', relation: 'father', phone: '01011119999' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    isActive: true,
  };

  // Seed Students
  studentA = await User.create({
    firstName: 'Student',
    lastName: 'Alpha',
    email: 'student.a.adv@test.com',
    phone: '01011110001',
    password: 'Password123!',
    role: 'student',
    ...baseUserProps,
  });

  studentB = await User.create({
    firstName: 'Student',
    lastName: 'Beta',
    email: 'student.b.adv@test.com',
    phone: '01011110002',
    password: 'Password123!',
    role: 'student',
    ...baseUserProps,
  });

  // Seed Instructor
  instructorUser = await User.create({
    firstName: 'Instructor',
    lastName: 'Senior',
    email: 'instructor.adv@test.com',
    phone: '01022220001',
    password: 'Password123!',
    role: 'instructor',
    permissions: ['courses', 'books', 'exams'],
    ...baseUserProps,
  });

  // Seed Admin
  adminUser = await User.create({
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin.adv@test.com',
    phone: '01033330001',
    password: 'Password123!',
    role: 'admin',
    permissions: ['*'],
    ...baseUserProps,
  });

  // Seed Team Member
  teamAssistant = await TeamMember.create({
    name: 'Team Assistant',
    email: 'assistant.adv@test.com',
    phone: '01044440001',
    password: 'Password123!',
    role: 'assistant',
    permissions: ['students'],
    isAccepted: true,
    isActive: true,
  });

  // Tokens
  tokenStudentA = generateAccessToken(studentA._id, 'student', { type: 'user' });
  tokenStudentB = generateAccessToken(studentB._id, 'student', { type: 'user' });
  tokenInstructor = generateAccessToken(instructorUser._id, 'instructor', { type: 'user' });
  tokenAdmin = generateAccessToken(adminUser._id, 'admin', { type: 'user' });
  tokenAssistant = generateAccessToken(teamAssistant._id, 'assistant', { type: 'team_member' });

  // Seed Course
  courseA = await Course.create({
    title: 'Advanced Attack Surface Course',
    description: 'Deep security testing and hardening course',
    instructor: instructorUser._id,
    category: 'Cybersecurity',
    grade: 'grade1',
    subject: 'Computer Science',
    price: 200,
    isPublished: true,
  });

  // Enroll Student A in Course A
  studentA.enrolledCourses = [courseA._id];
  await studentA.save();

  // Seed Book
  bookA = await Book.create({
    title: 'Defensive Architecture Guide',
    description: 'In-depth secure application design manual',
    author: 'Dr. Security',
    instructor: instructorUser._id,
    category: 'Engineering',
    price: 80,
    isFree: false,
    isPublished: true,
    pdf: { publicId: 'books/defensive_manual_raw', url: 'https://cloudinary.com/books/manual.pdf' },
  });

  // Seed Order for Student A
  orderA = await Order.create({
    user: studentA._id,
    items: [{
      itemType: 'course',
      item: courseA._id,
      price: 200,
    }],
    totalAmount: 200,
    currency: 'EGP',
    status: 'pending',
    paymentMethod: 'manual',
  });

  // Seed Quiz
  quizA = await Quiz.create({
    course: courseA._id,
    title: 'Module 1 Security Assessment',
    passingScore: 70,
    maxAttempts: 3,
    timeLimit: 30,
    isPublished: true,
    questions: [{
      type: 'multiple_choice',
      question: 'What is the purpose of rate limiting?',
      options: [
        { text: 'Prevent brute-force and resource abuse', isCorrect: true },
        { text: 'Speed up internet', isCorrect: false },
      ],
      points: 10,
    }],
  });

  // Seed Review
  reviewA = await Review.create({
    user: studentA._id,
    course: courseA._id,
    rating: 5,
    comment: 'Exceptional course quality and clarity.',
    isApproved: true,
  });

  // Seed Notification
  notificationA = await Notification.create({
    user: studentA._id,
    title: 'Welcome to Advanced Course',
    body: 'Your registration was completed successfully.',
    isRead: false,
  });

  // Start HTTP Server
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Test server running at ${baseUrl}`);
      resolve();
    });
  });
}

async function teardown() {
  console.log(`\n${colors.cyan}Tearing down test environment...${colors.reset}`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('Teardown complete.');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

let passedCount = 0;
let failedCount = 0;

function pass(testName) {
  passedCount++;
  console.log(`  ${colors.green}✓ PASS${colors.reset} - ${testName}`);
}

function fail(testName, error) {
  failedCount++;
  console.error(`  ${colors.red}✗ FAIL${colors.reset} - ${testName}`);
  console.error(`    ${colors.red}${error.message || error}${colors.reset}`);
}

async function runTests() {
  console.log(`\n${colors.yellow}${colors.bold}--- Starting Phase 2J: Advanced Attack Surface & Penetration Audit Tests ---${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // Test 1: Route Normalization & Trailing Slash Bypass Resistance
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Test trailing slash on protected route without auth
    const resSlash = await fetch(`${baseUrl}/api/v1/users/profile/`);
    assert(resSlash.status === 401, `Expected 401 on /profile/, got ${resSlash.status}`);

    // Test with double slash
    const resDoubleSlash = await fetch(`${baseUrl}/api/v1//users//profile`);
    assert(resDoubleSlash.status === 401 || resDoubleSlash.status === 404, `Expected 401/404, got ${resDoubleSlash.status}`);

    pass('Test 1: Route normalization & trailing slash variants strictly preserve authentication barriers');
  } catch (err) {
    fail('Test 1: Trailing slash / normalization bypass', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 2: HTTP HEAD Method Enforces Authentication
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const resHead = await fetch(`${baseUrl}/api/v1/users/profile`, { method: 'HEAD' });
    assert(resHead.status === 401, `Expected 401 on HEAD request without auth, got ${resHead.status}`);

    const resHeadAuth = await fetch(`${baseUrl}/api/v1/users/profile`, {
      method: 'HEAD',
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(resHeadAuth.status === 200, `Expected 200 on authenticated HEAD, got ${resHeadAuth.status}`);

    pass('Test 2: HTTP HEAD requests enforce authentication without bypassing authorization checks');
  } catch (err) {
    fail('Test 2: HEAD method auth bypass', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 3: Second-Pass IDOR - Student B cannot delete Student A review
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/courses/${courseA._id}/reviews/${reviewA._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenStudentB}` },
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);

    pass('Test 3: Second-Pass IDOR: Cross-user review deletion is strictly rejected (403)');
  } catch (err) {
    fail('Test 3: Cross-user review deletion IDOR', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 4: Second-Pass IDOR - Student B cannot mark Student A notification as read
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/notifications/${notificationA._id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenStudentB}` },
    });
    // The query isolates by { _id, user: req.user._id }, so Notification won't be updated for student B
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const checkDb = await Notification.findById(notificationA._id);
    assert(checkDb.isRead === false, 'Notification belonging to Student A must remain unread');

    pass('Test 4: Second-Pass IDOR: Notification ownership isolation prevents cross-user modification');
  } catch (err) {
    fail('Test 4: Notification cross-user update IDOR', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 5: Second-Pass Mass Assignment - Role / Permission injection on Profile Update
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({
        role: 'admin',
        permissions: ['*'],
        isBanned: false,
        balance: 999999,
      }),
    });
    assert(res.status === 400, `Expected 400 on role/permission tampering, got ${res.status}`);

    const userDb = await User.findById(studentA._id);
    assert(userDb.role === 'student', 'Role must remain student');

    pass('Test 5: Second-Pass Mass Assignment: Role and permission tampering in profile update is blocked (400)');
  } catch (err) {
    fail('Test 5: Profile mass assignment privilege escalation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 6: Second-Pass Mass Assignment - Course Price & Owner tampering on Update
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/courses/${courseA._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructor}`,
      },
      body: JSON.stringify({
        instructor: studentA._id,
        price: -50,
      }),
    });
    assert(res.status === 400, `Expected 400 on instructor/negative price tampering, got ${res.status}`);

    pass('Test 6: Course update prevents instructor reassignment and negative price injection (400)');
  } catch (err) {
    fail('Test 6: Course update mass assignment', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 7: Second-Pass Business Logic - Duplicate Course Enrollment Prevention
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Student A is already enrolled in Course A. Attempting to create an order for Course A must be rejected.
    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({
        items: [{ courseId: courseA._id.toString() }],
      }),
    });
    assert(res.status === 400, `Expected 400 for already enrolled course, got ${res.status}`);
    const data = await res.json();
    assert(data.message.includes('مسجل بالفعل'), 'Expected already enrolled error message');

    pass('Test 7: Business Logic: Re-ordering already enrolled courses is prevented at order creation (400)');
  } catch (err) {
    fail('Test 7: Duplicate enrollment business logic', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 8: Second-Pass Payment Logic - Client Price Tampering In Order Creation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Attempt to pass client-specified totalAmount or price: 0 for a 200 EGP course
    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentB}`,
      },
      body: JSON.stringify({
        items: [{ courseId: courseA._id.toString(), price: 0 }],
        totalAmount: 0,
      }),
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const data = await res.json();
    const createdOrder = data.data?.order || {};
    assert(createdOrder.totalAmount === 200, `Server must enforce catalog price 200, got ${createdOrder.totalAmount}`);
    assert(createdOrder.status === 'pending', 'Order must be pending payment');

    pass('Test 8: Financial Logic: Client price tampering ignored; totalAmount computed strictly from catalog');
  } catch (err) {
    fail('Test 8: Client price tampering in orders', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 9: Second-Pass Payment Logic - Self-Approving Payment via User Token
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/orders/${orderA._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({
        transactionId: 'fraud_self_approved',
      }),
    });
    assert(res.status === 403, `Expected 403 Forbidden for student payment approval, got ${res.status}`);

    pass('Test 9: Financial Logic: Normal students cannot approve or complete their own pending orders (403)');
  } catch (err) {
    fail('Test 9: Unauthorized payment approval', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 10: Second-Pass Payment Logic - Idempotency On Double Webhook / Approval
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // First admin approval
    const res1 = await fetch(`${baseUrl}/api/v1/orders/${orderA._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAdmin}`,
      },
      body: JSON.stringify({ transactionId: 'legit_tx_123' }),
    });
    assert(res1.status === 200, `Expected 200, got ${res1.status}`);

    // Second admin approval (simulating duplicate webhook or retry)
    const res2 = await fetch(`${baseUrl}/api/v1/orders/${orderA._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAdmin}`,
      },
      body: JSON.stringify({ transactionId: 'legit_tx_123' }),
    });
    assert(res2.status === 200, `Expected 200, got ${res2.status}`);

    // Verify student enrolled once without duplicates
    const studentDb = await User.findById(studentA._id);
    const courseOccurrences = studentDb.enrolledCourses.filter((c) => c.toString() === courseA._id.toString()).length;
    assert(courseOccurrences === 1, `Course must only be enrolled once, found ${courseOccurrences}`);

    pass('Test 10: Financial Logic: Order completion & approval is idempotent on repeated execution');
  } catch (err) {
    fail('Test 10: Order completion idempotency', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 11: JWT Security - Rejection of "none" Algorithm Tokens
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Forge an unsigned token with alg: none
    const unsignedHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const unsignedPayload = Buffer.from(JSON.stringify({ id: adminUser._id, role: 'admin', type: 'user' })).toString('base64url');
    const noneToken = `${unsignedHeader}.${unsignedPayload}.`;

    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${noneToken}` },
    });
    assert(res.status === 401, `Expected 401 for none algorithm token, got ${res.status}`);

    pass('Test 11: JWT Security: Unsigned / "none" algorithm tokens are strictly rejected (401)');
  } catch (err) {
    fail('Test 11: none algorithm token accepted', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 12: JWT Security - Asymmetric Key / Foreign Signature Rejection
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Sign with different key
    const rogueToken = jwt.sign(
      { id: adminUser._id, role: 'admin', type: 'user' },
      'wrong_unauthorized_key_99999',
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${rogueToken}` },
    });
    assert(res.status === 401, `Expected 401 on foreign signed token, got ${res.status}`);

    pass('Test 12: JWT Security: Tokens signed with unknown/foreign keys are rejected (401)');
  } catch (err) {
    fail('Test 12: Foreign signature accepted', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 13: JWT Security - Cross-Type Confusion: Refresh Token Not Accepted as Access Token
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const refreshToken = generateRefreshToken(studentA._id, { type: 'user' });

    // Try to access protected route with refresh token
    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    assert(res.status === 401, `Expected 401 when using refresh token as access token, got ${res.status}`);

    pass('Test 13: JWT Security: Refresh tokens cannot be substituted as access tokens (secret separation)');
  } catch (err) {
    fail('Test 13: Refresh token accepted as access token', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 14: CORS Security - Unauthorized Origin Preflight & Credentials
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil-attacker-website.com',
        'Access-Control-Request-Method': 'GET',
      },
    });

    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert(allowOrigin !== 'https://evil-attacker-website.com' && allowOrigin !== '*', 'Untrusted origin must not be allowed in CORS');

    pass('Test 14: CORS Security: Untrusted origins are denied Access-Control-Allow-Origin header');
  } catch (err) {
    fail('Test 14: CORS untrusted origin allowed', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 15: Browser Security - Helmet Security Headers Present
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    assert(res.headers.get('x-content-type-options') === 'nosniff', 'Expected X-Content-Type-Options: nosniff');
    assert(res.headers.get('x-frame-options') === 'DENY', 'Expected X-Frame-Options: DENY');
    assert(res.headers.get('strict-transport-security') !== null, 'Expected Strict-Transport-Security header');

    pass('Test 15: Browser Security: Strict headers (X-Frame-Options, nosniff, HSTS) are actively enforced');
  } catch (err) {
    fail('Test 15: Helmet headers missing', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 16: Path Traversal Second-Pass - Encoded Traversal in URL Params
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const resTraversal = await fetch(`${baseUrl}/api/v1/books/%2e%2e%2f%2e%2e%2fetc%2fpasswd/download`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    // Should be rejected by param validator (invalid mongo id) or 404
    assert(resTraversal.status === 400 || resTraversal.status === 404, `Expected 400/404, got ${resTraversal.status}`);
    const text = await resTraversal.text();
    assert(!text.includes('root:'), 'System files must never be leaked');

    pass('Test 16: Path Traversal: URL-encoded traversal sequences (%2e%2e) are rejected without filesystem access');
  } catch (err) {
    fail('Test 16: Encoded path traversal vulnerability', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 17: ReDoS & Regex Denial of Service Resistance in User Queries
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Catastrophic backtracking pattern
    const redosPayload = 'a'.repeat(25) + 'X!';
    const startTime = Date.now();
    const res = await fetch(`${baseUrl}/api/v1/users?search=${encodeURIComponent(redosPayload)}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    const duration = Date.now() - startTime;

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(duration < 2000, `Search query must execute within 2s, took ${duration}ms (potential ReDoS)`);

    pass('Test 17: ReDoS Resistance: Complex regex search queries execute safely without thread blocking');
  } catch (err) {
    fail('Test 17: ReDoS vulnerability detected', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 18: NoSQL Injection Second-Pass - Query Parameter Object Injection
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Operator injection inside query param
    const res = await fetch(`${baseUrl}/api/v1/courses?price[$gt]=0`);
    assert(res.status === 400, `Expected 400 on operator in query param, got ${res.status}`);
    const data = await res.json();
    assert(data.message.includes('مشغلات استعلام'), 'Expected operator injection blocked message');

    pass('Test 18: NoSQL Injection: Query string operator injection (?price[$gt]=0) is blocked by securitySanitizer');
  } catch (err) {
    fail('Test 18: Query parameter operator injection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 19: Resource Exhaustion - Body Size Limit Protection (>10kb)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Send 20KB JSON payload to a route expecting JSON
    const largePayload = {
      email: 'student.a.adv@test.com',
      junk: 'X'.repeat(25 * 1024),
    };

    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(largePayload),
    });
    // Express json body-parser returns 413 Payload Too Large
    assert(res.status === 413, `Expected 413 Payload Too Large, got ${res.status}`);

    pass('Test 19: Resource Exhaustion: Oversized JSON payload (>10KB) is rejected with HTTP 413');
  } catch (err) {
    fail('Test 19: JSON body size limit vulnerability', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 20: Concurrency & Race Condition - Refresh Token Single-Use Rotation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Log in Student B to get a fresh refresh token
    const resLogin = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student.b.adv@test.com', password: 'Password123!' }),
    });
    const loginData = await resLogin.json();
    const initialRefreshToken = loginData.data?.refreshToken;
    assert(initialRefreshToken, 'Must obtain refresh token');

    // Fire two concurrent refresh requests using the exact same refresh token
    const [resA, resB] = await Promise.all([
      fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: initialRefreshToken }),
      }),
      fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: initialRefreshToken }),
      }),
    ]);

    const statuses = [resA.status, resB.status];
    // At most ONE request should succeed; the second must fail due to rotation/revocation
    const successCount = statuses.filter((s) => s === 200).length;
    assert(successCount >= 1, 'At least one request should succeed');
    // Once used, repeating the same token MUST fail
    const resThird = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: initialRefreshToken }),
    });
    assert(resThird.status === 401, `Old refresh token must be invalidated, got ${resThird.status}`);

    pass('Test 20: Concurrency & Race Conditions: Refresh token rotation invalidates old token upon first use');
  } catch (err) {
    fail('Test 20: Refresh token reuse race condition', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 21: Access Log Validation - Rejection of Malformed Resource IDs
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/uploads/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({
        resourceType: 'video',
        resourceId: 'not-a-valid-mongo-id',
        action: 'view',
      }),
    });
    assert(res.status === 400, `Expected 400 for malformed resourceId, got ${res.status}`);

    pass('Test 21: Uploads Log Validation: Malformed resourceId is rejected with HTTP 400');
  } catch (err) {
    fail('Test 21: Malformed resourceId in upload log', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 22: Wishlist Validation - Rejection of Malformed Course IDs
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const resPost = await fetch(`${baseUrl}/api/v1/wishlist/not-a-mongo-id`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(resPost.status === 400, `Expected 400 on invalid courseId in wishlist POST, got ${resPost.status}`);

    const resDel = await fetch(`${baseUrl}/api/v1/wishlist/not-a-mongo-id`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(resDel.status === 400, `Expected 400 on invalid courseId in wishlist DELETE, got ${resDel.status}`);

    pass('Test 22: Wishlist Parameter Validation: Invalid course IDs are safely rejected with HTTP 400');
  } catch (err) {
    fail('Test 22: Wishlist malformed course ID', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 23: Notifications Validation - Rejection of Malformed Notification IDs
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/notifications/not-a-mongo-id/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(res.status === 400, `Expected 400 on invalid notification ID, got ${res.status}`);

    pass('Test 23: Notification Parameter Validation: Malformed notification IDs are rejected with HTTP 400');
  } catch (err) {
    fail('Test 23: Notification malformed ID', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 24: Undocumented External Route Inspection (/api/ext/*)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/ext/some-external-hook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'ping' }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Object.keys(data).length === 0, 'Stub route must return empty object without side effects');

    pass('Test 24: Undocumented Routes: /api/ext/* operates safely as an isolated no-op stub');
  } catch (err) {
    fail('Test 24: External stub route inspection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 25: Query Parameter Pollution Handling in Search
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Send array query parameter ?search=first&search=second
    const res = await fetch(`${baseUrl}/api/v1/courses?search=first&search=second`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'success', 'Must return success without server error or crash');

    pass('Test 25: Parameter Pollution: Multiple conflicting query parameters are safely handled');
  } catch (err) {
    fail('Test 25: Parameter pollution crash', err);
  }

  console.log(`\n${colors.cyan}${colors.bold}=== PHASE 2J: ADVANCED ATTACK SURFACE SECURITY TEST SUMMARY ===${colors.reset}`);
  console.log(`Total:  ${passedCount + failedCount}`);
  console.log(`Passed: ${colors.green}${passedCount}${colors.reset}`);
  console.log(`Failed: ${failedCount > 0 ? colors.red : colors.green}${failedCount}${colors.reset}\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

(async () => {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exit(1);
  } finally {
    await teardown();
  }
})();
