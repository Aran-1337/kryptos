const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const TeamMember = require('../src/modules/team/team.model');
const Course = require('../src/modules/courses/course.model');
const Section = require('../src/modules/sections/section.model');
const Lesson = require('../src/modules/lessons/lesson.model');
const Book = require('../src/modules/books/book.model');
const Order = require('../src/modules/orders/order.model');
const Certificate = require('../src/modules/certificates/certificate.model');
const Review = require('../src/modules/reviews/review.model');
const { Quiz } = require('../src/modules/quizzes/quiz.model');
const LiveSession = require('../src/modules/liveSessions/liveSession.model');
const { generateAccessToken } = require('../src/utils/jwt');
const { resetAllLimiters } = require('../src/middlewares/rateLimiter.middleware');
const orderService = require('../src/modules/orders/order.service');

let mongoServer;
let server;
let baseUrl;

// Test fixtures
let studentA, studentB;
let instructorA, instructorB;
let adminUser;
let teamMemberCourse, teamMemberGeneral;

let tokenStudentA, tokenStudentB;
let tokenInstructorA, tokenInstructorB;
let tokenAdmin;
let tokenTeamCourse, tokenTeamGeneral;

let courseA, courseB;
let sectionB, lessonB;
let bookB;
let orderB;
let certB;
let reviewB;
let liveSessionB;
let quizB;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up Authorization / IDOR / Business Logic Test Environment ===${colors.reset}`);

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
    Section.deleteMany({}),
    Lesson.deleteMany({}),
    Book.deleteMany({}),
    Order.deleteMany({}),
    Certificate.deleteMany({}),
    Review.deleteMany({}),
    Quiz.deleteMany({}),
    LiveSession.deleteMany({}),
  ]);

  const commonUserData = {
    fatherName: 'Father',
    grade: 'grade1',
    governorate: 'Cairo',
    educationType: 'arabic',
    gender: 'male',
    guardian: { fullName: 'Guardian Test', relation: 'father', phone: '01019998887' },
    acceptTerms: true,
    acceptPrivacy: true,
    isEmailVerified: true,
    isActive: true,
  };

  // Seed Students
  studentA = await User.create({
    firstName: 'Student',
    lastName: 'Alpha',
    email: 'student.a@test.com',
    phone: '01010000001',
    password: 'Password123!',
    role: 'student',
    ...commonUserData,
  });

  studentB = await User.create({
    firstName: 'Student',
    lastName: 'Beta',
    email: 'student.b@test.com',
    phone: '01010000002',
    password: 'Password123!',
    role: 'student',
    ...commonUserData,
  });

  // Seed Instructors
  instructorA = await User.create({
    firstName: 'Instructor',
    lastName: 'Alpha',
    email: 'instructor.a@test.com',
    phone: '01020000001',
    password: 'Password123!',
    role: 'instructor',
    permissions: ['courses', 'exams', 'live', 'books', 'analytics'],
    ...commonUserData,
  });

  instructorB = await User.create({
    firstName: 'Instructor',
    lastName: 'Beta',
    email: 'instructor.b@test.com',
    phone: '01020000002',
    password: 'Password123!',
    role: 'instructor',
    permissions: ['courses', 'exams', 'live', 'books', 'analytics'],
    ...commonUserData,
  });

  // Seed Admin
  adminUser = await User.create({
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin.idor@test.com',
    phone: '01030000001',
    password: 'Password123!',
    role: 'admin',
    permissions: ['*'],
    ...commonUserData,
  });

  // Seed Team Members
  teamMemberCourse = await TeamMember.create({
    name: 'Course Assistant',
    email: 'assistant.course@test.com',
    role: 'assistant',
    permissions: ['courses'],
    isAccepted: true,
  });

  teamMemberGeneral = await TeamMember.create({
    name: 'Team Admin Assistant',
    email: 'assistant.general@test.com',
    role: 'assistant',
    permissions: ['team'],
    isAccepted: true,
  });

  // Generate tokens
  tokenStudentA = generateAccessToken(studentA);
  tokenStudentB = generateAccessToken(studentB);
  tokenInstructorA = generateAccessToken(instructorA);
  tokenInstructorB = generateAccessToken(instructorB);
  tokenAdmin = generateAccessToken(adminUser);
  tokenTeamCourse = generateAccessToken(teamMemberCourse, 'assistant', { type: 'team_member' });
  tokenTeamGeneral = generateAccessToken(teamMemberGeneral, 'assistant', { type: 'team_member' });

  // Seed Resources for Instructor A
  courseA = await Course.create({
    title: 'Course Alpha by Instructor A',
    description: 'Description for Course A',
    instructor: instructorA._id,
    category: 'Development',
    price: 100,
    isPublished: true,
    totalStudents: 0,
  });

  // Seed Resources for Instructor B
  courseB = await Course.create({
    title: 'Course Beta by Instructor B',
    description: 'Description for Course B',
    instructor: instructorB._id,
    category: 'Development',
    price: 150,
    isPublished: true,
    totalStudents: 0,
  });

  sectionB = await Section.create({
    title: 'Section 1 for Course B',
    course: courseB._id,
    order: 1,
  });
  await Course.findByIdAndUpdate(courseB._id, { $push: { sections: sectionB._id } });

  lessonB = await Lesson.create({
    title: 'Lesson 1 for Course B',
    section: sectionB._id,
    course: courseB._id,
    isFree: false,
    order: 1,
    video: {
      publicId: 'lessons/video_beta_123',
      secureUrl: 'https://cloudinary.com/video_beta_123.mp4',
      duration: 600,
    },
  });

  bookB = await Book.create({
    title: 'Book Beta by Instructor B',
    description: 'Description for Book B',
    author: 'Author Beta',
    instructor: instructorB._id,
    price: 50,
    isFree: false,
    category: 'Security',
    isPublished: true,
    pdf: { publicId: 'books/pdf_beta_123', secureUrl: 'https://cloudinary.com/book_beta.pdf' },
  });

  // Seed Order for Student B
  orderB = await Order.create({
    user: studentB._id,
    items: [{ itemType: 'course', item: courseB._id, price: 150, title: courseB.title }],
    totalAmount: 150,
    status: 'pending',
  });

  // Seed Certificate for Student B
  certB = await Certificate.create({
    user: studentB._id,
    course: courseB._id,
    certificateId: 'CERT-BETA-777',
    pdf: { publicId: 'certificates/cert_beta_777', secureUrl: 'https://cloudinary.com/cert_beta.pdf' },
  });

  // Seed Review by Student B on Course B
  reviewB = await Review.create({
    user: studentB._id,
    course: courseB._id,
    rating: 5,
    comment: 'Great course by Instructor B',
  });

  // Seed Quiz by Instructor B on Course B
  quizB = await Quiz.create({
    title: 'Quiz Beta for Course B',
    course: courseB._id,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        question: 'What is 2 + 2?',
        type: 'multiple_choice',
        points: 10,
        options: [{ text: '4', isCorrect: true }, { text: '5', isCorrect: false }],
      },
    ],
  });

  // Seed LiveSession by Instructor B
  liveSessionB = await LiveSession.create({
    title: 'Live Session Beta',
    instructor: instructorB._id,
    platform: 'zoom',
    meetingLink: 'https://zoom.us/j/999888777',
    startDate: new Date(Date.now() + 86400000),
    duration: 60,
    status: 'scheduled',
  });

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
  console.log(`  ${colors.green}✓ PASS:${colors.reset} ${testName}`);
}

function fail(testName, err) {
  failedCount++;
  console.log(`  ${colors.red}✗ FAIL:${colors.reset} ${testName}`);
  console.log(`    ${colors.red}Error: ${err.message}${colors.reset}`);
}

async function runTests() {
  console.log(`\n${colors.yellow}${colors.bold}=== RUNNING PHASE 2H — AUTHORIZATION / IDOR / BUSINESS LOGIC SECURITY SUITE ===${colors.reset}\n`);

  // ───────────────────────────────────────────────────────────────────────────
  // Test 1: User A cannot read User B private resource (Order & Certificate)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // 1a: Student A attempts to read Student B's order
    const orderRes = await fetch(`${baseUrl}/api/v1/orders/${orderB._id}`, {
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(orderRes.status === 403, `Expected 403 on private order read, got ${orderRes.status}`);

    // 1b: Student A attempts to download Student B's certificate
    const certRes = await fetch(`${baseUrl}/api/v1/certificates/${certB._id}/download`, {
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(certRes.status === 403, `Expected 403 on private certificate download, got ${certRes.status}`);

    pass('Test 1: User A cannot read User B private resources (Order & Certificate blocked with 403)');
  } catch (err) {
    fail('Test 1: User A cannot read User B private resources', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 2: User A cannot modify User B resource (Profile & Progress isolation)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Student A sends body with Student B's ID to profile
    const profileRes = await fetch(`${baseUrl}/api/v1/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({ userId: studentB._id.toString(), firstName: 'Tampered' }),
    });
    assert(profileRes.status === 200, `Expected 200, got ${profileRes.status}`);

    // Verify Student B's name is completely untouched
    const freshStudentB = await User.findById(studentB._id);
    assert(freshStudentB.firstName === 'Student', 'Student B profile must not be modified');
    assert(freshStudentB.lastName === 'Beta', 'Student B profile must remain intact');

    pass('Test 2: User A cannot modify User B profile; identity remains isolated to token owner');
  } catch (err) {
    fail('Test 2: User A cannot modify User B resource', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 3: User A cannot delete User B resource (Review deletion)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}/reviews/${reviewB._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(res.status === 403, `Expected 403, got ${res.status}`);

    // Ensure review still exists in DB
    const reviewExists = await Review.findById(reviewB._id);
    assert(reviewExists !== null, 'Review must still exist after unauthorized delete attempt');

    pass('Test 3: User A cannot delete User B review (403 Forbidden)');
  } catch (err) {
    fail('Test 3: User A cannot delete User B resource', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 4: Instructor A cannot modify Instructor B course
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructorA}`,
      },
      body: JSON.stringify({ title: 'Instructor A Was Here' }),
    });
    assert(res.status === 403, `Expected 403, got ${res.status}`);

    const freshCourseB = await Course.findById(courseB._id);
    assert(freshCourseB.title === 'Course Beta by Instructor B', 'Course title must not change');

    pass('Test 4: Instructor A cannot modify Instructor B course (403 Forbidden)');
  } catch (err) {
    fail('Test 4: Instructor A cannot modify Instructor B course', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 5: Instructor A cannot modify Instructor B lesson
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}/sections/${sectionB._id}/lessons/${lessonB._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructorA}`,
      },
      body: JSON.stringify({ title: 'Hijacked Lesson Title' }),
    });
    assert(res.status === 403, `Expected 403, got ${res.status}`);

    const freshLessonB = await Lesson.findById(lessonB._id);
    assert(freshLessonB.title === 'Lesson 1 for Course B', 'Lesson title must not change');

    pass('Test 5: Instructor A cannot modify Instructor B lesson (403 Forbidden)');
  } catch (err) {
    fail('Test 5: Instructor A cannot modify Instructor B lesson', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 6: Instructor A cannot modify Instructor B book
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/books/${bookB._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructorA}`,
      },
      body: JSON.stringify({ title: 'Hijacked Book Title' }),
    });
    assert(res.status === 403, `Expected 403, got ${res.status}`);

    const freshBookB = await Book.findById(bookB._id);
    assert(freshBookB.title === 'Book Beta by Instructor B', 'Book title must not change');

    pass('Test 6: Instructor A cannot modify Instructor B book (403 Forbidden)');
  } catch (err) {
    fail('Test 6: Instructor A cannot modify Instructor B book', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 7: Student cannot access instructor/admin operations
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const resCourse = await fetch(`${baseUrl}/api/v1/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({
        title: 'Unauthorized Course by Student',
        description: 'Should fail',
        category: 'Development',
        price: 50,
      }),
    });
    assert(resCourse.status === 403, `Expected 403 for student createCourse, got ${resCourse.status}`);

    const resBook = await fetch(`${baseUrl}/api/v1/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({
        title: 'Unauthorized Book by Student',
        description: 'Should fail',
        category: 'Development',
        price: 25,
      }),
    });
    assert(resBook.status === 403, `Expected 403 for student createBook, got ${resBook.status}`);

    pass('Test 7: Student cannot perform instructor/admin operations (403 Forbidden on Course & Book creation)');
  } catch (err) {
    fail('Test 7: Student cannot access instructor/admin operations', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 8: Lower-role user cannot perform admin operation (User ban & Student list)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const resBan = await fetch(`${baseUrl}/api/v1/users/${studentB._id}/ban`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(resBan.status === 403, `Expected 403 on ban attempt by student, got ${resBan.status}`);

    const resBanByInstructor = await fetch(`${baseUrl}/api/v1/users/${studentB._id}/ban`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenInstructorA}` },
    });
    assert(resBanByInstructor.status === 403, `Expected 403 on ban attempt by instructor, got ${resBanByInstructor.status}`);

    pass('Test 8: Lower-role users (Student, Instructor) cannot perform admin operations (403 Forbidden)');
  } catch (err) {
    fail('Test 8: Lower-role user cannot perform admin operation', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 9: Cross-team resource access is blocked (Team list & invite)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const resStudent = await fetch(`${baseUrl}/api/v1/team`, {
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(resStudent.status === 403, `Expected 403 for student on /team, got ${resStudent.status}`);

    const resInstructor = await fetch(`${baseUrl}/api/v1/team`, {
      headers: { Authorization: `Bearer ${tokenInstructorA}` },
    });
    assert(resInstructor.status === 403, `Expected 403 for instructor on /team, got ${resInstructor.status}`);

    pass('Test 9: Cross-team resource access is blocked for non-team/non-admin roles (403 Forbidden)');
  } catch (err) {
    fail('Test 9: Cross-team resource access is blocked', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 10: Cross-team modification is blocked (Unauthorized permission update)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Assistant with only 'courses' attempts to update team permissions
    const res = await fetch(`${baseUrl}/api/v1/team/${teamMemberGeneral._id}/permissions`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenTeamCourse}`,
      },
      body: JSON.stringify({ permissions: ['payments', 'team'] }),
    });
    assert(res.status === 403, `Expected 403 on unauthorized permission modification, got ${res.status}`);

    // Assistant with 'team' attempts to modify their own permissions (self-elevation)
    const selfRes = await fetch(`${baseUrl}/api/v1/team/${teamMemberGeneral._id}/permissions`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenTeamGeneral}`,
      },
      body: JSON.stringify({ permissions: ['payments', 'team', 'students'] }),
    });
    assert(selfRes.status === 403, `Expected 403 on self-permission update, got ${selfRes.status}`);

    pass('Test 10: Cross-team modification and self-privilege escalation are strictly blocked (403 Forbidden)');
  } catch (err) {
    fail('Test 10: Cross-team modification is blocked', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 11: Cross-team deletion is blocked & self-deletion prevented
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Assistant without 'team' permission attempts to delete team member
    const resUnauthorized = await fetch(`${baseUrl}/api/v1/team/${teamMemberGeneral._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenTeamCourse}` },
    });
    assert(resUnauthorized.status === 403, `Expected 403, got ${resUnauthorized.status}`);

    // Team assistant attempts to delete themselves
    const resSelf = await fetch(`${baseUrl}/api/v1/team/${teamMemberGeneral._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenTeamGeneral}` },
    });
    assert(resSelf.status === 400, `Expected 400 on self-delete, got ${resSelf.status}`);

    pass('Test 11: Cross-team deletion and self-account deletion from admin panel are blocked');
  } catch (err) {
    fail('Test 11: Cross-team deletion is blocked', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 12: URL ID replacement cannot bypass ownership (Payment initiate)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const res = await fetch(`${baseUrl}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({ orderId: orderB._id.toString(), gateway: 'manual' }),
    });
    assert(res.status === 403, `Expected 403 on URL/body ID substitution, got ${res.status}`);

    pass('Test 12: URL / Body ID replacement cannot bypass ownership on payment initiation (403 Forbidden)');
  } catch (err) {
    fail('Test 12: URL ID replacement cannot bypass ownership', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 13: Body owner/userId cannot bypass ownership on create/update
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Instructor A attempts to update course with instructor: instructorB._id
    const resUpdate = await fetch(`${baseUrl}/api/v1/courses/${courseA._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructorA}`,
      },
      body: JSON.stringify({ instructor: instructorB._id.toString() }),
    });
    // Mass assignment prevention should reject field modification with 400
    assert(resUpdate.status === 400, `Expected 400 for instructor mass assignment, got ${resUpdate.status}`);

    // Course owner remains Instructor A
    const freshCourseA = await Course.findById(courseA._id);
    assert(freshCourseA.instructor.toString() === instructorA._id.toString(), 'Course instructor must remain Instructor A');

    pass('Test 13: Body instructor/owner field injection cannot bypass or alter ownership (400 Bad Request)');
  } catch (err) {
    fail('Test 13: Body owner/userId cannot bypass ownership', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 14: Unauthorized upload to another user's resource is blocked
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Instructor A attempts to upload thumbnail to Instructor B's course
    const boundary = '----WebKitFormBoundaryIDORTest14';
    const body = `${boundary}\r\nContent-Disposition: form-data; name="thumbnail"; filename="pic.jpg"\r\nContent-Type: image/jpeg\r\n\r\n\xFF\xD8\xFF\xE0FakeJPEG\r\n${boundary}--\r\n`;

    const res = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}/thumbnail`, {
      method: 'PATCH',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary.slice(2)}`,
        Authorization: `Bearer ${tokenInstructorA}`,
      },
      body,
    });
    assert(res.status === 403, `Expected 403, got ${res.status}`);

    pass("Test 14: Unauthorized upload to another instructor's course thumbnail is blocked (403 Forbidden)");
  } catch (err) {
    fail("Test 14: Unauthorized upload to another user's resource is blocked", err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 15: Unauthorized media replacement is blocked (Book cover / Lesson video)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    const boundary = '----WebKitFormBoundaryIDORTest15';
    const body = `${boundary}\r\nContent-Disposition: form-data; name="cover"; filename="pic.jpg"\r\nContent-Type: image/jpeg\r\n\r\n\xFF\xD8\xFF\xE0FakeJPEG\r\n${boundary}--\r\n`;

    const resBook = await fetch(`${baseUrl}/api/v1/books/${bookB._id}/cover`, {
      method: 'PATCH',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary.slice(2)}`,
        Authorization: `Bearer ${tokenInstructorA}`,
      },
      body,
    });
    assert(resBook.status === 403, `Expected 403 for book cover replacement, got ${resBook.status}`);

    pass("Test 15: Unauthorized media replacement on another instructor's book is blocked (403 Forbidden)");
  } catch (err) {
    fail('Test 15: Unauthorized media replacement is blocked', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 16: Illegal business-state transition is blocked (LiveSession state machine)
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Advance session to 'ended'
    liveSessionB.status = 'ended';
    await liveSessionB.save();

    // Instructor B attempts illegal transition 'ended' -> 'live'
    const resIllegal = await fetch(`${baseUrl}/api/v1/live-sessions/${liveSessionB._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructorB}`,
      },
      body: JSON.stringify({ status: 'live' }),
    });
    assert(resIllegal.status === 400, `Expected 400 for illegal state transition, got ${resIllegal.status}`);

    const freshSession = await LiveSession.findById(liveSessionB._id);
    assert(freshSession.status === 'ended', 'Live session status must remain ended');

    pass('Test 16: Illegal business-state machine transition (ended -> live) is rejected with 400 Bad Request');
  } catch (err) {
    fail('Test 16: Illegal business-state transition is blocked', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 17: Unauthorized payment/order modification is blocked
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // 17a: Student attempts to approve manual payment
    const resStudentApprove = await fetch(`${baseUrl}/api/v1/orders/${orderB._id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenStudentA}`,
      },
      body: JSON.stringify({ method: 'cash' }),
    });
    assert(resStudentApprove.status === 403, `Expected 403 on payment approval by student, got ${resStudentApprove.status}`);

    // 17b: Transitioning an order from refunded -> completed is rejected by service
    const refundedOrder = await Order.create({
      user: studentB._id,
      items: [{ itemType: 'course', item: courseB._id, price: 150, title: courseB.title }],
      totalAmount: 150,
      status: 'refunded',
    });

    let threwExpectedError = false;
    try {
      await orderService.completeOrder(refundedOrder._id, { method: 'manual', gateway: 'manual' });
    } catch (err) {
      threwExpectedError = err.message.includes('لا يمكن إكمال طلب بحالة');
    }
    assert(threwExpectedError, 'Service must reject completing a refunded order');

    pass('Test 17: Unauthorized order approval and illegal order state transitions are strictly blocked');
  } catch (err) {
    fail('Test 17: Unauthorized payment/order modification is blocked', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 18: DELETE authorization is enforced across resources
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // 18a: Instructor A cannot delete Instructor B's course
    const resCourseDel = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenInstructorA}` },
    });
    assert(resCourseDel.status === 403, `Expected 403 for course delete, got ${resCourseDel.status}`);

    // 18b: Instructor A cannot delete Instructor B's lesson
    const resLessonDel = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}/sections/${sectionB._id}/lessons/${lessonB._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenInstructorA}` },
    });
    assert(resLessonDel.status === 403, `Expected 403 for lesson delete, got ${resLessonDel.status}`);

    // 18c: Instructor A cannot delete Instructor B's book
    const resBookDel = await fetch(`${baseUrl}/api/v1/books/${bookB._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenInstructorA}` },
    });
    assert(resBookDel.status === 403, `Expected 403 for book delete, got ${resBookDel.status}`);

    // 18d: Instructor A cannot delete Instructor B's live session
    const resLiveDel = await fetch(`${baseUrl}/api/v1/live-sessions/${liveSessionB._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenInstructorA}` },
    });
    assert(resLiveDel.status === 403, `Expected 403 for live session delete, got ${resLiveDel.status}`);

    // 18e: Instructor A cannot delete Instructor B's quiz
    const resQuizDel = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}/quizzes/${quizB._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenInstructorA}` },
    });
    assert(resQuizDel.status === 403, `Expected 403 for quiz delete, got ${resQuizDel.status}`);

    pass('Test 18: DELETE authorization is strictly enforced across courses, lessons, books, live sessions, and quizzes');
  } catch (err) {
    fail('Test 18: DELETE authorization is enforced', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 19: Private resource enumeration is controlled
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // Non-existent course with valid ObjectId returns 404
    const nonExistentId = new mongoose.Types.ObjectId();
    const res404 = await fetch(`${baseUrl}/api/v1/courses/${nonExistentId}`);
    assert(res404.status === 404, `Expected 404, got ${res404.status}`);

    // Existing private order belonging to another user returns 403 Forbidden
    const res403 = await fetch(`${baseUrl}/api/v1/orders/${orderB._id}`, {
      headers: { Authorization: `Bearer ${tokenStudentA}` },
    });
    assert(res403.status === 403, `Expected 403, got ${res403.status}`);

    pass('Test 19: Private resource enumeration is properly controlled (404 on missing resource, 403 on private unauthorized)');
  } catch (err) {
    fail('Test 19: Private resource enumeration is controlled', err);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test 20: Legitimate owner/admin operations still succeed
  // ───────────────────────────────────────────────────────────────────────────
  try {
    clearAllRateLimits();
    // 20a: Instructor B successfully updates their own course
    const resUpdateCourse = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructorB}`,
      },
      body: JSON.stringify({ description: 'Updated by legitimate owner' }),
    });
    assert(resUpdateCourse.status === 200, `Expected 200, got ${resUpdateCourse.status}`);

    // 20b: Student B reads their own order
    const resReadOrder = await fetch(`${baseUrl}/api/v1/orders/${orderB._id}`, {
      headers: { Authorization: `Bearer ${tokenStudentB}` },
    });
    assert(resReadOrder.status === 200, `Expected 200, got ${resReadOrder.status}`);

    // 20c: Admin reads Student B's order
    const resAdminRead = await fetch(`${baseUrl}/api/v1/orders/${orderB._id}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    assert(resAdminRead.status === 200, `Expected 200, got ${resAdminRead.status}`);

    // 20d: Instructor B successfully updates their own lesson
    const resUpdateLesson = await fetch(`${baseUrl}/api/v1/courses/${courseB._id}/sections/${sectionB._id}/lessons/${lessonB._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenInstructorB}`,
      },
      body: JSON.stringify({ title: 'Updated Lesson Title by Owner' }),
    });
    assert(resUpdateLesson.status === 200, `Expected 200, got ${resUpdateLesson.status}`);

    pass('Test 20: Legitimate owner and admin operations execute successfully without false positives');
  } catch (err) {
    fail('Test 20: Legitimate owner/admin operations still succeed', err);
  }

  console.log(`\n${colors.cyan}${colors.bold}=== AUTHORIZATION / IDOR / BUSINESS LOGIC TEST SUMMARY ===${colors.reset}`);
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
