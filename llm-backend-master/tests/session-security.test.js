const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const TeamMember = require('../src/modules/team/team.model');
const { generateRefreshToken } = require('../src/utils/jwt');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

let mongoServer;
let server;
let baseUrl;

let testStudentUser;
let testTeamMember;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up Session Security Test Environment ===${colors.reset}`);

  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB: ${uri}`);
  }

  // Clear collections
  await User.deleteMany({});
  await TeamMember.deleteMany({});

  // Seed Student
  testStudentUser = await User.create({
    firstName: 'Omar',
    fatherName: 'Session',
    lastName: 'Tester',
    email: 'omar.session@platform.com',
    phone: '01055555551',
    password: 'Password123!',
    grade: 'grade1',
    governorate: 'Alexandria',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Parent Session', relation: 'father', phone: '01055555552' },
    role: 'student',
    isEmailVerified: true,
    isActive: true,
    acceptTerms: true,
    acceptPrivacy: true,
    refreshTokens: [],
  });

  // Seed TeamMember
  testTeamMember = await TeamMember.create({
    name: 'Nour Assistant',
    email: 'nour.assistant@platform.com',
    password: 'Password123!',
    role: 'assistant',
    permissions: ['support'],
    isAccepted: true,
    isActive: true,
    refreshTokens: [],
  });

  // Start HTTP server on dynamic port
  await new Promise((resolve) => {
    server = http.createServer(app).listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Session Security Test server running at: ${baseUrl}`);
      resolve();
    });
  });
}

async function teardown() {
  console.log(`\n${colors.cyan}=== Tearing down session security test environment ===${colors.reset}`);
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

// Helper to extract cookies from Set-Cookie header
function extractRefreshTokenCookie(res) {
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) return null;
  const match = setCookie.match(/refreshToken=([^;]+)/);
  return match ? match[1] : null;
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

  console.log(`\n${colors.bold}${colors.cyan}=== RUNNING SESSION SECURITY & REVOCATION TEST SUITE ===${colors.reset}\n`);

  let activeAccessToken = null;
  let activeRefreshToken = null;

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1 — Login creates valid session with Access & Refresh tokens
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 1 — Login creates valid session with tokens and database persistence', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'omar.session@platform.com',
        password: 'Password123!',
      }),
    });

    if (res.status !== 200) {
      throw new Error(`Login failed with HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.data.accessToken) throw new Error('Missing accessToken in login response');
    if (!data.data.refreshToken) throw new Error('Missing refreshToken in login response');

    activeAccessToken = data.data.accessToken;
    activeRefreshToken = data.data.refreshToken;

    // Verify httpOnly cookie was set
    const cookieToken = extractRefreshTokenCookie(res);
    if (!cookieToken) throw new Error('Missing refreshToken in Set-Cookie header');

    // Verify token was persisted in user.refreshTokens in database
    const userInDb = await User.findById(testStudentUser._id).select('+refreshTokens');
    if (!userInDb.refreshTokens.includes(activeRefreshToken)) {
      throw new Error('Refresh token was not stored in user document in database');
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2 — Valid refresh token works & rotates token
  // ───────────────────────────────────────────────────────────────────────────
  let rotatedRefreshToken = null;
  let newAccessToken = null;

  await test('Test 2 — Valid refresh token issues new access token & rotates refresh token (200 OK)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${activeRefreshToken}`,
      },
      body: JSON.stringify({ refreshToken: activeRefreshToken }),
    });

    if (res.status !== 200) {
      throw new Error(`Refresh failed with HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.data.accessToken) throw new Error('Missing new accessToken in refresh response');
    if (!data.data.refreshToken) throw new Error('Missing rotated refreshToken in refresh response');

    newAccessToken = data.data.accessToken;
    rotatedRefreshToken = data.data.refreshToken;

    // Verify DB state: old token is gone, new rotated token is present
    const userInDb = await User.findById(testStudentUser._id).select('+refreshTokens');
    if (userInDb.refreshTokens.includes(activeRefreshToken)) {
      throw new Error('Old refresh token was not removed from database during rotation');
    }
    if (!userInDb.refreshTokens.includes(rotatedRefreshToken)) {
      throw new Error('New rotated refresh token was not added to database');
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3 — Logout succeeds & revokes the refresh token
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 3 — Logout revokes refresh token from database and clears cookie (200 OK)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newAccessToken}`,
        Cookie: `refreshToken=${rotatedRefreshToken}`,
      },
      body: JSON.stringify({ refreshToken: rotatedRefreshToken }),
    });

    if (res.status !== 200) {
      throw new Error(`Logout failed with HTTP ${res.status}`);
    }

    // Verify Set-Cookie clears refreshToken
    const setCookie = res.headers.get('set-cookie');
    if (!setCookie || !setCookie.includes('refreshToken=;')) {
      throw new Error('Logout did not set clearCookie header for refreshToken');
    }

    // Verify refresh token was authoritative pulled from database
    const userInDb = await User.findById(testStudentUser._id).select('+refreshTokens');
    if (userInDb.refreshTokens.includes(rotatedRefreshToken)) {
      throw new Error('Refresh token was NOT revoked from database after logout!');
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4 — Refresh after logout fails (CRITICAL REGRESSION TEST)
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 4 — Refresh using revoked token after logout is rejected (401 Unauthorized)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${rotatedRefreshToken}`,
      },
      body: JSON.stringify({ refreshToken: rotatedRefreshToken }),
    });

    if (res.status !== 401) {
      throw new Error(`Expected HTTP 401 Unauthorized after logout, received ${res.status}!`);
    }

    const data = await res.json();
    if (data.status !== 'fail') {
      throw new Error(`Expected fail response, got: ${JSON.stringify(data)}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5 — Expired refresh token returns 401 Unauthorized
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 5 — Expired refresh token returns 401 Unauthorized', async () => {
    const expiredToken = jwt.sign(
      { id: testStudentUser._id, type: 'user' },
      config.jwt.refreshSecret,
      { expiresIn: '-1s' }
    );

    const res = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: expiredToken }),
    });

    if (res.status !== 401) {
      throw new Error(`Expected HTTP 401 for expired refresh token, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 6 — Invalid / malformed refresh token returns 401 Unauthorized
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 6 — Malformed refresh token returns 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: 'not.a.valid.jwt.token' }),
    });

    if (res.status !== 401) {
      throw new Error(`Expected HTTP 401 for malformed token, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 7 — Tampered refresh token signature returns 401 Unauthorized
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 7 — Tampered signature refresh token returns 401 Unauthorized', async () => {
    const fakeToken = jwt.sign(
      { id: testStudentUser._id, type: 'user' },
      'wrong_fake_secret_1234567890',
      { expiresIn: '7d' }
    );

    const res = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: fakeToken }),
    });

    if (res.status !== 401) {
      throw new Error(`Expected HTTP 401 for tampered signature, received ${res.status}`);
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 8 — Complete Student/User session lifecycle
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 8 — Complete Student lifecycle: login -> refresh -> logout -> refresh fails', async () => {
    // 1. Login
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'omar.session@platform.com',
        password: 'Password123!',
      }),
    });
    if (loginRes.status !== 200) throw new Error('Student login failed');
    const loginData = await loginRes.json();
    const token1 = loginData.data.accessToken;
    const rToken1 = loginData.data.refreshToken;

    // 2. Refresh
    const refreshRes = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rToken1 }),
    });
    if (refreshRes.status !== 200) throw new Error('Student refresh failed');
    const refreshData = await refreshRes.json();
    const token2 = refreshData.data.accessToken;
    const rToken2 = refreshData.data.refreshToken;

    // 3. Logout
    const logoutRes = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token2}`,
      },
      body: JSON.stringify({ refreshToken: rToken2 }),
    });
    if (logoutRes.status !== 200) throw new Error('Student logout failed');

    // 4. Old token fails
    const failRes = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rToken2 }),
    });
    if (failRes.status !== 401) throw new Error(`Expected 401 after logout, got ${failRes.status}`);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 9 — Complete TeamMember session lifecycle
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 9 — Complete TeamMember lifecycle: login -> refresh -> logout -> refresh fails', async () => {
    // 1. Team Login
    const loginRes = await fetch(`${baseUrl}/api/v1/team/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nour.assistant@platform.com',
        password: 'Password123!',
      }),
    });
    if (loginRes.status !== 200) throw new Error(`Team login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const memberAccess = loginData.data.accessToken;
    const memberRefresh = loginData.data.refreshToken;

    // Verify stored in TeamMember collection
    const memberInDb = await TeamMember.findById(testTeamMember._id).select('+refreshTokens');
    if (!memberInDb.refreshTokens.includes(memberRefresh)) {
      throw new Error('TeamMember refresh token was not stored in database');
    }

    // 2. Team Refresh
    const refreshRes = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: memberRefresh }),
    });
    if (refreshRes.status !== 200) throw new Error(`TeamMember refresh failed: ${refreshRes.status}`);
    const refreshData = await refreshRes.json();
    const memberAccess2 = refreshData.data.accessToken;
    const memberRefresh2 = refreshData.data.refreshToken;

    // 3. Team Logout
    const logoutRes = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberAccess2}`,
      },
      body: JSON.stringify({ refreshToken: memberRefresh2 }),
    });
    if (logoutRes.status !== 200) throw new Error(`TeamMember logout failed: ${logoutRes.status}`);

    // Verify revoked from TeamMember document in DB
    const memberInDbAfter = await TeamMember.findById(testTeamMember._id).select('+refreshTokens');
    if (memberInDbAfter.refreshTokens.includes(memberRefresh2)) {
      throw new Error('TeamMember refresh token was NOT removed from database upon logout!');
    }

    // 4. Team Refresh fails
    const failRes = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: memberRefresh2 }),
    });
    if (failRes.status !== 401) throw new Error(`Expected 401 for TeamMember after logout, got ${failRes.status}`);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 10 — Normal Access Token remains valid for its intended lifetime
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 10 — Active Access Token authenticates successfully during its valid window (200 OK)', async () => {
    // Login to get fresh access token
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'omar.session@platform.com',
        password: 'Password123!',
      }),
    });
    const { data } = await loginRes.json();
    const token = data.accessToken;

    // Request protected profile endpoint
    const profileRes = await fetch(`${baseUrl}/api/v1/users/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (profileRes.status !== 200) {
      throw new Error(`Expected HTTP 200 for valid access token, got ${profileRes.status}`);
    }
    const profileData = await profileRes.json();
    if (profileData.data.user.email !== 'omar.session@platform.com') {
      throw new Error('Profile response did not return expected user data');
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 11 — Multi-Session Device Isolation: Device A logout does NOT invalidate Device B
  // ───────────────────────────────────────────────────────────────────────────
  await test('Test 11 — Multi-Session Device Isolation: Revoking Device A leaves Device B active', async () => {
    // 1. Device A login
    const loginA = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'omar.session@platform.com', password: 'Password123!' }),
    });
    const dataA = (await loginA.json()).data;

    // 2. Device B login
    const loginB = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'omar.session@platform.com', password: 'Password123!' }),
    });
    const dataB = (await loginB.json()).data;

    // 3. Device A logs out (passing token A)
    const logoutA = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dataA.accessToken}`,
      },
      body: JSON.stringify({ refreshToken: dataA.refreshToken }),
    });
    if (logoutA.status !== 200) throw new Error('Device A logout failed');

    // 4. Token A should now fail
    const refreshA = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: dataA.refreshToken }),
    });
    if (refreshA.status !== 401) {
      throw new Error(`Device A token should have been revoked, got ${refreshA.status}`);
    }

    // 5. Token B should still be valid!
    const refreshB = await fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: dataB.refreshToken }),
    });
    if (refreshB.status !== 200) {
      throw new Error(`Device B token was erroneously revoked! Received ${refreshB.status}`);
    }
  });

  // Print Summary
  console.log(`\n${colors.bold}=== SESSION SECURITY TEST SUMMARY ===${colors.reset}`);
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
