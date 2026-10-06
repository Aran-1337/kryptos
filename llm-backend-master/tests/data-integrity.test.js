const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const Course = require('../src/modules/courses/course.model');
const Lesson = require('../src/modules/lessons/lesson.model');
const Section = require('../src/modules/sections/section.model');
const Progress = require('../src/modules/progress/progress.model');
const Order = require('../src/modules/orders/order.model');
const { Quiz } = require('../src/modules/quizzes/quiz.model');
const LiveSession = require('../src/modules/liveSessions/liveSession.model');
const { generateAccessToken } = require('../src/utils/jwt');

let mongoServer;
let server;
let baseUrl;

let adminUser;
let studentUser;
let foreignStudentUser;
let testCourse;
let testSection;
let testLessonWithVideo;
let testLessonArticle;
let foreignCourse;
let foreignLesson;
let testQuiz;

let adminToken;
let studentToken;
let foreignStudentToken;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up Data Integrity & Validation Test Environment ===${colors.reset}`);

  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`Connected to in-memory MongoDB: ${mongoUri}`);
  }

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api/v1`;
      console.log(`Test server running at: http://localhost:${port}\n`);
      resolve();
    });
  });

  // 1. Create Admin
  adminUser = await User.create({
    firstName: 'Admin',
    fatherName: 'System',
    lastName: 'Super',
    name: 'Admin System Super',
    email: 'admin.data@mnasa.com',
    phone: '01011112222',
    password: 'Password123!',
    role: 'admin',
    grade: 'grade1',
    educationType: 'arabic',
    gender: 'male',
    governorate: 'Cairo',
    guardian: { fullName: 'Admin Guardian', relation: 'father', phone: '01033334444' },
    acceptTerms: true,
    acceptPrivacy: true,
  });
  adminToken = generateAccessToken(adminUser);

  // 2. Create Course
  testCourse = await Course.create({
    title: 'Physics Advanced Course',
    description: 'Comprehensive physics syllabus',
    category: 'Physics',
    price: 350,
    instructor: adminUser._id,
    isPublished: true,
    totalLessons: 2,
  });

  // 3. Create Student enrolled in testCourse
  studentUser = await User.create({
    firstName: 'Ahmed',
    fatherName: 'Mohamed',
    lastName: 'Ali',
    name: 'Ahmed Mohamed Ali',
    email: 'ahmed.student@mnasa.com',
    phone: '01055556666',
    password: 'Password123!',
    role: 'student',
    grade: 'grade1',
    educationType: 'arabic',
    gender: 'male',
    governorate: 'Giza',
    guardian: { fullName: 'Mohamed Ali', relation: 'father', phone: '01077778888' },
    acceptTerms: true,
    acceptPrivacy: true,
    enrolledCourses: [testCourse._id],
  });
  studentToken = generateAccessToken(studentUser);

  // 4. Create Foreign Student
  foreignStudentUser = await User.create({
    firstName: 'Sara',
    fatherName: 'Khaled',
    lastName: 'Hassan',
    name: 'Sara Khaled Hassan',
    email: 'sara.foreign@mnasa.com',
    phone: '01099990000',
    password: 'Password123!',
    role: 'student',
    grade: 'grade2',
    educationType: 'languages',
    gender: 'female',
    governorate: 'Alexandria',
    guardian: { fullName: 'Khaled Hassan', relation: 'father', phone: '01012345678' },
    acceptTerms: true,
    acceptPrivacy: true,
    enrolledCourses: [],
  });
  foreignStudentToken = generateAccessToken(foreignStudentUser);

  // 5. Create Section & Lessons
  testSection = await Section.create({
    title: 'Mechanics Section',
    course: testCourse._id,
    order: 1,
  });

  testLessonWithVideo = await Lesson.create({
    title: 'Newton Laws',
    course: testCourse._id,
    section: testSection._id,
    order: 1,
    video: {
      duration: 100, // 100 seconds
    },
  });

  testLessonArticle = await Lesson.create({
    title: 'Summary Notes',
    course: testCourse._id,
    section: testSection._id,
    order: 2,
  });

  // 6. Foreign Course & Lesson
  foreignCourse = await Course.create({
    title: 'Chemistry 101',
    description: 'Basic chemistry syllabus',
    category: 'Chemistry',
    price: 200,
    instructor: adminUser._id,
    isPublished: true,
    totalLessons: 1,
  });

  foreignLesson = await Lesson.create({
    title: 'Periodic Table',
    course: foreignCourse._id,
    section: new mongoose.Types.ObjectId(),
    order: 1,
    video: { duration: 120 },
  });

  // 7. Test Quiz
  testQuiz = await Quiz.create({
    title: 'Physics Mechanics Quiz',
    course: testCourse._id,
    passingScore: 50,
    maxAttempts: 3,
    isPublished: true,
    questions: [
      {
        question: 'What is force equal to?',
        type: 'multiple_choice',
        points: 10,
        options: [
          { text: 'm * a', isCorrect: true },
          { text: 'm / a', isCorrect: false },
        ],
      },
    ],
  });
}

