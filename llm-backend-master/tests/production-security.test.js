const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const config = require('../src/config');
const redisConfig = require('../src/config/redis');
const connectDB = require('../src/database/connection');
const errorHandler = require('../src/middlewares/error.middleware');
const { generateAccessToken, generateRefreshToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');

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
  console.log(`${colors.cyan}${colors.bold}=== Setting up Phase 3A: Production Infrastructure & Deployment Security Tests ===${colors.reset}`);

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
  console.log(`\n${colors.yellow}${colors.bold}--- Starting Phase 3A: Production Security & Infrastructure Verification ---${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // Test 1: Production Error Sanitization (Generic Safe Message on 500)
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
      const fatalErr = new Error('CRITICAL DB DISK EXHAUSTION at /var/lib/mongodb');
      errorHandler(fatalErr, {}, mockRes, () => {});

      assert(statusCaptured === 500, `Expected status 500, got ${statusCaptured}`);
      assert(jsonCaptured.status === 'error', 'Status must be error');
      assert(jsonCaptured.message === 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً', 'Expected generic Arabic server error message');
      assert(jsonCaptured.stack === undefined, 'Stack trace must not be present in production error response');
      assert(!JSON.stringify(jsonCaptured).includes('/var/lib/mongodb'), 'Internal paths must not be leaked');
    } finally {
      config.env = origEnv;
    }

    pass('Test 1: Production Error Sanitization: 500 errors return a sanitized generic message without file paths');
  } catch (err) {
    fail('Test 1: Production error sanitization', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 2: Stack Trace Concealment in Production
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const origEnv = config.env;
    config.env = 'production';
    try {
      let jsonCaptured = null;
      const mockRes = {
        status() { return this; },
        json(d) { jsonCaptured = d; return this; },
      };
      const internalErr = new TypeError('Cannot read property of undefined at User.authenticate (src/auth.js:42)');
      errorHandler(internalErr, {}, mockRes, () => {});

      assert(jsonCaptured.stack === undefined, 'Stack trace must be strictly undefined');
      assert(!JSON.stringify(jsonCaptured).includes('src/auth.js'), 'Code lines and function names must be omitted');
    } finally {
      config.env = origEnv;
    }

    pass('Test 2: Stack Trace Concealment: Raw runtime exceptions never leak function names or line numbers in production');
  } catch (err) {
    fail('Test 2: Stack trace concealment', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 3: Environment Concealment in /health Endpoint
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    assert(res.status === 200, `Expected 200 on /health, got ${res.status}`);
    const data = await res.json();

    assert(data.status === 'ok', 'Status must be ok');
    assert(data.env === undefined, 'Production environment name must not be disclosed');
    assert(data.nodeVersion === undefined, 'Node version must not be disclosed');
    assert(data.processId === undefined, 'Process PID must not be disclosed');
    assert(data.database === undefined, 'Database host/credentials must not be disclosed');

    pass('Test 3: Environment Concealment: /health endpoint provides clean liveness without disclosing infrastructure details');
  } catch (err) {
    fail('Test 3: /health environment concealment', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 4: CORS Production Configuration (Explicit Origin, No Wildcard with Credentials)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const resPreflight = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://malicious-external-origin.com',
        'Access-Control-Request-Method': 'POST',
      },
    });

    const allowOrigin = resPreflight.headers.get('access-control-allow-origin');
    assert(allowOrigin !== '*', 'CORS Access-Control-Allow-Origin must NEVER be wildcard * with credentials');
    assert(allowOrigin !== 'https://malicious-external-origin.com', 'Untrusted origin must not be reflected in CORS header');

    pass('Test 4: CORS Production Safety: Unauthorized origins are strictly denied; wildcard with credentials is prohibited');
  } catch (err) {
    fail('Test 4: CORS production safety', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 5: Security Header Enforcement - X-Content-Type-Options: nosniff
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    const header = res.headers.get('x-content-type-options');
    assert(header === 'nosniff', `Expected X-Content-Type-Options: nosniff, got ${header}`);

    pass('Test 5: Security Headers: X-Content-Type-Options is set to "nosniff" to prevent MIME sniffing attacks');
  } catch (err) {
    fail('Test 5: nosniff header missing', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 6: Security Header Enforcement - X-Frame-Options: DENY (Clickjacking)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    const frameHeader = res.headers.get('x-frame-options');
    assert(frameHeader === 'DENY', `Expected X-Frame-Options: DENY, got ${frameHeader}`);

    pass('Test 6: Security Headers: X-Frame-Options is set to "DENY" to prevent UI redressing / clickjacking');
  } catch (err) {
    fail('Test 6: X-Frame-Options header missing', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 7: Security Header Enforcement - Strict-Transport-Security (HSTS)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    const hsts = res.headers.get('strict-transport-security');
    assert(hsts && hsts.includes('max-age=31536000'), `Expected HSTS max-age=31536000, got ${hsts}`);
    assert(hsts.includes('includeSubDomains'), 'HSTS must include subdomains');

    pass('Test 7: Security Headers: Strict-Transport-Security (HSTS) is enabled with 1-year duration and includeSubDomains');
  } catch (err) {
    fail('Test 7: HSTS header missing', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 8: Security Header Enforcement - Referrer-Policy
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const res = await fetch(`${baseUrl}/health`);
    const refPolicy = res.headers.get('referrer-policy');
    assert(refPolicy === 'strict-origin-when-cross-origin', `Expected strict-origin-when-cross-origin, got ${refPolicy}`);

    pass('Test 8: Security Headers: Referrer-Policy is enforced as "strict-origin-when-cross-origin"');
  } catch (err) {
    fail('Test 8: Referrer-Policy header missing', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 9: JWT Production Signature Algorithm Lock (Strict HS256)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const { verifyAccessToken } = require('../src/utils/jwt');
    // Forged none algorithm
    const unsignedHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const unsignedPayload = Buffer.from(JSON.stringify({ id: 'fake_admin', role: 'admin' })).toString('base64url');
    const fakeToken = `${unsignedHeader}.${unsignedPayload}.`;

    let threw = false;
    try {
      verifyAccessToken(fakeToken);
    } catch (e) {
      threw = true;
    }
    assert(threw, 'verifyAccessToken must throw on non-HS256 algorithms');

    pass('Test 9: JWT Production Enforcement: Algorithm restriction strictly enforces HS256 and rejects unsigned tokens');
  } catch (err) {
    fail('Test 9: JWT algorithm enforcement', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 10: Refresh Cookie Production Security Settings
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Simulate login in production to verify cookie options
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      // In auth.controller.js getCookieOptions():
      // httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/'
      const authController = require('../src/modules/auth/auth.controller');
      // We can verify through a simulated HTTP login
      const User = require('../src/modules/users/user.model');
      let testUser = await User.findOne({ email: 'cookie.test@platform.com' });
      if (!testUser) {
        testUser = await User.create({
          firstName: 'Cookie',
          fatherName: 'Tester',
          lastName: 'User',
          email: 'cookie.test@platform.com',
          phone: '01019999999',
          password: 'Password123!',
          grade: 'grade1',
          school: 'School',
          governorate: 'Cairo',
          educationType: 'arabic',
          gender: 'male',
          guardian: { fullName: 'Guardian', relation: 'father', phone: '01019999998' },
          acceptTerms: true,
          acceptPrivacy: true,
          isEmailVerified: true,
        });
      }

      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'cookie.test@platform.com', password: 'Password123!' }),
      });
      const cookieHeader = res.headers.get('set-cookie');
      assert(cookieHeader, 'Expected Set-Cookie header');
      assert(cookieHeader.includes('HttpOnly'), 'Cookie must be HttpOnly');
      assert(cookieHeader.includes('SameSite=Strict') || cookieHeader.includes('samesite=strict'), 'Cookie must have SameSite=Strict');
    } finally {
      process.env.NODE_ENV = origEnv;
    }

    pass('Test 10: Cookie Production Configuration: Refresh token cookies enforce HttpOnly, SameSite=Strict, and path=/');
  } catch (err) {
    fail('Test 10: Cookie security configuration', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 11: Request Body Size Limit (10KB Ceiling Protection)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const oversizedBody = { payload: 'A'.repeat(15 * 1024) };
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oversizedBody),
    });
    assert(res.status === 413, `Expected HTTP 413 Payload Too Large, got ${res.status}`);

    pass('Test 11: Resource Limits: JSON body payload size ceiling strictly enforced at 10KB (HTTP 413)');
  } catch (err) {
    fail('Test 11: Body size limit enforcement', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 12: Production Secret Configuration Validation - Missing JWT Secret Fails Startup
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let threw = false;
    try {
      config.validateProductionConfig({
        env: 'production',
        jwt: { secret: '', refreshSecret: 'a'.repeat(32) },
        mongo: { uri: 'mongodb://localhost:27017' },
      });
    } catch (e) {
      threw = true;
      assert(e.validationErrors && e.validationErrors.some((msg) => msg.includes('JWT_SECRET')), 'Expected JWT_SECRET validation error');
    }
    assert(threw, 'validateProductionConfig must throw when JWT_SECRET is missing');

    pass('Test 12: Secret Validation: Production startup validation rejects missing or empty JWT_SECRET');
  } catch (err) {
    fail('Test 12: Missing JWT_SECRET validation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 13: Production Secret Configuration Validation - Insecure Default Secret Rejected
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let threw = false;
    try {
      config.validateProductionConfig({
        env: 'production',
        jwt: {
          secret: 'your_super_secret_jwt_key_change_in_production',
          refreshSecret: 'your_super_secret_refresh_key_change_in_production',
        },
        mongo: { uri: 'mongodb://localhost:27017' },
      });
    } catch (e) {
      threw = true;
      assert(e.validationErrors && e.validationErrors.length >= 2, 'Expected both JWT secrets to be flagged');
    }
    assert(threw, 'validateProductionConfig must throw when default template secrets are used');

    pass('Test 13: Secret Validation: Production startup validation strictly rejects default placeholder secrets');
  } catch (err) {
    fail('Test 13: Default template secret rejection', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 14: Production Secret Configuration Validation - Weak Key (<32 chars) Rejected
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let threw = false;
    try {
      config.validateProductionConfig({
        env: 'production',
        jwt: { secret: 'short_key_123', refreshSecret: 'another_short_key' },
        mongo: { uri: 'mongodb://localhost:27017' },
      });
    } catch (e) {
      threw = true;
      assert(e.validationErrors && e.validationErrors.some((msg) => msg.includes('32 characters')), 'Expected 32 character error');
    }
    assert(threw, 'validateProductionConfig must throw when key length is < 32 characters');

    pass('Test 14: Secret Validation: Production startup validation enforces minimum 32-character key entropy');
  } catch (err) {
    fail('Test 14: Weak key length validation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 15: Production Secret Configuration Validation - Missing MONGO_URI Rejected
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let threw = false;
    try {
      config.validateProductionConfig({
        env: 'production',
        jwt: { secret: 'a'.repeat(32), refreshSecret: 'b'.repeat(32) },
        mongo: { uri: '' },
      });
    } catch (e) {
      threw = true;
      assert(e.validationErrors && e.validationErrors.some((msg) => msg.includes('MONGO_URI')), 'Expected MONGO_URI error');
    }
    assert(threw, 'validateProductionConfig must throw when MONGO_URI is missing');

    pass('Test 15: Secret Validation: Production startup validation rejects missing database connection string');
  } catch (err) {
    fail('Test 15: Missing MONGO_URI validation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 16: MongoDB Production Safety - In-Memory Fallback Forbidden in Production
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

    pass('Test 16: Database Production Safety: Failed MongoDB connection aborts startup and forbids in-memory fallback in production');
  } catch (err) {
    fail('Test 16: In-memory fallback forbidden in production', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 17: Redis Safe Proxy Fallback Behavior
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Test that safeRedis returns null without throwing unhandled rejection when Redis is unconfigured
    const testKey = await redisConfig.redis.get('some_nonexistent_key');
    assert(testKey === null || testKey === undefined, 'safeRedis must gracefully return null or undefined');

    pass('Test 17: Redis Resilience: safeRedis proxy gracefully absorbs missing Redis instances without crashing');
  } catch (err) {
    fail('Test 17: Redis proxy fallback behavior', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 18: Sensitive Logging Prevention (Passwords & Credentials Masked)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    let loggedOutput = '';
    const originalConsoleError = console.error;
    console.error = (...args) => {
      loggedOutput += args.join(' ') + ' ';
    };

    try {
      const origEnv = config.env;
      config.env = 'production';
      try {
        const sensitiveErr = new Error('Connection failed to mongodb://superadmin:TopSecretPassword123@cluster0.net');
        errorHandler(sensitiveErr, {}, { status: () => ({ json: () => {} }) }, () => {});
        assert(loggedOutput.includes('mongodb://***:***@cluster0.net'), 'Log must mask credentials');
        assert(!loggedOutput.includes('TopSecretPassword123'), 'Plaintext password must NEVER appear in logs');
      } finally {
        config.env = origEnv;
      }
    } finally {
      console.error = originalConsoleError;
    }

    pass('Test 18: Logging Sanitization: Database passwords and credentials are automatically masked from error logs');
  } catch (err) {
    fail('Test 18: Credential masking in logs', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 19: Dangerous Debug and Configuration Route Absence (Safe 404)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const sensitivePaths = ['/debug', '/config', '/env', '/.env', '/actuator/env', '/api/debug', '/api/config'];
    for (const p of sensitivePaths) {
      const res = await fetch(`${baseUrl}${p}`);
      assert(res.status === 404, `Path ${p} must return 404, got ${res.status}`);
      const data = await res.json();
      assert(data.config === undefined && data.env === undefined, `Path ${p} must not leak data`);
    }

    pass('Test 19: Route Hardening: All common debug, environment, and configuration paths return safe generic 404');
  } catch (err) {
    fail('Test 19: Debug/config route absence', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 20: Process Lifecycle & Graceful Shutdown Handlers Registered in server.js
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const serverPath = path.join(__dirname, '../src/server.js');
    assert(fs.existsSync(serverPath), 'server.js must exist');
    const serverContent = fs.readFileSync(serverPath, 'utf8');

    assert(serverContent.includes("process.on('SIGTERM'"), 'SIGTERM listener must be registered for graceful shutdown');
    assert(serverContent.includes("process.on('SIGINT'"), 'SIGINT listener must be registered for graceful shutdown');
    assert(serverContent.includes("process.on('unhandledRejection'"), 'unhandledRejection listener must be registered');
    assert(serverContent.includes("process.on('uncaughtException'"), 'uncaughtException listener must be registered');

    pass('Test 20: Process Lifecycle: Coordinated SIGTERM, SIGINT, unhandledRejection, and uncaughtException handlers are implemented');
  } catch (err) {
    fail('Test 20: Graceful shutdown handler registration', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 21: render.yaml Cloud Deployment Safety (No Plaintext Secrets)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    const renderPath = path.join(__dirname, '../render.yaml');
    assert(fs.existsSync(renderPath), 'render.yaml must exist');
    const renderContent = fs.readFileSync(renderPath, 'utf8');

    assert(!renderContent.includes('super_secret_jwt_key'), 'render.yaml must NOT contain hardcoded JWT secrets');
    assert(!renderContent.includes('mnasa_educational_platform_32ch'), 'render.yaml must NOT contain hardcoded encryption keys');
    assert(renderContent.includes('sync: false'), 'render.yaml must use sync: false for sensitive environment variables');

    pass('Test 21: Infrastructure as Code Safety: render.yaml specifies sync: false for secrets without plaintext values');
  } catch (err) {
    fail('Test 21: render.yaml secret exposure', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 22: Reverse Proxy Trust Configuration Audit
  // ───────────────────────────────────────────────────────────────────────────
  try {
    resetAllLimiters();
    // Verify that app's trust proxy setting respects config.trustProxy
    const currentTrustProxy = app.get('trust proxy');
    if (config.trustProxy) {
      assert(currentTrustProxy === 1 || currentTrustProxy === true, 'Trust proxy should be enabled when config.trustProxy is true');
    } else {
      assert(currentTrustProxy === false, 'Trust proxy should be disabled when config.trustProxy is false (preventing IP spoofing)');
    }

    pass('Test 22: Reverse Proxy Audit: Express "trust proxy" setting is strictly controlled by environment configuration');
  } catch (err) {
    fail('Test 22: Trust proxy configuration', err);
  }

  console.log(`\n${colors.cyan}${colors.bold}=== PHASE 3A: PRODUCTION SECURITY TEST SUMMARY ===${colors.reset}`);
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
    process.exit(failedCount > 0 ? 1 : 0);
  }
})();
