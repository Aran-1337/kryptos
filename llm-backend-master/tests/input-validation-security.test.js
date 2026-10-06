const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const TeamMember = require('../src/modules/team/team.model');
const Course = require('../src/modules/courses/course.model');
const Book = require('../src/modules/books/book.model');
const { generateAccessToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');

let mongoServer;
let server;
let baseUrl;

// Fixtures
let studentUser;
let instructorUser;
let adminUser;
let testCourse;
let testBook;
let studentToken;
let instructorToken;
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
  console.log(`${colors.cyan}${colors.bold}=== Setting up Input Validation & NoSQL Injection Security Test Environment ===${colors.reset}`);

  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB: ${uri}`);
  }

  await User.deleteMany({});
  await TeamMember.deleteMany({});
  await Course.deleteMany({});
  await Book.deleteMany({});

  // Seed Student
  studentUser = await User.create({
    firstName: 'Student',
    fatherName: 'Valid',
    lastName: 'One',
    email: 'student.input@test.com',
    phone: '01011119999',
    password: 'Password123!',
    role: 'student',
    grade: 'grade1',
    governorate: 'Cairo',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian One', relation: 'father', phone: '01011119998' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    isActive: true,
    enrolledCourses: [],
  });

  // Seed Instructor
  instructorUser = await User.create({
    firstName: 'Instructor',
    fatherName: 'Teacher',
    lastName: 'Prof',
    email: 'instructor.input@test.com',
    phone: '01022228888',
    password: 'Password123!',
    role: 'instructor',
    grade: 'grade1',
    governorate: 'Alexandria',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian Two', relation: 'father', phone: '01022228887' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    isActive: true,
  });

  // Seed Admin
  adminUser = await User.create({
    firstName: 'Admin',
    fatherName: 'System',
    lastName: 'Lead',
    email: 'admin.input@test.com',
    phone: '01033337777',
    password: 'Password123!',
    role: 'admin',
    grade: 'grade1',
    governorate: 'Giza',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian Admin', relation: 'father', phone: '01033337776' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    isActive: true,
  });

  // Seed Course
  testCourse = await Course.create({
    title: 'Input Security Course',
    slug: 'input-security-course',
    description: 'Defending Node.js applications against NoSQL injection and prototype pollution',
    instructor: instructorUser._id,
    grade: 'grade1',
    category: 'Cybersecurity',
    subject: 'Security',
    price: 200,
    isPublished: true,
    totalStudents: 0,
  });

  // Seed Book
  testBook = await Book.create({
    title: 'NoSQL Defense Handbook',
    description: 'Best practices for securing MongoDB queries.',
    instructor: instructorUser._id,
    author: 'Sec Team',
    category: 'Security',
    grade: 'grade1',
    subject: 'Cybersecurity',
    price: 80,
    isPublished: true,
  });

  studentToken = generateAccessToken(studentUser);
  instructorToken = generateAccessToken(instructorUser);
  adminToken = generateAccessToken(adminUser);

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      console.log(`Test server running at: ${baseUrl}`);
      resolve();
    });
  });
}

async function teardown() {
  console.log(`\n${colors.cyan}${colors.bold}=== Tearing down test environment ===${colors.reset}`);
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

function clearAllRateLimits() {
  const ips = ['::1', '127.0.0.1', '::ffff:127.0.0.1'];
  for (const ip of ips) {
    resetAllLimiters(ip);
  }
  if (studentUser) resetAllLimiters(`user_${studentUser._id}`);
  if (instructorUser) resetAllLimiters(`user_${instructorUser._id}`);
  if (adminUser) resetAllLimiters(`user_${adminUser._id}`);
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (!condition) {
      console.error(`  ${colors.red}✗ FAIL: ${message}${colors.reset}`);
      failed++;
      throw new Error(message);
    }
  }

  function pass(message) {
    console.log(`  ${colors.green}✓ PASS: ${message}${colors.reset}`);
    passed++;
  }

  console.log(`\n${colors.yellow}${colors.bold}=== RUNNING INPUT VALIDATION & NOSQL INJECTION SECURITY SUITE ===${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // Test 1: NoSQL operator injection in auth login
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: { $ne: null }, password: { $ne: null } }),
    });

    assert(res.status === 400, `Expected 400 on NoSQL operator injection in login, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'fail', 'Expected fail status');
    pass('Test 1: NoSQL operator injection payload in login is rejected with HTTP 400');
  } catch (err) {
    console.error('Test 1 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 2: Nested operator injection
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/auth/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: { nested: { deep: { $where: 'sleep(5000)' } } },
      }),
    });

    assert(res.status === 400, `Expected 400 on nested operator injection, got ${res.status}`);
    pass('Test 2: Deeply nested operator injection payload is rejected with HTTP 400');
  } catch (err) {
    console.error('Test 2 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 3: Role escalation through body (Registration & Team Invite)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Attempt to register with role: 'admin'
    const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Hacker',
        fatherName: 'Escalate',
        lastName: 'Role',
        email: 'hacker.role@test.com',
        phone: '01099990001',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        grade: 'grade1',
        governorate: 'Cairo',
        educationType: 'arabic',
        gender: 'male',
        guardian: { fullName: 'Hacker Parent', relation: 'father', phone: '01099990002' },
        acceptTerms: 'true',
        acceptPrivacy: 'true',
        role: 'admin', // Attack: Role escalation
      }),
    });

    assert(regRes.status === 201, `Registration should succeed but ignore role, got ${regRes.status}`);
    const regData = await regRes.json();
    assert(regData.data.user.role === 'student', `Role must remain student, got ${regData.data.user.role}`);
    
    // Check in database directly
    const createdUser = await User.findOne({ email: 'hacker.role@test.com' });
    assert(createdUser.role === 'student', `DB role must be student, got ${createdUser.role}`);
    pass('Test 3: Role escalation payload in registration body is safely neutralized (role defaults to student)');
  } catch (err) {
    console.error('Test 3 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 4: Permission escalation in team invite
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/team/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Evil Assistant',
        email: 'evil.assistant@test.com',
        role: 'superadmin', // Attack
        permissions: ['courses', 'root_super_admin_exploit'], // Attack: invalid permission
      }),
    });

    assert(res.status === 400, `Expected 400 on permission escalation in team invite, got ${res.status}`);
    pass('Test 4: Permission escalation and role tampering in team invite are rejected with HTTP 400');
  } catch (err) {
    console.error('Test 4 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 5: isAdmin manipulation in profile update
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        firstName: 'UpdatedStudent',
        isAdmin: true, // Attack
        role: 'admin', // Attack
      }),
    });

    assert(res.status === 400, `Expected 400 when attempting isAdmin/role manipulation, got ${res.status}`);
    pass('Test 5: isAdmin and role manipulation via profile update is blocked with HTTP 400');
  } catch (err) {
    console.error('Test 5 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 6: owner / instructor manipulation in course creation and update
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // 6a: Create course with spoofed instructor
    const createRes = await fetch(`${baseUrl}/api/v1/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${instructorToken}`,
      },
      body: JSON.stringify({
        title: 'Owned By Legit Instructor',
        description: 'Testing owner binding',
        category: 'Tech',
        price: 100,
        instructor: studentUser._id.toString(), // Attack: spoofed owner
      }),
    });

    assert(createRes.status === 201, `Course creation should succeed, got ${createRes.status}`);
    const createdData = await createRes.json();
    assert(
      createdData.data.course.instructor.toString() === instructorUser._id.toString(),
      'Instructor must be bound to authenticated caller'
    );

    // 6b: Update course to steal ownership
    const updateRes = await fetch(`${baseUrl}/api/v1/courses/${testCourse._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${instructorToken}`,
      },
      body: JSON.stringify({
        instructor: studentUser._id.toString(), // Attack: transfer ownership
      }),
    });

    assert(updateRes.status === 400, `Expected 400 when attempting to update course instructor, got ${updateRes.status}`);
    pass('Test 6: owner/instructor manipulation in course create/update is strictly prevented (400 on update, bound on create)');
  } catch (err) {
    console.error('Test 6 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 7: Payment amount manipulation in order creation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        items: [{ courseId: testCourse._id }],
        totalAmount: 0.01, // Attack: Client attempts to force 1 cent
        price: 0, // Attack
      }),
    });

    assert(res.status === 201, `Order should create, got ${res.status}`);
    const data = await res.json();
    // Course price is 200
    assert(data.data.order.totalAmount === 200, `Order totalAmount must be computed server-side (200), got ${data.data.order.totalAmount}`);
    pass('Test 7: Payment amount manipulation is prevented; totalAmount strictly computed server-side');
  } catch (err) {
    console.error('Test 7 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 8: Payment status manipulation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        items: [{ courseId: testCourse._id }],
        status: 'completed', // Attack: Client attempts to mark order paid immediately
      }),
    });

    assert(res.status === 201, `Order should create, got ${res.status}`);
    const data = await res.json();
    assert(data.data.order.status === 'pending', `Order status must remain pending, got ${data.data.order.status}`);
    pass('Test 8: Payment status manipulation is prevented; status cannot be self-marked completed');
  } catch (err) {
    console.error('Test 8 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 9: Invalid ObjectId rejected with HTTP 400
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/courses/not-a-valid-mongo-id`);
    assert(res.status === 400, `Expected 400 on invalid ObjectId in course GET, got ${res.status}`);
    pass('Test 9: Invalid ObjectId in route parameter is safely rejected with HTTP 400');
  } catch (err) {
    console.error('Test 9 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 10: ObjectId CastError does not leak stack trace or internal error
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/courses/12345678901234567890123z`);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'fail', 'Expected fail status');
    assert(data.stack === undefined, 'Must not leak stack trace');
    pass('Test 10: Malformed ObjectId rejection contains no stack traces or CastError leakage');
  } catch (err) {
    console.error('Test 10 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 11: Malicious sort field falls back safely without executing operators
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/courses?sort=$where`);
    assert(res.status === 200, `Expected 200 with safe fallback sort, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'success', 'Expected success status');
    pass('Test 11: Malicious sort field ($where) is safely ignored and falls back to default sort');
  } catch (err) {
    console.error('Test 11 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 12: Malicious search input containing operators
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/courses?search[$gt]=`);
    assert(res.status === 400, `Expected 400 on operator in search query, got ${res.status}`);
    pass('Test 12: Operator injection inside search parameter query is blocked with HTTP 400');
  } catch (err) {
    console.error('Test 12 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 13: Regex abuse / ReDoS patterns in user search
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Vulnerable patterns with unclosed brackets, wildcards, catastrophic backtracking
    const dangerousPatterns = [
      '.*',
      '(unclosed[bracket',
      '(((((([a-z]+)+)+)+)+)+)',
      '\\',
      '^$$$$***',
    ];

    for (const pat of dangerousPatterns) {
      const res = await fetch(`${baseUrl}/api/v1/users?search=${encodeURIComponent(pat)}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, `Expected 200 on escaped search pattern "${pat}", got ${res.status}`);
    }
    pass('Test 13: Dangerous regex patterns and ReDoS payloads in search query are cleanly escaped');
  } catch (err) {
    console.error('Test 13 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 14: Prototype pollution keys (__proto__, constructor, prototype)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const payloads = [
      JSON.stringify({ email: 'proto@test.com', __proto__: { isAdmin: true } }),
      JSON.stringify({ email: 'proto@test.com', constructor: { prototype: { isAdmin: true } } }),
      JSON.stringify({ email: 'proto@test.com', prototype: { isAdmin: true } }),
    ];

    for (const p of payloads) {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: p,
      });
      assert(res.status === 400, `Expected 400 on prototype pollution attempt, got ${res.status}`);
    }

    // Verify global Object.prototype was NOT polluted
    const checkObj = {};
    assert(checkObj.isAdmin === undefined, 'Global prototype must never be polluted');
    pass('Test 14: Prototype pollution keys (__proto__, constructor, prototype) are strictly rejected with HTTP 400');
  } catch (err) {
    console.error('Test 14 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 15: Unknown sensitive fields on profile update
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        firstName: 'ValidName',
        isBanned: false, // Attack
        balance: 99999, // Attack
        permissions: ['admin'], // Attack
      }),
    });

    assert(res.status === 400, `Expected 400 on unknown sensitive fields, got ${res.status}`);
    pass('Test 15: Unknown sensitive fields in profile update are rejected (400 Bad Request)');
  } catch (err) {
    console.error('Test 15 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 16: Wrong primitive/object types (Type Confusion)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Pass boolean for password, object for email
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: true, // Type confusion
        password: 12345, // Type confusion
      }),
    });

    assert(res.status === 400, `Expected 400 on type confusion primitives, got ${res.status}`);
    pass('Test 16: Type confusion primitives (boolean/number where string expected) return HTTP 400');
  } catch (err) {
    console.error('Test 16 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 17: Wrong array/object types
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Send string where array is expected in order items
    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        items: 'not-an-array-exploit',
      }),
    });

    assert(res.status === 400, `Expected 400 on string where array expected, got ${res.status}`);
    pass('Test 17: Wrong array/object data types are rejected with HTTP 400 Bad Request');
  } catch (err) {
    console.error('Test 17 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 18: Legitimate valid requests still work properly
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // 18a: Course details
    const courseRes = await fetch(`${baseUrl}/api/v1/courses/${testCourse._id}`);
    assert(courseRes.status === 200, `Expected 200 on legitimate course get, got ${courseRes.status}`);

    // 18b: User profile
    const profileRes = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(profileRes.status === 200, `Expected 200 on legitimate profile get, got ${profileRes.status}`);

    // 18c: Legitimate course catalog browsing
    const catalogRes = await fetch(`${baseUrl}/api/v1/courses?category=Cybersecurity&page=1&limit=10`);
    assert(catalogRes.status === 200, `Expected 200 on catalog browsing, got ${catalogRes.status}`);

    // 18d: Legitimate login
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentUser.email, password: 'Password123!' }),
    });
    assert(loginRes.status === 200, `Expected 200 on legitimate login, got ${loginRes.status}`);
    pass('Test 18: Legitimate valid requests execute successfully across all APIs without false positives');
  } catch (err) {
    console.error('Test 18 error:', err.message);
  }

  console.log(`\n${colors.bold}=== INPUT VALIDATION & NOSQL INJECTION TEST SUMMARY ===${colors.reset}`);
  console.log(`Total:  ${passed + failed}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

async function main() {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error(`${colors.red}Test runner error: ${err.message}${colors.reset}`);
    process.exit(1);
  } finally {
    await teardown();
  }
}

main();
