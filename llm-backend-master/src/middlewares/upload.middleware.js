const multer = require('multer');
const AppError = require('../utils/AppError');
const {
  ALLOWED_MEDIA_TYPES,
  validateFilename,
  verifyFileMagicBytes,
} = require('../utils/mediaSecurity');

// Use memory storage for direct streaming to Cloudinary
const storage = multer.memoryStorage();

/**
 * Creates a hardened fileFilter for a specific media category
 */
const createSecureFileFilter = (category) => {
  const config = ALLOWED_MEDIA_TYPES[category];
  return (req, file, cb) => {
    // 1. Validate MIME type against strict allowlist
    if (!config.mimes.includes(file.mimetype)) {
      return cb(
        new AppError(
          `نوع الملف (${file.mimetype}) غير مسموح به. الأنواع المسموحة: ${config.mimes.join(', ')}`,
          400
        ),
        false
      );
    }

    // 2. Validate filename, path traversal, dangerous extensions, and double extensions
    const validation = validateFilename(file.originalname, config.extensions);
    if (!validation.valid) {
      return cb(new AppError(validation.reason, 400), false);
    }

    // Store sanitized filename on file object
    file.sanitizedName = validation.cleanName;
    cb(null, true);
  };
};

// ─── Image Upload Middleware ──────────────────────────────────────────────────
const uploadImage = multer({
  storage,
  limits: {
    fileSize: ALLOWED_MEDIA_TYPES.image.maxSize, // 5MB
    files: 1,
    fields: 10,
    parts: 20,
  },
  fileFilter: createSecureFileFilter('image'),
});

// ─── Video Upload Middleware ──────────────────────────────────────────────────
const uploadVideo = multer({
  storage,
  limits: {
    fileSize: ALLOWED_MEDIA_TYPES.video.maxSize, // 100MB bounded for memory safety
    files: 1,
    fields: 10,
    parts: 20,
  },
  fileFilter: createSecureFileFilter('video'),
});

// ─── PDF Document Upload Middleware ───────────────────────────────────────────
const uploadPDF = multer({
  storage,
  limits: {
    fileSize: ALLOWED_MEDIA_TYPES.pdf.maxSize, // 25MB
    files: 1,
    fields: 10,
    parts: 20,
  },
  fileFilter: createSecureFileFilter('pdf'),
});

// ─── Generic Document Upload (Strictly Restricted) ───────────────────────────
const uploadAny = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
    fields: 10,
  },
  fileFilter: (req, file, cb) => {
    const allAllowedMimes = [
      ...ALLOWED_MEDIA_TYPES.image.mimes,
      ...ALLOWED_MEDIA_TYPES.pdf.mimes,
    ];
    const allAllowedExts = [
      ...ALLOWED_MEDIA_TYPES.image.extensions,
      ...ALLOWED_MEDIA_TYPES.pdf.extensions,
    ];
    if (!allAllowedMimes.includes(file.mimetype)) {
      return cb(new AppError('نوع الملف غير مصرح به', 400), false);
    }
    const validation = validateFilename(file.originalname, allAllowedExts);
    if (!validation.valid) {
      return cb(new AppError(validation.reason, 400), false);
    }
    file.sanitizedName = validation.cleanName;
    cb(null, true);
  },
});

/**
 * Middleware: Verify File Magic Bytes / Signature to eliminate MIME spoofing
 */
const verifyMagicBytes = (category) => (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  const isValidSignature = verifyFileMagicBytes(req.file.buffer, category);
  if (!isValidSignature) {
    return next(
      new AppError(
        'محتوى الملف غير صالح أو لا يتطابق مع نوع الملف المعلن (MIME Spoofing محظور)',
        400
      )
    );
  }

  next();
};

module.exports = {
  uploadImage,
  uploadVideo,
  uploadPDF,
  uploadAny,
  verifyMagicBytes,
};
