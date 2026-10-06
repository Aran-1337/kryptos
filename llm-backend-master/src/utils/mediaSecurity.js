const path = require('path');

const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'bash', 'zsh', 'bin', 'run',
  'php', 'php3', 'php4', 'php5', 'phtml', 'phar',
  'js', 'mjs', 'cjs', 'ts', 'jsx', 'tsx',
  'html', 'htm', 'xhtml', 'svg', 'xml',
  'jsp', 'jspx', 'asp', 'aspx', 'cer', 'csr',
  'py', 'pyc', 'pyo', 'rb', 'pl', 'cgi',
  'jar', 'war', 'ear', 'msi', 'com', 'scr', 'vbs', 'wsf'
]);

const CHAINABLE_EXTENSIONS = new Set([
  ...DANGEROUS_EXTENSIONS,
  'jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm', 'mov', 'pdf', 'zip', 'tar', 'gz', 'rar'
]);

const ALLOWED_MEDIA_TYPES = {
  image: {
    mimes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  video: {
    mimes: ['video/mp4', 'video/webm', 'video/quicktime'],
    extensions: ['.mp4', '.webm', '.mov'],
    maxSize: 100 * 1024 * 1024, // 100MB (safe bound for memory)
  },
  pdf: {
    mimes: ['application/pdf'],
    extensions: ['.pdf'],
    maxSize: 25 * 1024 * 1024, // 25MB
  },
};

/**
 * Strips null bytes, control characters, and path separators from filenames.
 */
const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return 'file';
  // Strip null bytes and control chars
  let clean = filename.replace(/[\x00-\x1f\x7f]/g, '');
  // Normalize and take only the basename to prevent path traversal
  clean = path.basename(clean);
  // Prevent Windows reserved device names (CON, PRN, AUX, NUL, COM1-9, LPT1-9)
  const reservedRegex = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  if (reservedRegex.test(clean)) {
    clean = `safe_${clean}`;
  }
  return clean || 'file';
};

/**
 * Validates filename against allowlist and checks for double or dangerous extensions.
 */
const validateFilename = (rawFilename, allowedExtensions) => {
  if (!rawFilename || typeof rawFilename !== 'string') {
    return { valid: false, reason: 'اسم الملف غير صالح' };
  }

  // Detect path traversal attempts in raw name
  if (rawFilename.includes('..') || rawFilename.includes('/') || rawFilename.includes('\\')) {
    return { valid: false, reason: 'اسم الملف يحتوي على مسار غير مصرح به (Path Traversal)' };
  }

  // Detect null byte or control characters
  if (/[\x00-\x1f\x7f]/.test(rawFilename)) {
    return { valid: false, reason: 'اسم الملف يحتوي على رموز تحكم أو محارف غير مقبولة' };
  }

  const clean = sanitizeFilename(rawFilename);
  const parts = clean.split('.').filter(Boolean);

  if (parts.length < 2) {
    return { valid: false, reason: 'الملف يجب أن يحتوي على امتداد صالح' };
  }

  const primaryExt = '.' + parts[parts.length - 1].toLowerCase();

  // Check if primary extension is allowed
  if (!allowedExtensions.includes(primaryExt)) {
    return { valid: false, reason: `امتداد الملف (${primaryExt}) غير مصرح به` };
  }

  // Check all segments for dangerous extensions
  for (let i = 1; i < parts.length; i++) {
    const ext = parts[i].toLowerCase();
    if (DANGEROUS_EXTENSIONS.has(ext)) {
      return { valid: false, reason: `الملف يحتوي على امتداد محظور خطير (${ext})` };
    }
  }

  // Double extension detection (e.g. image.png.jpg, doc.pdf.png)
  if (parts.length > 2) {
    for (let i = 1; i < parts.length - 1; i++) {
      const middle = parts[i].toLowerCase();
      if (CHAINABLE_EXTENSIONS.has(middle)) {
        return { valid: false, reason: 'غير مسموح بأسماء الملفات ذات الامتدادات المزدوجة (Double Extension)' };
      }
    }
  }

  return { valid: true, cleanName: clean };
};

/**
 * Inspects buffer magic bytes (file signature) to detect MIME spoofing.
 */
const verifyFileMagicBytes = (buffer, category) => {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 4) return false;

  if (category === 'image') {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer.length >= 8 &&
        buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
        buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
      return true;
    }
    // WebP: RIFF .... WEBP
    if (buffer.length >= 12) {
      const riff = buffer.toString('ascii', 0, 4);
      const webp = buffer.toString('ascii', 8, 12);
      if (riff === 'RIFF' && webp === 'WEBP') return true;
    }
    return false;
  }

  if (category === 'pdf') {
    // PDF: starts with %PDF-
    if (buffer.length >= 5 && buffer.toString('ascii', 0, 5) === '%PDF-') {
      return true;
    }
    return false;
  }

  if (category === 'video') {
    // MP4 / MOV: bytes 4-8 are 'ftyp' or 'moov'
    if (buffer.length >= 8) {
      const brand = buffer.toString('ascii', 4, 8);
      if (brand === 'ftyp' || brand === 'moov') return true;
    }
    // WebM / MKV: 1A 45 DF A3
    if (buffer.length >= 4 &&
        buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3) {
      return true;
    }
    return false;
  }

  return false;
};

module.exports = {
  DANGEROUS_EXTENSIONS,
  ALLOWED_MEDIA_TYPES,
  sanitizeFilename,
  validateFilename,
  verifyFileMagicBytes,
};
