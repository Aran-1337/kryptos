const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const config = require('../src/config');
const User = require('../src/modules/users/user.model');
const TeamMember = require('../src/modules/team/team.model');
const Course = require('../src/modules/courses/course.model');
const Order = require('../src/modules/orders/order.model');
const { generateAccessToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');

let mongoServer;
let server;
let baseUrl;

// Fixtures
let testUser;
let testAdmin;
let testTeamMember;
let tokenUser;
let tokenAdmin;
let tokenTeam;
let testCourse;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up Phase 2I: Secrets & Data Exposure Security Test Environment ===${colors.reset}`);

  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB: ${uri}`);
  }

  // Clear collections
  await User.deleteMany({});
  await TeamMember.deleteMany({});
  await Order.deleteMany({});
  await Course.deleteMany({});

  // Create test user
  testUser = await User.create({
    firstName: 'Ahmed',
    fatherName: 'Hassan',
    lastName: 'Ali',
    email: 'ahmed.exposure@test.com',
    phone: '01011112222',
    password: 'Password123!',
    role: 'student',
    grade: 'grade1',
    school: 'Cairo High',
    governorate: 'Cairo',
    city: 'Nasr City',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Hassan Ali', relation: 'father', phone: '01011112223' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    refreshTokens: ['token_abc123_sensitive'],
    emailVerificationToken: 'verify_token_secret_123',
    passwordResetToken: 'reset_token_secret_456',
    fcmTokens: ['fcm_push_token_secret_789'],
  });

  // Create test admin
  testAdmin = await User.create({
    firstName: 'Admin',
    fatherName: 'System',
    lastName: 'User',
    email: 'admin.exposure@test.com',
    phone: '01099998888',
    password: 'AdminPassword123!',
    role: 'admin',
    grade: 'grade1',
    school: 'Admin High',
    governorate: 'Cairo',
    city: 'Nasr City',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'System Parent', relation: 'father', phone: '01099998889' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
  });

  // Create test team member
  testTeamMember = await TeamMember.create({
    name: 'Assistant Sara',
    email: 'sara.exposure@test.com',
    phone: '01033334444',
    password: 'SaraPassword123!',
    role: 'assistant',
    inviteToken: 'invite_secret_xyz789',
    inviteExpires: new Date(Date.now() + 86400000),
    refreshTokens: ['team_refresh_sensitive_555'],
    isAccepted: true,
    isActive: true,
  });

  tokenUser = generateAccessToken(testUser._id, 'student', { type: 'user' });
  tokenAdmin = generateAccessToken(testAdmin._id, 'admin', { type: 'user' });
  tokenTeam = generateAccessToken(testTeamMember._id, 'assistant', { type: 'team_member' });

  // Create dummy course
  testCourse = await Course.create({
    title: 'Data Exposure Test Course',
    description: 'Course to verify order response and query exposure',
    instructor: testAdmin._id,
    category: 'Development',
    grade: 'grade1',
    subject: 'Physics',
    price: 150,
    isPublished: true,
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
  console.log(`\n${colors.yellow}${colors.bold}--- Starting Phase 2I: Secrets & Data Exposure Security Tests ---${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // Test 1: User registration response does NOT expose password hash or sensitive tokens
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Noor',
        fatherName: 'Hassan',
        lastName: 'Salem',
        email: 'noor.reg.exposure@test.com',
        phone: '01055556666',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        grade: 'grade1',
        school: 'Giza High',
        governorate: 'Giza',
        city: 'Dokki',
        educationType: 'arabic',
        gender: 'female',
        guardian: { fullName: 'Hassan Salem', relation: 'father', phone: '01055556667' },
        acceptTerms: true,
        acceptPrivacy: true,
      }),
    });

    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const data = await res.json();
    const user = data.data?.user || {};

    assert(user.password === undefined, 'Password field must not be present');
    assert(user.confirmPassword === undefined, 'confirmPassword must not be present');
    assert(user.refreshTokens === undefined, 'refreshTokens must not be present');
    assert(user.emailVerificationToken === undefined, 'emailVerificationToken must not be present');
    assert(user.passwordResetToken === undefined, 'passwordResetToken must not be present');
    assert(user.__v === undefined, '__v internal version must be stripped');

    pass('Test 1: User registration response does NOT expose password, hash, or sensitive tokens');
  } catch (err) {
    fail('Test 1: User registration response does not expose sensitive data', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 2: Login response returns tokens but user object does NOT leak password hash or tokens
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ahmed.exposure@test.com',
        password: 'Password123!',
      }),
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const user = data.data?.user || {};

    assert(user.password === undefined, 'Password field must not be present');
    assert(user.refreshTokens === undefined, 'refreshTokens must not be present');
    assert(user.passwordResetToken === undefined, 'passwordResetToken must not be present');
    assert(user.fcmTokens === undefined, 'fcmTokens must not be present');
    assert(user.__v === undefined, '__v internal version must be stripped');

    pass('Test 2: Login response returns tokens but user object does NOT leak password hash or tokens');
  } catch (err) {
    fail('Test 2: Login response does not leak sensitive credentials', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 3: Profile fetch (GET /api/v1/users/profile) does NOT leak password hash, refreshTokens, or verification tokens
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const user = data.data?.user || data.data || {};

    assert(user.password === undefined, 'Password field must not be present in /profile');
    assert(user.refreshTokens === undefined, 'refreshTokens must not be present in /profile');
    assert(user.emailVerificationToken === undefined, 'emailVerificationToken must not be present in /profile');
    assert(user.passwordResetToken === undefined, 'passwordResetToken must not be present in /profile');
    assert(user.fcmTokens === undefined, 'fcmTokens must not be present in /profile');

    pass('Test 3: Profile fetch (GET /api/v1/users/profile) does NOT leak password hash, refreshTokens, or internal tokens');
  } catch (err) {
    fail('Test 3: Profile fetch does not leak sensitive credentials', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 4: Team member model and queries do NOT leak password hash or invite tokens in JSON output
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/team`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const members = data.data?.teamMembers || data.data?.members || data.data || [];
    assert(Array.isArray(members) && members.length > 0, 'Expected team members array');

    for (const member of members) {
      assert(member.password === undefined, 'Team member password must not be present');
      assert(member.inviteToken === undefined, 'Team member inviteToken must not be present');
      assert(member.refreshTokens === undefined, 'Team member refreshTokens must not be present');
      assert(member.__v === undefined, '__v internal version must be stripped');
    }

    pass('Test 4: Team member queries and endpoints do NOT leak password hash or invite tokens');
  } catch (err) {
    fail('Test 4: Team member endpoints do not leak credentials', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 5: Password reset request (POST /api/v1/auth/forgot-password) does NOT leak reset token in response
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ahmed.exposure@test.com' }),
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const bodyStr = JSON.stringify(data);

    assert(!bodyStr.includes('reset_token'), 'Response must not contain reset token');
    assert(!bodyStr.includes('token='), 'Response must not contain token query param or reset url');
    assert(data.data?.token === undefined, 'data.token must be undefined');

    pass('Test 5: Password reset request does NOT leak reset token in response');
  } catch (err) {
    fail('Test 5: Forgot password endpoint does not leak reset token', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 6: Email verification request (POST /api/v1/auth/resend-verification) does NOT leak verification token
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ahmed.exposure@test.com' }),
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const bodyStr = JSON.stringify(data);

    assert(!bodyStr.includes('verify_token'), 'Response must not contain verification token');
    assert(!bodyStr.includes('token='), 'Response must not contain token query param');
    assert(data.data?.token === undefined, 'data.token must be undefined');

    pass('Test 6: Email verification request does NOT leak verification token in response');
  } catch (err) {
    fail('Test 6: Resend verification endpoint does not leak verification token', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 7: Payment order creation and fetch does NOT expose gateway credentials or sensitive secrets
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Create an order in DB with simulated secret payment details
    const orderWithSecrets = await Order.create({
      user: testUser._id,
      items: [{
        itemType: 'course',
        item: testCourse._id,
        price: 150,
      }],
      totalAmount: 150,
      currency: 'EGP',
      paymentMethod: 'fawry',
      paymentDetails: {
        referenceNumber: 'REF123456',
        secret: 'fawry_secret_key_super_secret',
        apiKey: 'fawry_api_key_12345',
        apiSecret: 'fawry_api_secret_67890',
        webhookSecret: 'whsec_private_signing_key_abc',
        privateKey: 'private_key_pem_header',
      },
      status: 'pending',
    });

    const res = await fetch(`${baseUrl}/api/v1/orders/${orderWithSecrets._id}`, {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });

    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const order = data.data?.order || data.data || {};
    const details = order.paymentDetails || {};

    assert(details.secret === undefined, 'Payment secret must be stripped');
    assert(details.apiKey === undefined, 'Payment apiKey must be stripped');
    assert(details.apiSecret === undefined, 'Payment apiSecret must be stripped');
    assert(details.webhookSecret === undefined, 'Payment webhookSecret must be stripped');
    assert(details.privateKey === undefined, 'Payment privateKey must be stripped');
    assert(details.referenceNumber === 'REF123456', 'Non-sensitive reference number is preserved');

    pass('Test 7: Payment order responses do NOT expose gateway credentials or signing secrets');
  } catch (err) {
    fail('Test 7: Payment responses do not expose secrets', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 8: Cloudinary configuration / API credentials are NOT exposed in any responses
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Check config object and public responses
    const resMe = await fetch(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const bodyStr = await resMe.text();

    if (config.cloudinary?.apiSecret) {
      assert(!bodyStr.includes(config.cloudinary.apiSecret), 'Cloudinary API secret must never be exposed');
    }
    if (config.cloudinary?.apiKey) {
      assert(!bodyStr.includes(config.cloudinary.apiKey), 'Cloudinary API key must never be exposed in user responses');
    }
    assert(!bodyStr.includes('CLOUDINARY_API_SECRET'), 'Cloudinary env var name must not be exposed');

    pass('Test 8: Cloudinary credentials and secrets are NOT exposed via API responses');
  } catch (err) {
    fail('Test 8: Cloudinary credentials not exposed', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 9: Operational errors do NOT expose stack traces or system file paths
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Send invalid login payload to trigger 400 error
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email-format' }),
    });

    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const data = await res.json();

    assert(data.stack === undefined, 'Stack trace must not be present in operational error');
    assert(data.error === undefined, 'Internal error object must not be exposed');
    const text = JSON.stringify(data);
    assert(!text.includes('node_modules'), 'File paths (node_modules) must not be exposed');
    assert(!text.includes('at '), 'Stack trace frames must not be exposed');

    pass('Test 9: Operational errors do NOT expose stack traces, error objects, or system file paths');
  } catch (err) {
    fail('Test 9: Operational errors do not expose stack traces', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 10: Non-operational / 500 errors in test/production do NOT expose stack traces or internals
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const errorHandler = require('../src/middlewares/error.middleware');
    let capturedStatus = null;
    let capturedJson = null;

    const mockRes = {
      status(code) {
        capturedStatus = code;
        return this;
      },
      json(data) {
        capturedJson = data;
        return this;
      },
    };

    const origEnv = config.env;
    config.env = 'production';
    try {
      const simulatedFatalError = new Error('Database connection crashed unexpectedly at mongodb://user:pass123@cluster.mongodb.net');
      errorHandler(simulatedFatalError, {}, mockRes, () => {});

      assert(capturedStatus === 500, `Expected 500, got ${capturedStatus}`);
      assert(capturedJson.status === 'error', 'Status must be error');
      assert(capturedJson.message === 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً', 'Must return safe generic message');
      assert(capturedJson.stack === undefined, 'Stack trace must NEVER be present in 500 response');
      assert(!JSON.stringify(capturedJson).includes('pass123'), 'Passwords must never be exposed');
    } finally {
      config.env = origEnv;
    }

    pass('Test 10: Non-operational / 500 errors do NOT expose stack traces or system internals');
  } catch (err) {
    fail('Test 10: 500 errors do not expose stack traces', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 11: MongoDB CastError does NOT expose Mongoose internals, database schema, or stack trace
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Test both endpoint validation handling and error middleware CastError handling
    const res = await fetch(`${baseUrl}/api/v1/courses/not-a-valid-mongo-id`, {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });

    assert(res.status === 400, `Expected 400 on CastError/invalid ID, got ${res.status}`);
    const data = await res.json();

    assert(data.stack === undefined, 'Stack trace must not be exposed');
    assert(!JSON.stringify(data).includes('Cast to ObjectId failed'), 'Mongoose internal raw cast error must not be exposed');
    assert(data.message && (data.message.includes('غير صالح') || data.message.includes('غير صالحة')), 'Expected localized safe validation message');

    // Also verify error middleware CastError handler directly
    const errorHandler = require('../src/middlewares/error.middleware');
    let castStatus, castJson;
    errorHandler({ name: 'CastError', path: 'courseId', value: 'bad_id' }, {}, {
      status(code) { castStatus = code; return this; },
      json(d) { castJson = d; return this; },
    }, () => {});

    assert(castStatus === 400, 'CastError must yield 400');
    assert(castJson.message.includes('قيمة غير صالحة: courseId'), 'CastError must return localized path message');
    assert(castJson.stack === undefined, 'CastError must not leak stack');

    pass('Test 11: MongoDB CastError does NOT expose Mongoose internals, database schema, or stack trace');
  } catch (err) {
    fail('Test 11: CastError does not expose internals', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 12: JWT errors (invalid signature, malformed token) do NOT expose secret keys or system internals
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/api/v1/users/me`, {
      headers: { Authorization: 'Bearer this.is.a.completely.fake.and.malformed.jwt.token' },
    });

    assert(res.status === 401, `Expected 401 on invalid JWT, got ${res.status}`);
    const data = await res.json();

    assert(data.stack === undefined, 'Stack trace must not be exposed');
    assert(data.message.includes('رمز المصادقة غير صالح'), 'Expected localized safe auth error message');
    if (config.jwt?.secret) {
      assert(!JSON.stringify(data).includes(config.jwt.secret), 'JWT secret must NEVER be exposed');
    }

    pass('Test 12: JWT errors (invalid token) do NOT expose secret keys, algorithms, or internal traces');
  } catch (err) {
    fail('Test 12: JWT errors do not expose secrets', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 13: JWT expired error returns clean message without exposing internals
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Sign an expired token
    const expiredToken = jwt.sign(
      { id: testUser._id, role: 'student', type: 'user' },
      config.jwt.secret,
      { expiresIn: '-10s' }
    );

    const res = await fetch(`${baseUrl}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });

    assert(res.status === 401, `Expected 401 on expired JWT, got ${res.status}`);
    const data = await res.json();

    assert(data.stack === undefined, 'Stack trace must not be exposed on expired token');
    assert(data.message.includes('انتهت صلاحية رمز'), 'Expected localized token expired message');
    assert(!JSON.stringify(data).includes('jwt expired'), 'Raw library exception string must be sanitized');

    pass('Test 13: JWT expired error returns clean localized message without exposing internals');
  } catch (err) {
    fail('Test 13: JWT expired error does not leak internals', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 14: Non-existent sensitive configuration/debug endpoints (/debug, /config, /env, /.env) return safe 404
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const sensitivePaths = ['/debug', '/config', '/env', '/.env', '/api/debug', '/api/config', '/actuator'];

    for (const path of sensitivePaths) {
      const res = await fetch(`${baseUrl}${path}`);
      assert(res.status === 404, `Path ${path} must return 404, got ${res.status}`);
      const data = await res.json();
      assert(data.status === 'fail', `Path ${path} must return fail status`);
      assert(data.stack === undefined, `Path ${path} must not return stack`);
      assert(data.config === undefined && data.env === undefined, `Path ${path} must not expose config`);
    }

    pass('Test 14: Sensitive debug/config paths (/debug, /config, /env, /.env) return safe 404');
  } catch (err) {
    fail('Test 14: Debug/config endpoints do not expose configuration', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 15: Health check endpoint (/health) returns safe status without disclosing environment or config
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    assert(res.status === 200, `Expected 200 on /health, got ${res.status}`);
    const data = await res.json();

    assert(data.status === 'ok', 'Status must be ok');
    assert(data.env === undefined, 'Environment name must NOT be disclosed in /health');
    assert(data.database === undefined, 'Database info must not be disclosed in /health');
    assert(data.mongo === undefined, 'Mongo details must not be disclosed in /health');
    assert(data.version === undefined || typeof data.version === 'string', 'Version must be string if present');
    assert(data.config === undefined, 'Config must not be disclosed in /health');

    pass('Test 15: Health check endpoint (/health) returns safe status without disclosing environment or config');
  } catch (err) {
    fail('Test 15: Health check endpoint does not disclose environment', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 16: Authorization headers and bearer tokens are NOT reflected back in error responses
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const secretTokenString = 'bearer-canary-secret-token-do-not-reflect-12345';
    const res = await fetch(`${baseUrl}/api/v1/invalid-route-that-does-not-exist`, {
      headers: { Authorization: `Bearer ${secretTokenString}` },
    });

    const bodyText = await res.text();
    assert(!bodyText.includes(secretTokenString), 'Bearer token must not be reflected in 404 response');

    const resError = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${secretTokenString}` },
    });
    const errorBodyText = await resError.text();
    assert(!errorBodyText.includes(secretTokenString), 'Bearer token must not be reflected in auth error response');

    pass('Test 16: Authorization headers and bearer tokens are NOT reflected back in error responses');
  } catch (err) {
    fail('Test 16: Authorization headers are not reflected in errors', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 17: User query projections strip sensitive fields even when querying directly via model .toJSON()
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const userFromDb = await User.findById(testUser._id).select('+password +refreshTokens +emailVerificationToken +passwordResetToken +fcmTokens');
    assert(userFromDb.password !== undefined, 'Password should be in DB model when explicitly selected');
    assert(userFromDb.refreshTokens.length > 0, 'Refresh tokens should be in DB model');

    // Convert to JSON (which Express does when sending res.json)
    const jsonOutput = userFromDb.toJSON();

    assert(jsonOutput.password === undefined, 'toJSON must strip password');
    assert(jsonOutput.refreshTokens === undefined, 'toJSON must strip refreshTokens');
    assert(jsonOutput.emailVerificationToken === undefined, 'toJSON must strip emailVerificationToken');
    assert(jsonOutput.passwordResetToken === undefined, 'toJSON must strip passwordResetToken');
    assert(jsonOutput.fcmTokens === undefined, 'toJSON must strip fcmTokens');
    assert(jsonOutput.__v === undefined, 'toJSON must strip __v');

    pass('Test 17: Model .toJSON() automatically strips sensitive fields across all query projections');
  } catch (err) {
    fail('Test 17: Model toJSON strips sensitive fields', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 18: Account recovery endpoints protect against user enumeration (identical response format)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // 18a: forgot-password with existing email
    const resExisting = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ahmed.exposure@test.com' }),
    });
    assert(resExisting.status === 200, `Expected 200, got ${resExisting.status}`);
    const dataExisting = await resExisting.json();

    // 18b: forgot-password with non-existent email
    const resNonExisting = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'definitely.does.not.exist.999@test.com' }),
    });
    assert(resNonExisting.status === 200, `Expected 200 on non-existing email, got ${resNonExisting.status}`);
    const dataNonExisting = await resNonExisting.json();

    // Both status code and message must be identical to prevent user enumeration
    assert(dataExisting.status === dataNonExisting.status, 'Status must match');
    assert(dataExisting.message === dataNonExisting.message, 'Message must be identical for existing and non-existing email');

    // 18c: resend-verification with existing email
    const resVerifExisting = await fetch(`${baseUrl}/api/v1/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ahmed.exposure@test.com' }),
    });
    assert(resVerifExisting.status === 200, `Expected 200, got ${resVerifExisting.status}`);
    const dataVerifExisting = await resVerifExisting.json();

    // 18d: resend-verification with non-existing email
    const resVerifNonExisting = await fetch(`${baseUrl}/api/v1/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody.registered.here@test.com' }),
    });
    assert(resVerifNonExisting.status === 200, `Expected 200 on non-existing email, got ${resVerifNonExisting.status}`);
    const dataVerifNonExisting = await resVerifNonExisting.json();

    assert(dataVerifExisting.status === dataVerifNonExisting.status, 'Status must match for resend-verification');
    assert(dataVerifExisting.message === dataVerifNonExisting.message, 'Message must match for resend-verification');

    pass('Test 18: Account recovery endpoints (forgot-password, resend-verification) protect against user enumeration');
  } catch (err) {
    fail('Test 18: Account recovery endpoints protect against user enumeration', err);
  }

  console.log(`\n${colors.cyan}${colors.bold}=== PHASE 2I: SECRETS & DATA EXPOSURE SECURITY TEST SUMMARY ===${colors.reset}`);
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
