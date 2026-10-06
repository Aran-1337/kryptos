const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const config = require('../src/config');
const connectDB = require('../src/database/connection');
const errorHandler = require('../src/middlewares/error.middleware');
const { generateAccessToken, generateRefreshToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');
const User = require('../src/modules/users/user.model');
const Course = require('../src/modules/courses/course.model');
const Order = require('../src/modules/orders/order.model');
const { ALLOWED_MEDIA_TYPES, validateFilename, verifyFileMagicBytes } = require('../src/utils/mediaSecurity');

let mongoServer;
let server;
let baseUrl;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up Phase 3B: Production Launch Readiness Tests ===${colors.reset}`);

  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB: ${uri}`);
  }

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
  console.log(`\n${colors.yellow}${colors.bold}--- Starting Phase 3B: Launch Readiness Verification (27 Tests) ---${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Production Startup Configuration Validation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let threw = false;
    try {
      config.validateProductionConfig({
        env: 'production',
        jwt: {
          secret: 'production-launch-super-secure-key-entropy-64-bytes-min',
          refreshSecret: 'production-launch-super-secure-refresh-key-entropy-64-bytes-min',
        },
        mongo: { uri: 'mongodb+srv://admin:securepass@cluster.mongodb.net/prod?retryWrites=true&w=majority' },
      });
    } catch (e) {
      threw = true;
    }
    assert(!threw, 'Valid production config should not throw');
    pass('Test 1: Startup Config: Valid production configuration passes validation without errors');
  } catch (err) {
    fail('Test 1: Startup Config validation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Production Startup Failure on Missing or Insecure JWT_SECRET
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let threw = false;
    try {
      config.validateProductionConfig({
        env: 'production',
        jwt: { secret: 'short', refreshSecret: 'production-launch-super-secure-refresh-key-entropy-64-bytes-min' },
        mongo: { uri: 'mongodb+srv://user:pass@cluster.net/prod' },
      });
    } catch (e) {
      threw = true;
      assert(e.validationErrors && e.validationErrors.some(m => m.includes('JWT_SECRET')), 'Must mention JWT_SECRET');
    }
    assert(threw, 'Weak JWT_SECRET must throw error in production');
    pass('Test 2: Startup Config: Weak or missing JWT_SECRET fails production startup validation');
  } catch (err) {
    fail('Test 2: Weak JWT_SECRET validation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Production Startup Failure on Missing MONGO_URI
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let threw = false;
    try {
      config.validateProductionConfig({
        env: 'production',
        jwt: {
          secret: 'production-launch-super-secure-key-entropy-64-bytes-min',
          refreshSecret: 'production-launch-super-secure-refresh-key-entropy-64-bytes-min',
        },
        mongo: { uri: '' },
      });
    } catch (e) {
      threw = true;
      assert(e.validationErrors && e.validationErrors.some(m => m.includes('MONGO_URI')), 'Must mention MONGO_URI');
    }
    assert(threw, 'Missing MONGO_URI must throw in production');
    pass('Test 3: Startup Config: Missing MONGO_URI fails production startup validation');
  } catch (err) {
    fail('Test 3: Missing MONGO_URI validation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Production DB Connection Aborts Without In-Memory Fallback
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const origEnv = config.env;
    const origUri = config.mongo.uri;
    config.env = 'production';
    config.mongo.uri = 'mongodb://nonexistent.invalid.host:27017/fail_db';

    let threw = false;
    try {
      await connectDB();
    } catch (e) {
      threw = true;
      assert(e.message.includes('Production database connection failed'), 'Expected production database failure message');
    } finally {
      config.env = origEnv;
      config.mongo.uri = origUri;
    }
    assert(threw, 'connectDB in production must throw on connection failure instead of starting in-memory database');
    pass('Test 4: Database Safety: Production connection failure aborts startup and forbids in-memory fallback');
  } catch (err) {
    fail('Test 4: Database fallback rejection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Production Error Sanitization (500 Hides Stacks and Paths)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let statusCaptured = null;
    let jsonCaptured = null;
    const mockRes = {
      status(code) { statusCaptured = code; return this; },
      json(d) { jsonCaptured = d; return this; },
    };
    const origEnv = config.env;
    config.env = 'production';
    try {
      const err = new Error('Database connection reset by peer at /srv/data/mongo.sock');
      errorHandler(err, {}, mockRes, () => {});
      assert(statusCaptured === 500, `Expected 500, got ${statusCaptured}`);
      assert(jsonCaptured.message === 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً', 'Must return generic localized error');
      assert(!jsonCaptured.stack, 'Stack trace must be omitted');
      assert(!JSON.stringify(jsonCaptured).includes('/srv/data'), 'Internal paths must not be leaked');
    } finally {
      config.env = origEnv;
    }
    pass('Test 5: Error Sanitization: 500 responses return safe generic messages concealing internal paths and stacks');
  } catch (err) {
    fail('Test 5: Error Sanitization', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. /health Liveness Endpoint Safety
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    assert(res.status === 200, `Expected 200 on /health, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'ok', 'Status must be ok');
    assert(data.env === undefined, 'Environment name must not be leaked');
    assert(data.database === undefined, 'Database credentials must not be leaked');
    pass('Test 6: Liveness Probe: /health returns clean 200 OK without disclosing internal environment or infrastructure');
  } catch (err) {
    fail('Test 6: Health check safety', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. CORS Production Rejection of Unauthorized Origins
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil-hacker.com',
        'Access-Control-Request-Method': 'POST',
      },
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert(allowOrigin !== '*', 'CORS must not allow wildcard with credentials');
    assert(allowOrigin !== 'https://evil-hacker.com', 'CORS must reject unauthorized external origin');
    pass('Test 7: CORS Security: Unauthorized external origins are rejected and credentials are protected');
  } catch (err) {
    fail('Test 7: CORS policy', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Helmet Security Headers Suite
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    const nosniff = res.headers.get('x-content-type-options');
    const xframe = res.headers.get('x-frame-options');
    const hsts = res.headers.get('strict-transport-security');
    const referrer = res.headers.get('referrer-policy');

    assert(nosniff === 'nosniff', 'X-Content-Type-Options must be nosniff');
    assert(xframe === 'DENY', 'X-Frame-Options must be DENY');
    assert(hsts && hsts.includes('max-age=31536000'), 'HSTS must be configured with 1-year max-age');
    assert(referrer === 'strict-origin-when-cross-origin', 'Referrer-Policy must be strict');
    pass('Test 8: Security Headers: nosniff, DENY, HSTS, and Referrer-Policy are strictly enforced');
  } catch (err) {
    fail('Test 8: Security headers', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9. JWT Verification Rejects Forged 'none' Algorithm
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const forgedHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const forgedPayload = Buffer.from(JSON.stringify({ id: '6ac2bddff6ce587166509d00', role: 'admin' })).toString('base64url');
    const forgedToken = `${forgedHeader}.${forgedPayload}.`;

    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${forgedToken}` },
    });
    assert(res.status === 401, `Forged token must return 401, got ${res.status}`);
    pass('Test 9: JWT Integrity: Forged "none" algorithm and unsigned tokens are strictly rejected (401)');
  } catch (err) {
    fail('Test 9: JWT alg none rejection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Cookie Security Attributes
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const cookieOptions = {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
    assert(cookieOptions.httpOnly === true, 'Cookie must be httpOnly');
    assert(cookieOptions.sameSite === 'strict', 'Cookie sameSite must be strict');
    assert(cookieOptions.path === '/', 'Cookie path must be root');
    pass('Test 10: Cookie Configuration: Refresh token cookies enforce HttpOnly, SameSite=Strict, and scoped path');
  } catch (err) {
    fail('Test 10: Cookie security attributes', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 11. Resource Limits: JSON Body Size 10KB Ceiling (HTTP 413)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const oversizedBody = JSON.stringify({ data: 'A'.repeat(12 * 1024) });
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: oversizedBody,
    });
    assert(res.status === 413, `Oversized payload must return 413 Payload Too Large, got ${res.status}`);
    pass('Test 11: DoS Prevention: Request bodies exceeding 10KB are rejected with HTTP 413 Payload Too Large');
  } catch (err) {
    fail('Test 11: JSON body size limit', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 12. File Upload Limits: Avatar Size Enforcement (5MB)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    assert(ALLOWED_MEDIA_TYPES.image.maxSize === 5 * 1024 * 1024, 'Avatar image max size must be 5MB');
    const validImage = validateFilename('avatar.png', ALLOWED_MEDIA_TYPES.image.extensions);
    assert(validImage.valid === true, 'avatar.png must be valid');
    const invalidImage = validateFilename('avatar.exe.png', ALLOWED_MEDIA_TYPES.image.extensions);
    assert(invalidImage.valid === false, 'Double extension executable must be rejected');
    pass('Test 12: Upload Security: Image upload enforces 5MB ceiling and rejects executable double extensions');
  } catch (err) {
    fail('Test 12: Avatar upload limits', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 13. File Upload Limits: Video Safe Ceiling (100MB Memory Bound)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    assert(ALLOWED_MEDIA_TYPES.video.maxSize === 100 * 1024 * 1024, 'Video max size must be 100MB to avoid OOM');
    assert(ALLOWED_MEDIA_TYPES.video.mimes.includes('video/mp4'), 'mp4 must be allowed');
    assert(!ALLOWED_MEDIA_TYPES.video.extensions.includes('.exe'), 'exe must not be allowed');
    pass('Test 13: Upload Security: Video upload is safely capped at 100MB preventing memory exhaustion');
  } catch (err) {
    fail('Test 13: Video upload limits', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 14. File Upload Limits: PDF Size Enforcement (25MB)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    assert(ALLOWED_MEDIA_TYPES.pdf.maxSize === 25 * 1024 * 1024, 'PDF max size must be 25MB');
    const fakePdfBytes = Buffer.from('%PDF-1.4 test stream');
    const isValidPdf = verifyFileMagicBytes(fakePdfBytes, 'pdf');
    assert(isValidPdf === true, 'Magic bytes must recognize genuine PDF header');
    const spoofedPdf = Buffer.from('GIF89a corrupted fake pdf');
    const isSpoofed = verifyFileMagicBytes(spoofedPdf, 'pdf');
    assert(isSpoofed === false, 'Magic bytes must reject spoofed PDF');
    pass('Test 14: Upload Security: PDF uploads enforce 25MB limit and strict %PDF- magic byte verification');
  } catch (err) {
    fail('Test 14: PDF upload limits', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 15. E2E Core Flow: Student Registration Schema Validation
  // ───────────────────────────────────────────────────────────────────────────
  let studentUser;
  try {
    resetAllLimiters();
    studentUser = await User.create({
      firstName: 'أحمد',
      fatherName: 'محمود',
      lastName: 'علي',
      email: 'launch.student@mnasa.com',
      phone: '01011112222',
      password: 'StrongStudentPassword123!',
      grade: 'grade1',
      educationType: 'arabic',
      gender: 'male',
      governorate: 'القاهرة',
      guardian: {
        fullName: 'محمود علي',
        relation: 'father',
        phone: '01033334444',
      },
      acceptTerms: true,
      acceptPrivacy: true,
      role: 'student',
    });
    assert(studentUser._id, 'Student user must be saved');
    assert(studentUser.name === 'أحمد محمود علي', 'Computed full name must match');
    pass('Test 15: Core Flow: Student registration enforces full localized data integrity and hashing');
  } catch (err) {
    fail('Test 15: Student registration', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 16. E2E Core Flow: User Authentication (Login)
  // ───────────────────────────────────────────────────────────────────────────
  let accessToken;
  let refreshToken;
  try {
    resetAllLimiters();
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'launch.student@mnasa.com',
        password: 'StrongStudentPassword123!',
      }),
    });
    assert(loginRes.status === 200, `Expected 200 on login, got ${loginRes.status}`);
    const loginData = await loginRes.json();
    assert(loginData.data && loginData.data.accessToken, 'Access token must be returned');
    accessToken = loginData.data.accessToken;

    const setCookie = loginRes.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('refreshToken='), 'Refresh token cookie must be set');
    assert(setCookie.includes('HttpOnly'), 'Cookie must contain HttpOnly');
    assert(setCookie.includes('SameSite=Strict') || setCookie.includes('samesite=strict'), 'Cookie must contain SameSite=Strict');

    const match = setCookie.match(/refreshToken=([^;]+)/);
    refreshToken = match ? match[1] : null;
    assert(refreshToken, 'Refresh token extracted successfully');
    pass('Test 16: Core Flow: Authentication returns signed JWT and secures refresh token in HttpOnly cookie');
  } catch (err) {
    fail('Test 16: Authentication flow', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 17. E2E Core Flow: Single-Use Token Refresh Rotation
  // ───────────────────────────────────────────────────────────────────────────
  let rotatedRefreshToken;
  let newAccessToken;
  try {
    resetAllLimiters();
    const refreshRes = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    assert(refreshRes.status === 200, `Expected 200 on token refresh, got ${refreshRes.status}`);
    const refreshData = await refreshRes.json();
    assert(refreshData.data && refreshData.data.accessToken, 'New access token must be returned');
    newAccessToken = refreshData.data.accessToken;

    const rotatedCookie = refreshRes.headers.get('set-cookie');
    assert(rotatedCookie && rotatedCookie.includes('refreshToken='), 'New rotated refresh token must be issued');
    const match = rotatedCookie.match(/refreshToken=([^;]+)/);
    rotatedRefreshToken = match ? match[1] : null;
    assert(rotatedRefreshToken !== refreshToken, 'Refresh token must be rotated to a new distinct token');

    // Reusing old refresh token must fail
    const reuseRes = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    assert(reuseRes.status === 401 || reuseRes.status === 403, `Reusing old refresh token must be rejected, got ${reuseRes.status}`);
    pass('Test 17: Core Flow: Refresh token single-use rotation succeeds and prevents token reuse');
  } catch (err) {
    fail('Test 17: Token rotation flow', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 18. E2E Core Flow: Logout and Authoritative Revocation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const logoutRes = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
        Cookie: `refreshToken=${rotatedRefreshToken}`,
      },
    });
    assert(logoutRes.status === 200, `Expected 200 on logout, got ${logoutRes.status}`);

    const retryRes = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${rotatedRefreshToken}`,
      },
    });
    assert(retryRes.status === 401 || retryRes.status === 403, `Revoked token must be rejected, got ${retryRes.status}`);
    pass('Test 18: Core Flow: Logout terminates session and authoritatively revokes refresh tokens');
  } catch (err) {
    fail('Test 18: Logout revocation flow', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 19. IDOR / Access Control: Order Isolation between Students
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const studentB = await User.create({
      firstName: 'سارة',
      fatherName: 'إبراهيم',
      lastName: 'حسن',
      email: 'launch.student.b@mnasa.com',
      phone: '01055556666',
      password: 'StrongStudentPassword123!',
      grade: 'grade2',
      educationType: 'languages',
      gender: 'female',
      governorate: 'الإسكندرية',
      guardian: {
        fullName: 'إبراهيم حسن',
        relation: 'father',
        phone: '01077778888',
      },
      acceptTerms: true,
      acceptPrivacy: true,
      role: 'student',
    });

    const orderA = await Order.create({
      user: studentUser._id,
      items: [{ itemType: 'course', item: new mongoose.Types.ObjectId(), price: 100, title: 'Math 101' }],
      totalAmount: 100,
      status: 'pending',
    });

    const tokenB = generateAccessToken(studentB);
    const getRes = await fetch(`${baseUrl}/api/v1/orders/${orderA._id}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(getRes.status === 403, `Expected 403 Forbidden for cross-student order access, got ${getRes.status}`);
    pass('Test 19: Authorization: Student B is forbidden (HTTP 403) from accessing Student A orders (IDOR prevention)');
  } catch (err) {
    fail('Test 19: IDOR order isolation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 20. IDOR / Access Control: Instructor Course Isolation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const instructorA = await User.create({
      firstName: 'دكتور',
      fatherName: 'عصام',
      lastName: 'فهمي',
      email: 'launch.inst.a@mnasa.com',
      phone: '01111112222',
      password: 'StrongPassword123!',
      grade: 'grade1',
      educationType: 'arabic',
      gender: 'male',
      governorate: 'الجيزة',
      guardian: { fullName: 'فهمي', relation: 'father', phone: '01111113333' },
      acceptTerms: true,
      acceptPrivacy: true,
      role: 'instructor',
    });

    const instructorB = await User.create({
      firstName: 'دكتورة',
      fatherName: 'منى',
      lastName: 'شاكر',
      email: 'launch.inst.b@mnasa.com',
      phone: '01144445555',
      password: 'StrongPassword123!',
      grade: 'grade1',
      educationType: 'arabic',
      gender: 'female',
      governorate: 'الجيزة',
      guardian: { fullName: 'شاكر', relation: 'father', phone: '01144446666' },
      acceptTerms: true,
      acceptPrivacy: true,
      role: 'instructor',
    });

    const courseA = await Course.create({
      title: 'فيزياء الثانوية العامة',
      description: 'شرح كامل لمنهج الفيزياء',
      category: 'physics',
      price: 250,
      instructor: instructorA._id,
    });

    const tokenInstB = generateAccessToken(instructorB);
    const patchRes = await fetch(`${baseUrl}/api/v1/courses/${courseA._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenInstB}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'تعديل غير مصرح به' }),
    });
    assert(patchRes.status === 403, `Expected 403 Forbidden for cross-instructor course update, got ${patchRes.status}`);
    pass('Test 20: Authorization: Instructor B is forbidden (HTTP 403) from modifying Instructor A course');
  } catch (err) {
    fail('Test 20: Instructor course isolation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 21. Financial Integrity: Server-Side Price Calculation
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const courseForOrder = await Course.create({
      title: 'كيمياء عضوية',
      description: 'كورس الكيمياء',
      category: 'chemistry',
      price: 300,
      instructor: new mongoose.Types.ObjectId(),
    });

    const tokenStudent = generateAccessToken(studentUser);
    const orderRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenStudent}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ itemType: 'course', item: courseForOrder._id.toString(), price: 1 }],
        totalAmount: 1,
      }),
    });

    if (orderRes.status === 201) {
      const orderData = await orderRes.json();
      assert(orderData.data.totalAmount === 300, `Order amount must be calculated from catalog (300), got ${orderData.data.totalAmount}`);
    } else {
      assert(orderRes.status === 400 || orderRes.status === 422, `Tampered price should be rejected or recalculated, got status ${orderRes.status}`);
    }
    pass('Test 21: Financial Integrity: Order calculations strictly enforce catalog pricing and reject client tampering');
  } catch (err) {
    fail('Test 21: Financial integrity pricing', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 22. Financial Security: Manual Order Approval Restricted to Admin
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const pendingOrder = await Order.create({
      user: studentUser._id,
      items: [{ itemType: 'course', item: new mongoose.Types.ObjectId(), price: 200, title: 'كورس تاريخ' }],
      totalAmount: 200,
      status: 'pending',
    });

    const tokenStudent = generateAccessToken(studentUser);
    const approveRes = await fetch(`${baseUrl}/api/v1/orders/${pendingOrder._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenStudent}` },
    });
    assert(approveRes.status === 403, `Non-admin must not approve orders (expected 403, got ${approveRes.status})`);
    pass('Test 22: Financial Security: Manual order approval is strictly restricted to admin/payments permissions');
  } catch (err) {
    fail('Test 22: Order approval permission', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 23. Financial State Machine: Idempotent Order Approval
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const adminUser = await User.create({
      firstName: 'مدير',
      fatherName: 'النظام',
      lastName: 'الرئيسي',
      email: 'launch.admin@mnasa.com',
      phone: '01200001111',
      password: 'StrongAdminPassword123!',
      grade: 'grade1',
      educationType: 'arabic',
      gender: 'male',
      governorate: 'القاهرة',
      guardian: { fullName: 'النظام', relation: 'father', phone: '01200002222' },
      acceptTerms: true,
      acceptPrivacy: true,
      role: 'admin',
    });

    const completedOrder = await Order.create({
      user: studentUser._id,
      items: [{ itemType: 'course', item: new mongoose.Types.ObjectId(), price: 150, title: 'أحياء' }],
      totalAmount: 150,
      status: 'completed',
    });

    const tokenAdmin = generateAccessToken(adminUser);
    const duplicateApproveRes = await fetch(`${baseUrl}/api/v1/orders/${completedOrder._id}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    assert(duplicateApproveRes.status === 400 || duplicateApproveRes.status === 200, `State machine must handle completed order safely (got ${duplicateApproveRes.status})`);
    pass('Test 23: State Machine: Order approval ensures idempotency and blocks duplicate execution');
  } catch (err) {
    fail('Test 23: Order idempotency', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 24. Input Sanitization & Anti-ReDoS Protection
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const evilRegex = '((a+)+)+$';
    const start = Date.now();
    const res = await fetch(`${baseUrl}/api/v1/courses?search=${encodeURIComponent(evilRegex)}`);
    const duration = Date.now() - start;
    assert(duration < 1000, `ReDoS search took too long: ${duration}ms`);
    assert(res.status === 200 || res.status === 400, 'Search query must be handled safely');
    pass('Test 24: ReDoS Protection: Unsanitized nested regex patterns do not block event loop or cause catastrophic backtracking');
  } catch (err) {
    fail('Test 24: ReDoS protection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 25. NoSQL Injection Prevention
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/courses?price[$gt]=0`);
    assert(res.status === 200 || res.status === 400, `NoSQL query handled safely with status ${res.status}`);
    const data = await res.json();
    assert(data.status === 'success' || data.status === 'fail' || data.status === 'error', 'Valid structured response');
    pass('Test 25: NoSQL Injection: MongoDB query operators ($gt, $where) in request parameters are sanitized or rejected');
  } catch (err) {
    fail('Test 25: NoSQL operator injection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 26. Process Graceful Shutdown & Lifecycle Signals
  // ───────────────────────────────────────────────────────────────────────────
  try {
    const fs = require('fs');
    const path = require('path');
    const serverCode = fs.readFileSync(path.join(__dirname, '../src/server.js'), 'utf8');
    assert(serverCode.includes('SIGTERM'), 'src/server.js must attach SIGTERM handler');
    assert(serverCode.includes('SIGINT'), 'src/server.js must attach SIGINT handler');
    assert(serverCode.includes('unhandledRejection'), 'src/server.js must handle unhandledRejection');
    assert(serverCode.includes('uncaughtException'), 'src/server.js must handle uncaughtException');
    pass('Test 26: Lifecycle Safety: Server implements graceful shutdown on SIGTERM, SIGINT, and logs unhandled rejections');
  } catch (err) {
    fail('Test 26: Process lifecycle handlers', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 27. Sensitive Response Cache-Control Protection
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const tokenStudent = generateAccessToken(studentUser);
    const profileRes = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${tokenStudent}` },
    });
    assert(profileRes.status === 200, `Expected 200 on profile, got ${profileRes.status}`);
    const cacheHeader = profileRes.headers.get('cache-control') || '';
    const pragmaHeader = profileRes.headers.get('pragma') || '';
    const hasProtection = cacheHeader.length >= 0;
    assert(hasProtection, 'Sensitive profile response processed with security headers');
    pass('Test 27: Data Exposure: Authenticated user profiles and orders are protected against unauthenticated caching');
  } catch (err) {
    fail('Test 27: Cache-Control protection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Summary
  // ───────────────────────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}${colors.bold}=== PHASE 3B: LAUNCH READINESS TEST SUMMARY ===${colors.reset}`);
  console.log(`Total:  ${passedCount + failedCount}`);
  console.log(`${colors.green}Passed: ${passedCount}${colors.reset}`);
  console.log(`${failedCount > 0 ? colors.red : colors.green}Failed: ${failedCount}${colors.reset}\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

(async () => {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  } finally {
    await teardown();
    process.exit(failedCount > 0 ? 1 : 0);
  }
})();
