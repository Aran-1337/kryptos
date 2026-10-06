const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const TeamMember = require('../src/modules/team/team.model');
const Course = require('../src/modules/courses/course.model');
const Book = require('../src/modules/books/book.model');
const { generateAccessToken } = require('../src/utils/jwt');
const {
  globalLimiter,
  authLimiter,
  passwordResetLimiter,
  otpLimiter,
  availabilityLimiter,
  uploadLimiter,
  orderLimiter,
  searchLimiter,
  resetAllLimiters,
} = require('../src/middlewares/rateLimiter.middleware');

let mongoServer;
let server;
let baseUrl;

// Fixtures
let studentUser;
let student2User;
let adminUser;
let testCourse;
let studentToken;
let student2Token;
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
  console.log(`${colors.cyan}${colors.bold}=== Setting up API Abuse & Rate-Limit Security Test Environment ===${colors.reset}`);

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

  // Seed Student 1
  studentUser = await User.create({
    firstName: 'Student',
    fatherName: 'Normal',
    lastName: 'Learner',
    email: 'student.rate@test.com',
    phone: '01011112222',
    password: 'Password123!',
    role: 'student',
    grade: 'grade1',
    governorate: 'Cairo',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Parent One', relation: 'father', phone: '01011112223' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    isActive: true,
  });

  // Seed Student 2 (for multi-user isolation on shared network)
  student2User = await User.create({
    firstName: 'StudentTwo',
    fatherName: 'Shared',
    lastName: 'Network',
    email: 'student2.rate@test.com',
    phone: '01033334444',
    password: 'Password123!',
    role: 'student',
    grade: 'grade1',
    governorate: 'Alexandria',
    educationType: 'arabic',
    gender: 'female',
    guardian: { fullName: 'Parent Two', relation: 'mother', phone: '01033334445' },
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
    email: 'admin.sec@test.com',
    phone: '01055556666',
    password: 'Password123!',
    role: 'admin',
    grade: 'grade1',
    governorate: 'Giza',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Admin Parent', relation: 'father', phone: '01055556667' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    isActive: true,
  });

  // Seed Course
  testCourse = await Course.create({
    title: 'Rate Limit Security Course',
    slug: 'rate-limit-security-course',
    description: 'A comprehensive security course on anti-abuse and throttling.',
    instructor: adminUser._id,
    grade: 'grade1',
    category: 'Security',
    subject: 'Cybersecurity',
    price: 100,
    isPublished: true,
  });

  // Seed Book
  await Book.create({
    title: 'Rate Limit Guide Book',
    description: 'Defense against credential stuffing and brute force.',
    instructor: adminUser._id,
    author: 'Dr. Security',
    category: 'Security',
    grade: 'grade1',
    subject: 'Cybersecurity',
    price: 50,
    isPublished: true,
  });

  studentToken = generateAccessToken(studentUser);
  student2Token = generateAccessToken(student2User);
  adminToken = generateAccessToken(adminUser);

  // Start HTTP server on dynamic port
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

