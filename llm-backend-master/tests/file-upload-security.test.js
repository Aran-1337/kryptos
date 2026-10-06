const http = require('http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const Course = require('../src/modules/courses/course.model');
const Lesson = require('../src/modules/lessons/lesson.model');
const Section = require('../src/modules/sections/section.model');
const Book = require('../src/modules/books/book.model');
const cloudinaryService = require('../src/services/cloudinary.service');
const { generateAccessToken } = require('../src/utils/jwt');

let mongoServer;
let server;
let baseUrl;

// Fixtures
let adminUser;
let instructorA;
let instructorB;
let studentUser;
let courseA;
let sectionA;
let lessonA;
let bookA;

// Tokens
let adminToken;
let instructorAToken;
let instructorBToken;
let studentToken;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Valid binary signatures
const validPngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52]);
const validJpgBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
const validPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
const validMp4Buffer = Buffer.concat([Buffer.from([0x00, 0x00, 0x00, 0x20]), Buffer.from('ftypisom'), Buffer.alloc(20)]);

async function setup() {
  console.log(`${colors.cyan}${colors.bold}=== Setting up File Upload & Media Security Test Environment ===${colors.reset}`);

  const cloudinary = require('../src/config/cloudinary');
  const stream = require('stream');
  cloudinary.uploader.upload_stream = (options, callback) => {
    const writable = new stream.Writable({
      write(chunk, enc, next) { next(); }
    });
    writable.on('finish', () => {
      if (typeof callback === 'function') {
        callback(null, {
          public_id: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/mock.png',
          duration: 120,
          bytes: 1024,
          format: 'png',
          eager: [{ secure_url: 'https://res.cloudinary.com/demo/thumb.jpg' }],
        });
      }
    });
    return writable;
  };
  cloudinary.uploader.destroy = async () => ({ result: 'ok' });

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

  // 1. Admin
  adminUser = await User.create({
    firstName: 'Admin', fatherName: 'Media', lastName: 'Master',
    name: 'Admin Media Master', email: 'admin.media@mnasa.com',
    phone: '01011110001', password: 'Password123!', role: 'admin',
    grade: 'grade1', educationType: 'arabic', gender: 'male', governorate: 'Cairo',
    guardian: { fullName: 'Guardian', relation: 'father', phone: '01011110002' },
    acceptTerms: true, acceptPrivacy: true,
  });
  adminToken = generateAccessToken(adminUser);

  // 2. Instructor A
  instructorA = await User.create({
    firstName: 'Instructor', fatherName: 'One', lastName: 'Alpha',
    name: 'Instructor Alpha', email: 'inst.a@mnasa.com',
    phone: '01022220001', password: 'Password123!', role: 'instructor',
    grade: 'grade1', educationType: 'arabic', gender: 'male', governorate: 'Cairo',
    guardian: { fullName: 'Guardian', relation: 'father', phone: '01022220002' },
    acceptTerms: true, acceptPrivacy: true,
  });
  instructorAToken = generateAccessToken(instructorA);

  // 3. Instructor B
  instructorB = await User.create({
    firstName: 'Instructor', fatherName: 'Two', lastName: 'Beta',
    name: 'Instructor Beta', email: 'inst.b@mnasa.com',
    phone: '01033330001', password: 'Password123!', role: 'instructor',
    grade: 'grade1', educationType: 'arabic', gender: 'male', governorate: 'Cairo',
    guardian: { fullName: 'Guardian', relation: 'father', phone: '01033330002' },
    acceptTerms: true, acceptPrivacy: true,
  });
  instructorBToken = generateAccessToken(instructorB);

  // 4. Student
  studentUser = await User.create({
    firstName: 'Student', fatherName: 'Samir', lastName: 'Ali',
    name: 'Student Samir Ali', email: 'student.upload@mnasa.com',
    phone: '01044440001', password: 'Password123!', role: 'student',
    grade: 'grade1', educationType: 'arabic', gender: 'male', governorate: 'Giza',
    guardian: { fullName: 'Guardian', relation: 'father', phone: '01044440002' },
    acceptTerms: true, acceptPrivacy: true,
  });
  studentToken = generateAccessToken(studentUser);

  // 5. Course owned by Instructor A
  courseA = await Course.create({
    title: 'Alpha Physics Course',
    description: 'Alpha syllabus',
    category: 'Physics',
    price: 200,
    instructor: instructorA._id,
    isPublished: true,
  });

  sectionA = await Section.create({
    title: 'Section 1',
    course: courseA._id,
  });

  lessonA = await Lesson.create({
    title: 'Lesson 1',
    course: courseA._id,
    section: sectionA._id,
  });

  // 6. Paid Book owned by Instructor A
  bookA = await Book.create({
    title: 'Advanced Mechanics Book',
    category: 'Physics',
    author: 'Dr. Alpha',
    price: 150,
    isFree: false,
    instructor: instructorA._id,
    isPublished: true,
    pdf: { publicId: 'pdf_sample_123', secureUrl: 'https://res.cloudinary.com/sample.pdf' },
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

  console.log(`${colors.yellow}${colors.bold}=== RUNNING FILE UPLOAD & MEDIA SECURITY TEST SUITE ===${colors.reset}\n`);

  try {
    // ── Test 1: Allowed File Size & Valid Upload ───────────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), 'avatar.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(res.status === 200, 'Test 1: Allowed file size and valid media upload succeeds (200 OK)');
    }

    // ── Test 2: Oversized File Rejection ──────────────────────────────────
    {
      // 6MB buffer exceeds the 5MB image limit
      const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024);
      validJpgBuffer.copy(oversizedBuffer, 0, 0, validJpgBuffer.length);

      const formData = new FormData();
      formData.append('avatar', new Blob([oversizedBuffer], { type: 'image/jpeg' }), 'large.jpg');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(
        res.status === 400,
        'Test 2: Oversized file exceeding limit is rejected with 400 Bad Request (not 500 error)'
      );
    }

    // ── Test 3: Allowed MIME Types ─────────────────────────────────────────
    {
      const formData = new FormData();
      formData.append('thumbnail', new Blob([validJpgBuffer], { type: 'image/jpeg' }), 'thumb.jpg');

      const res = await fetch(`${baseUrl}/courses/${courseA._id}/thumbnail`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${instructorAToken}` },
        body: formData,
      });

      assert(res.status === 200, 'Test 3: Allowed MIME type (image/jpeg) successfully accepted (200 OK)');
    }

    // ── Test 4: Disallowed MIME Type Rejection ─────────────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([Buffer.from('binary-data')], { type: 'application/x-msdownload' }), 'app.exe');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(res.status === 400, 'Test 4: Disallowed MIME type (application/x-msdownload) is rejected (400 Bad Request)');
    }

    // ── Test 5: MIME Spoofing Attempt Rejection ────────────────────────────
    {
      // Declared as image/png, but body is plain text script (fails magic bytes)
      const fakePngBuffer = Buffer.from('<?php echo "malicious web shell"; ?>');
      const formData = new FormData();
      formData.append('avatar', new Blob([fakePngBuffer], { type: 'image/png' }), 'hacked.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(
        res.status === 400,
        'Test 5: MIME spoofing attempt (fake signature) is rejected by magic bytes verification (400 Bad Request)'
      );
    }

    // ── Test 6: Path Traversal Filename Protection ─────────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), '..traversal.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(res.status === 400, 'Test 6: Path traversal attempt in filename is blocked (400 Bad Request)');
    }

    // ── Test 7: Double Extension Rejection ─────────────────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), 'exploit.php.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(
        res.status === 400,
        'Test 7: Double extension filename (e.g. exploit.php.png) is strictly rejected (400 Bad Request)'
      );
    }

    // ── Test 8: Dangerous Extension Rejection ──────────────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), 'backdoor.exe');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(res.status === 400, 'Test 8: Dangerous file extension (.exe) is rejected (400 Bad Request)');
    }

    // ── Test 9: Null / Control Characters in Filename ──────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), 'evil\x00file.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(res.status === 400, 'Test 9: Filename containing null bytes or control characters is blocked (400 Bad Request)');
    }

    // ── Test 10: Unauthenticated Upload Rejection ──────────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), 'avatar.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        body: formData,
      });

      assert(res.status === 401, 'Test 10: Unauthenticated file upload is rejected (401 Unauthorized)');
    }

    // ── Test 11: Unauthorized Role / Permission Rejection ─────────────────
    {
      const formData = new FormData();
      formData.append('thumbnail', new Blob([validJpgBuffer], { type: 'image/jpeg' }), 'thumb.jpg');

      const res = await fetch(`${baseUrl}/courses/${courseA._id}/thumbnail`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(res.status === 403, 'Test 11: Student attempting to upload course thumbnail is rejected (403 Forbidden)');
    }

    // ── Test 12: Authorized Upload (Admin or Owner) ────────────────────────
    {
      const formData = new FormData();
      formData.append('thumbnail', new Blob([validJpgBuffer], { type: 'image/jpeg' }), 'admin_thumb.jpg');

      const res = await fetch(`${baseUrl}/courses/${courseA._id}/thumbnail`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });

      assert(res.status === 200, 'Test 12: Authorized admin/owner upload succeeds (200 OK)');
    }

    // ── Test 13: Course Ownership Check (Instructor Isolation) ────────────
    {
      // Instructor B tries to upload preview video to Instructor A's course
      const formData = new FormData();
      formData.append('video', new Blob([validMp4Buffer], { type: 'video/mp4' }), 'preview.mp4');

      const res = await fetch(`${baseUrl}/courses/${courseA._id}/preview-video`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${instructorBToken}` },
        body: formData,
      });

      assert(
        res.status === 403,
        'Test 13: Instructor cannot upload preview video to another instructor course (403 Forbidden)'
      );
    }

    // ── Test 14: Lesson Video Ownership Check ──────────────────────────────
    {
      // Instructor B tries to upload video to lesson in Instructor A's course
      const formData = new FormData();
      formData.append('video', new Blob([validMp4Buffer], { type: 'video/mp4' }), 'lesson.mp4');

      const res = await fetch(`${baseUrl}/courses/${courseA._id}/sections/${sectionA._id}/lessons/${lessonA._id}/video`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${instructorBToken}` },
        body: formData,
      });

      assert(
        res.status === 403,
        'Test 14: Instructor cannot upload video to another instructor lesson (403 Forbidden)'
      );
    }

    // ── Test 15: Book Cover Ownership Check ────────────────────────────────
    {
      // Instructor B tries to update Instructor A's book cover
      const formData = new FormData();
      formData.append('cover', new Blob([validPngBuffer], { type: 'image/png' }), 'cover.png');

      const res = await fetch(`${baseUrl}/books/${bookA._id}/cover`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${instructorBToken}` },
        body: formData,
      });

      assert(
        res.status === 403,
        'Test 15: Instructor cannot overwrite cover of another instructor book (403 Forbidden)'
      );
    }

    // ── Test 16: Unexpected Field Rejection ────────────────────────────────
    {
      const formData = new FormData();
      formData.append('unrecognized_payload', new Blob([validPngBuffer], { type: 'image/png' }), 'test.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(
        res.status === 400,
        'Test 16: Multer rejects unexpected field name with 400 Bad Request (not 500 error)'
      );
    }

    // ── Test 17: Multiple Files Limit ─────────────────────────────────────
    {
      const formData = new FormData();
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), 'avatar1.png');
      formData.append('avatar', new Blob([validPngBuffer], { type: 'image/png' }), 'avatar2.png');

      const res = await fetch(`${baseUrl}/users/profile/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: formData,
      });

      assert(
        res.status === 400,
        'Test 17: Sending multiple files when single file is expected is rejected (400 Bad Request)'
      );
    }

    // ── Test 18: Private File Access Protection ───────────────────────────
    {
      // Student has not purchased bookA -> cannot get download signed URL
      const res = await fetch(`${baseUrl}/books/${bookA._id}/download`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });

      assert(
        res.status === 403,
        'Test 18: Unpurchased private book download is protected and blocked (403 Forbidden)'
      );
    }

  } catch (err) {
    console.error('Unexpected test error:', err);
    failed++;
  }

  console.log(`\n${colors.cyan}${colors.bold}=== FILE UPLOAD SECURITY TEST SUMMARY ===${colors.reset}`);
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