async function teardown() {
  console.log(`\n${colors.cyan}=== Tearing down test environment ===${colors.reset}`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ${colors.green}✓ PASS:${colors.reset} ${message}`);
      passed++;
    } else {
      console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
      failed++;
    }
  }

  console.log(`${colors.yellow}${colors.bold}=== RUNNING DATA INTEGRITY & VALIDATION SUITE ===${colors.reset}\n`);

  try {
    // ── Test 1: Progress Anti-Tampering (Client Forgery Rejection) ──────────
    {
      const res = await fetch(`${baseUrl}/progress/${testCourse._id}/lessons/${testLessonWithVideo._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ isCompleted: true, watchedSeconds: 10 }), // 10s < 80s needed for 100s video
      });
      const data = await res.json();

      const progressInDb = await Progress.findOne({ user: studentUser._id, course: testCourse._id });
      const lp = progressInDb?.lessonProgress?.find(p => p.lesson.toString() === testLessonWithVideo._id.toString());

      assert(
        res.status === 200 &&
        lp?.isCompleted === false &&
        !progressInDb.completedLessons.includes(testLessonWithVideo._id) &&
        progressInDb.completionPercentage === 0 &&
        progressInDb.isCompleted === false,
        'Test 1: Progress Anti-Tampering rejects fraudulent client isCompleted:true when watch time is under 80%'
      );
    }

    // ── Test 2: Progress Anti-Tampering (Legitimate Completion) ─────────────
    {
      const res = await fetch(`${baseUrl}/progress/${testCourse._id}/lessons/${testLessonWithVideo._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ watchedSeconds: 85 }), // 85s >= 80% of 100s
      });
      const data = await res.json();

      const progressInDb = await Progress.findOne({ user: studentUser._id, course: testCourse._id });
      const lp = progressInDb?.lessonProgress?.find(p => p.lesson.toString() === testLessonWithVideo._id.toString());

      assert(
        res.status === 200 &&
        lp?.isCompleted === true &&
        progressInDb.completedLessons.some(id => id.toString() === testLessonWithVideo._id.toString()) &&
        progressInDb.completionPercentage === 50, // 1 of 2 total lessons
        'Test 2: Progress legitimately completes lesson when watch time satisfies server-side threshold'
      );
    }

    // ── Test 3: Progress Anti-Tampering (Foreign Lesson Isolation) ──────────
    {
      const res = await fetch(`${baseUrl}/progress/${testCourse._id}/lessons/${foreignLesson._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ watchedSeconds: 120 }),
      });

      assert(
        res.status === 404,
        'Test 3: Progress rejects updating lesson that does not belong to the target course (404 Not Found)'
      );
    }

    // ── Test 4: Progress ObjectId Validation ────────────────────────────────
    {
      const res = await fetch(`${baseUrl}/progress/invalid-mongo-id/lessons/also-invalid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ watchedSeconds: 10 }),
      });

      assert(
        res.status === 400,
        'Test 4: Malformed ObjectIds in progress route return 400 Bad Request'
      );
    }

    // ── Test 5: Mass Assignment Prevention (Role Tampering) ────────────────
    {
      const res = await fetch(`${baseUrl}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ role: 'admin' }),
      });

      const userInDb = await User.findById(studentUser._id);

      assert(
        res.status === 400 && userInDb.role === 'student',
        'Test 5: Mass Assignment Prevention blocks privilege escalation attempt via PATCH /users/profile (400 Bad Request)'
      );
    }

    // ── Test 6: Mass Assignment Prevention (Permissions & Sensitive Fields)
    {
      const res = await fetch(`${baseUrl}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ permissions: ['*'], isBanned: true, wallet: 10000 }),
      });

      const userInDb = await User.findById(studentUser._id);

      assert(
        res.status === 400 && userInDb.isBanned === false,
        'Test 6: Mass Assignment Prevention blocks permissions, isBanned, and balance modifications'
      );
    }

    // ── Test 7: Allowed Profile Fields Update ───────────────────────────────
    {
      const res = await fetch(`${baseUrl}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ firstName: 'Tarek', lastName: 'Kamal' }),
      });
      const data = await res.json();
      const updatedUser = await User.findById(studentUser._id);

      assert(
        res.status === 200 &&
        updatedUser.firstName === 'Tarek' &&
        updatedUser.lastName === 'Kamal' &&
        updatedUser.name.includes('Tarek') &&
        updatedUser.role === 'student',
        'Test 7: Legitimate user profile update succeeds while maintaining data integrity'
      );
    }

    // ── Test 8: Sensitive Data Leakage Prevention ───────────────────────────
    {
      const res = await fetch(`${baseUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      const data = await res.json();
      const user = data.data?.user || {};

      assert(
        res.status === 200 &&
        user.password === undefined &&
        user.refreshTokens === undefined &&
        user.emailVerificationToken === undefined &&
        user.passwordResetToken === undefined,
        'Test 8: Sensitive security fields (password, refreshTokens, tokens) are never leaked in responses'
      );
    }

    // ── Test 9: Safe Regex Search (ReDoS / Special Characters Injection) ────
    {
      const resSpecial = await fetch(`${baseUrl}/users?search=.*`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const resParen = await fetch(`${baseUrl}/users?search=(unclosed[`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      assert(
        resSpecial.status === 200 && resParen.status === 200,
        'Test 9: Regex search escapes special characters preventing ReDoS and SyntaxErrors'
      );
    }

    // ── Test 10: Regex Search Functionality ────────────────────────────────
    {
      const res = await fetch(`${baseUrl}/users?search=sara`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      const users = data.data?.data || [];

      assert(
        res.status === 200 &&
        users.some(u => u.email === 'sara.foreign@mnasa.com') &&
        !users.some(u => u.email === 'ahmed.student@mnasa.com'),
        'Test 10: Escaped search query accurately returns matching user records'
      );
    }

    // ── Test 11: Course Validation (Negative Price) ─────────────────────────
    {
      const res = await fetch(`${baseUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: 'Invalid Course',
          description: 'Valid description',
          category: 'Math',
          price: -50,
        }),
      });

      assert(
        res.status === 400,
        'Test 11: Creating course with negative price is rejected (400 Bad Request)'
      );
    }

    // ── Test 12: Course Validation (Missing Required Fields) ────────────────
    {
      const res = await fetch(`${baseUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          category: 'Math',
          price: 100,
        }),
      });

      assert(
        res.status === 400,
        'Test 12: Creating course with missing title and description is rejected (400 Bad Request)'
      );
    }

    // ── Test 13: Course Validation (Malformed ObjectId) ────────────────────
    {
      const res = await fetch(`${baseUrl}/courses/invalid-course-id`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ title: 'New Title' }),
      });

      assert(
        res.status === 400,
        'Test 13: Malformed ObjectId in course route is rejected immediately (400 Bad Request)'
      );
    }

    // ── Test 14: Order Validation (Empty or Malformed Items) ───────────────
    {
      const resEmpty = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ items: [] }),
      });

      const resBadId = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ items: [{ courseId: 'malformed-course-id' }] }),
      });

      assert(
        resEmpty.status === 400 && resBadId.status === 400,
        'Test 14: Creating order with empty items or malformed courseId is rejected (400 Bad Request)'
      );
    }

    // ── Test 15: Order Server-Side Ownership ───────────────────────────────
    {
      // Create an order for studentUser
      const order = await Order.create({
        user: studentUser._id,
        items: [{ itemType: 'course', item: testCourse._id, price: 350, title: 'Physics' }],
        totalAmount: 350,
        status: 'pending',
      });

      // foreignStudent queries their orders
      const res = await fetch(`${baseUrl}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${foreignStudentToken}` },
      });
      const data = await res.json();
      const myOrders = data.data?.data || [];

      assert(
        res.status === 200 &&
        !myOrders.some(o => o._id.toString() === order._id.toString()),
        'Test 15: Order retrieval strictly isolates user orders preventing unauthorized access'
      );
    }

    // ── Test 16: Quiz Validation (Malformed Submission Payload) ─────────────
    {
      const resMissing = await fetch(`${baseUrl}/courses/${testCourse._id}/quizzes/${testQuiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({}), // missing answers array
      });

      const resBadId = await fetch(`${baseUrl}/courses/${testCourse._id}/quizzes/invalid-quiz-id/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ answers: [] }),
      });

      assert(
        resMissing.status === 400 && resBadId.status === 400,
        'Test 16: Quiz submit rejects missing answers array or malformed quizId (400 Bad Request, no 500 error)'
      );
    }

    // ── Test 17: Live Session Validation (Invalid Duration / Date) ──────────
    {
      const res = await fetch(`${baseUrl}/live-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: 'Live Physics Session',
          startDate: 'invalid-date',
          duration: -30,
        }),
      });

      assert(
        res.status === 400,
        'Test 17: Creating live session with invalid start date or negative duration is rejected (400 Bad Request)'
      );
    }

    // ── Test 18: Strict Pagination Bounds ──────────────────────────────────
    {
      const res = await fetch(`${baseUrl}/courses?page=-5&limit=999999`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      const pagination = data.data?.pagination || {};

      assert(
        res.status === 200 &&
        pagination.page === 1 &&
        pagination.limit === 100,
        'Test 18: Pagination bounds check normalizes page < 1 to 1 and clamps excessive limit to 100'
      );
    }

  } catch (err) {
    console.error('Unexpected test error:', err);
    failed++;
  }

  console.log(`\n${colors.cyan}${colors.bold}=== DATA INTEGRITY TEST SUMMARY ===${colors.reset}`);
  console.log(`Total:  ${passed + failed}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${failed > 0 ? colors.red : colors.green}Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error('Suite initialization error:', err);
    process.exitCode = 1;
  } finally {
    await teardown();
  }
}

main();