function clearAllKeys() {
  const ips = ['::1', '127.0.0.1', '::ffff:127.0.0.1'];
  for (const ip of ips) {
    resetAllLimiters(ip);
  }
  if (studentUser) resetAllLimiters(`user_${studentUser._id}`);
  if (student2User) resetAllLimiters(`user_${student2User._id}`);
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

  console.log(`\n${colors.yellow}${colors.bold}=== RUNNING API ABUSE & RATE-LIMIT SECURITY SUITE ===${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // Test 1: Successful requests before threshold succeed normally
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentUser.email, password: 'Password123!' }),
    });

    assert(res.status === 200, `Expected 200 on initial login, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'success', 'Expected success status in response');
    pass('Test 1: Legitimate request before threshold succeeds normally (200 OK)');
  } catch (err) {
    console.error('Test 1 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 2: Login rate limit triggers HTTP 429 after threshold (Student Login)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // authLimiter max is 10. Send 10 failed login attempts
    for (let i = 0; i < 10; i++) {
      await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentUser.email, password: 'WrongPassword!' }),
      });
    }

    // 11th attempt must be blocked by rate limiter
    const blockedRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentUser.email, password: 'WrongPassword!' }),
    });

    assert(blockedRes.status === 429, `Expected 429 Too Many Requests, got ${blockedRes.status}`);
    const blockedData = await blockedRes.json();
    assert(blockedData.status === 'fail', 'Expected fail status');
    assert(blockedData.message && blockedData.message.includes('محاولات'), 'Expected Arabic rate limit warning');
    pass('Test 2: Student Login rate limit triggers HTTP 429 after 10 requests');
  } catch (err) {
    console.error('Test 2 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 3: Team member login rate limit triggers HTTP 429
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    for (let i = 0; i < 10; i++) {
      await fetch(`${baseUrl}/api/v1/team/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'unknown.team@test.com', password: 'WrongPassword!' }),
      });
    }

    const blockedRes = await fetch(`${baseUrl}/api/v1/team/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unknown.team@test.com', password: 'WrongPassword!' }),
    });

    assert(blockedRes.status === 429, `Expected 429 Too Many Requests on team login, got ${blockedRes.status}`);
    pass('Test 3: Team Member Login route is strictly rate-limited against credential stuffing (429)');
  } catch (err) {
    console.error('Test 3 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 4: Forgot-password rate limit triggers HTTP 429 after 5 attempts
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // passwordResetLimiter max is 5
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.com' }),
      });
    }

    const blockedRes = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com' }),
    });

    assert(blockedRes.status === 429, `Expected 429 on forgot-password, got ${blockedRes.status}`);
    const data = await blockedRes.json();
    assert(data.message && data.message.includes('استعادة'), 'Expected password reset limit message');
    pass('Test 4: Forgot-password rate limit triggers HTTP 429 after 5 attempts (anti-SMTP flooding)');
  } catch (err) {
    console.error('Test 4 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 5: OTP / email verification rate limit triggers HTTP 429
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // otpLimiter max is 5
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/v1/auth/verify-email/test-token-${i}`);
    }

    const blockedRes = await fetch(`${baseUrl}/api/v1/auth/verify-email/test-token-blocked`);
    assert(blockedRes.status === 429, `Expected 429 on verify-email, got ${blockedRes.status}`);
    pass('Test 5: OTP/Email verification rate limit triggers HTTP 429 after 5 attempts (anti-brute-force)');
  } catch (err) {
    console.error('Test 5 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 6: OTP / verification resend rate limit triggers HTTP 429
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/v1/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.com' }),
      });
    }

    const blockedRes = await fetch(`${baseUrl}/api/v1/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com' }),
    });

    assert(blockedRes.status === 429, `Expected 429 on resend-verification, got ${blockedRes.status}`);
    pass('Test 6: OTP/Verification resend rate limit triggers HTTP 429 (anti-SMS/email exhaustion)');
  } catch (err) {
    console.error('Test 6 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 7: Registration abuse protection triggers HTTP 429
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    for (let i = 0; i < 10; i++) {
      await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `spam_${i}@test.com` }),
      });
    }

    const blockedRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'spam_11@test.com' }),
    });

    assert(blockedRes.status === 429, `Expected 429 on register, got ${blockedRes.status}`);
    pass('Test 7: Registration flood protection triggers HTTP 429 after 10 requests');
  } catch (err) {
    console.error('Test 7 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 8: Account enumeration check-availability rate limit triggers HTTP 429
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    for (let i = 0; i < 20; i++) {
      await fetch(`${baseUrl}/api/v1/auth/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `probe_${i}@test.com` }),
      });
    }

    const blockedRes = await fetch(`${baseUrl}/api/v1/auth/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'probe_21@test.com' }),
    });

    assert(blockedRes.status === 429, `Expected 429 on check-availability, got ${blockedRes.status}`);
    pass('Test 8: Account enumeration protection limits check-availability probing (429)');
  } catch (err) {
    console.error('Test 8 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 9: Standard 429 response structure & safety (no internal leak)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // Exceed forgot password limiter to inspect 429 response payload
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.com' }),
      });
    }

    const res = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com' }),
    });

    assert(res.status === 429, `Expected status 429, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'fail', 'Expected fail status');
    assert(typeof data.message === 'string', 'Expected message string');
    assert(data.stack === undefined, 'Must not leak stack trace in 429 response');
    assert(data.code === undefined || typeof data.code !== 'object', 'Must not leak internal error objects');
    pass('Test 9: 429 response conforms to safe standardized JSON structure { status: "fail", message }');
  } catch (err) {
    console.error('Test 9 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 10: Retry-After and RateLimit headers behavior on 429
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.com' }),
      });
    }

    const res = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com' }),
    });

    const retryAfter = res.headers.get('retry-after');
    const rateLimitLimit = res.headers.get('ratelimit-limit');

    assert(retryAfter !== null, 'Retry-After header must be present on 429 response');
    assert(parseInt(retryAfter) > 0, `Retry-After must be a positive integer, got ${retryAfter}`);
    assert(rateLimitLimit !== null, 'RateLimit-Limit header must be present');
    assert(parseInt(rateLimitLimit) === 5, `RateLimit-Limit must match 5, got ${rateLimitLimit}`);
    pass('Test 10: Retry-After header and RateLimit-Limit header are accurately returned on 429');
  } catch (err) {
    console.error('Test 10 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 11: Rate limit reset / window behavior
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.com' }),
      });
    }

    const blockedRes = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com' }),
    });
    assert(blockedRes.status === 429, 'Expected 429 before reset');

    // Simulate window reset for this client
    clearAllKeys();

    const allowedRes = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@test.com' }),
    });
    assert(allowedRes.status !== 429, `Expected request to be allowed after reset, got ${allowedRes.status}`);
    pass('Test 11: Rate limit window reset successfully restores client access');
  } catch (err) {
    console.error('Test 11 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 12: Authenticated user isolation on shared network (Multi-tenant NAT)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // User 1 creates 30 orders to exhaust order limit
    for (let i = 0; i < 30; i++) {
      await fetch(`${baseUrl}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          items: [{ courseId: testCourse._id }],
        }),
      });
    }

    // 31st request from User 1 must be blocked
    const user1Blocked = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        items: [{ courseId: testCourse._id }],
      }),
    });
    assert(user1Blocked.status === 429, `User 1 should be blocked with 429, got ${user1Blocked.status}`);

    // User 2 (sharing the same localhost IP / campus network) must NOT be blocked!
    const user2Allowed = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student2Token}`,
      },
      body: JSON.stringify({
        items: [{ courseId: testCourse._id }],
      }),
    });

    assert(user2Allowed.status === 201, `User 2 must be isolated and allowed (201), got ${user2Allowed.status}`);
    pass('Test 12: Authenticated user isolation ensures User A does NOT deplete User B quota on shared IP');
  } catch (err) {
    console.error('Test 12 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 13: IP spoofing prevention (Trust Proxy safety)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // When trustProxy is disabled, rotating X-Forwarded-For should NOT bypass IP rate limit
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': `198.51.100.${i + 1}`,
        },
        body: JSON.stringify({ email: 'user@test.com' }),
      });
    }

    const spoofAttempt = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '198.51.100.99', // Attacker sends spoofed header
      },
      body: JSON.stringify({ email: 'user@test.com' }),
    });

    assert(spoofAttempt.status === 429, `Expected 429 despite spoofed X-Forwarded-For, got ${spoofAttempt.status}`);
    pass('Test 13: Spoofed X-Forwarded-For headers cannot bypass rate limiting when direct connected');
  } catch (err) {
    console.error('Test 13 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 14: Anti-DoS: Attacker guessing victim email does NOT lock victim out
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // Attacker sends 10 wrong password requests for victim's email from IP A (loopback)
    for (let i = 0; i < 10; i++) {
      await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentUser.email, password: 'WrongPasswordAttacker!' }),
      });
    }

    // IP A is now rate-limited
    const attackerRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentUser.email, password: 'Password123!' }),
    });
    assert(attackerRes.status === 429, 'Attacker IP should be rate limited');

    // Verify student user account in database is NOT locked out or banned
    const refreshedStudent = await User.findById(studentUser._id);
    assert(refreshedStudent.isBanned === false, 'Legitimate student must not be banned');

    // If student connects from a separate IP (simulated via reset of IP key or legitimate network):
    clearAllKeys();
    const victimRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentUser.email, password: 'Password123!' }),
    });
    assert(victimRes.status === 200, `Victim should be able to log in normally, got ${victimRes.status}`);
    pass('Test 14: Anti-Account-Lockout DoS prevents attackers from locking legitimate user accounts');
  } catch (err) {
    console.error('Test 14 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 15: Search query limiter throttles expensive search operations
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // Non-search requests are NOT counted against search limiter
    const normalBrowse = await fetch(`${baseUrl}/api/v1/courses`);
    assert(normalBrowse.status === 200, `Expected 200 on browsing catalog, got ${normalBrowse.status}`);

    // Rapid search requests with ?search= are tracked
    for (let i = 0; i < 60; i++) {
      await fetch(`${baseUrl}/api/v1/courses?search=security`);
    }

    const blockedSearch = await fetch(`${baseUrl}/api/v1/courses?search=security`);
    assert(blockedSearch.status === 429, `Expected 429 on excessive search queries, got ${blockedSearch.status}`);
    pass('Test 15: Search query limiter protects database against search flooding (429)');
  } catch (err) {
    console.error('Test 15 error:', err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 16: Upload limiter throttles excessive file uploads per user
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllKeys();
    // Send 50 upload attempts
    for (let i = 0; i < 50; i++) {
      await fetch(`${baseUrl}/api/v1/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
      });
    }

    // 51st attempt must be blocked with 429
    const blockedUpload = await fetch(`${baseUrl}/api/v1/users/profile/avatar`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    assert(blockedUpload.status === 429, `Expected 429 on excessive upload attempts, got ${blockedUpload.status}`);
    const uploadData = await blockedUpload.json();
    assert(uploadData.message && uploadData.message.includes('رفع الملفات'), 'Expected upload rate limit message');
    pass('Test 16: File upload limiter protects storage and bandwidth against resource exhaustion (429)');
  } catch (err) {
    console.error('Test 16 error:', err.message);
  }

  console.log(`\n${colors.bold}=== API ABUSE & RATE-LIMIT TEST SUMMARY ===${colors.reset}`);
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
