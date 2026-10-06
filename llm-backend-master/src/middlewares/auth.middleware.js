const { verifyAccessToken } = require('../utils/jwt');
const User = require('../modules/users/user.model');
const TeamMember = require('../modules/team/team.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const redis = require('../config/redis');

/**
 * Standard default permissions for system roles
 */
const ROLE_DEFAULT_PERMISSIONS = {
  admin: ['*'],
  super_admin: ['*'],
  instructor: ['courses', 'exams', 'live', 'books', 'analytics'],
  student: [],
  assistant: [],
};

/**
 * Check if a user/identity has permission
 * @param {Object} user - The unified authenticated identity (req.user)
 * @param  {...string} requiredPermissions - One or more permissions (or module names)
 * @returns {boolean}
 */
const hasPermission = (user, ...requiredPermissions) => {
  if (!user) return false;
  if (['admin', 'super_admin'].includes(user.role)) return true;
  if (user.role === 'student') return false;

  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  if (perms.includes('*')) return true;

  const required = requiredPermissions.flat();
  return required.some((perm) => {
    if (perms.includes(perm)) return true;

    // Module-level matching: module permission grants sub-action permissions
    if (perm.startsWith('orders.') && perms.includes('payments')) return true;
    if (perm.startsWith('payments.') && perms.includes('payments')) return true;
    if (perm.startsWith('courses.') && perms.includes('courses')) return true;
    if (perm.startsWith('students.') && perms.includes('students')) return true;
    if (perm.startsWith('books.') && perms.includes('books')) return true;
    if (perm.startsWith('exams.') && perms.includes('exams')) return true;
    if (perm.startsWith('live.') && perms.includes('live')) return true;
    if (perm.startsWith('cms.') && perms.includes('cms')) return true;
    if (perm.startsWith('analytics.') && perms.includes('analytics')) return true;
    if (perm.startsWith('team.') && perms.includes('team')) return true;

    return false;
  });
};

/**
 * Protect routes - verify JWT and attach unified identity (User or TeamMember) to request
 */
const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('غير مصرح. يرجى تسجيل الدخول', 401));
  }

  const token = authHeader.split(' ')[1];

  // Check if token is blacklisted (logged out)
  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) return next(new AppError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً', 401));

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('انتهت صلاحية رمز المصادقة. يرجى تسجيل الدخول مجدداً', 401));
    }
    return next(new AppError('رمز المصادقة غير صالح. يرجى تسجيل الدخول مجدداً', 401));
  }

  let identity = null;
  let identityType = null;

  // Resolve identity based on token discriminator or fallback for legacy tokens
  if (decoded.type === 'team_member') {
    identity = await TeamMember.findById(decoded.id).select('+refreshTokens');
    identityType = 'team_member';
  } else if (decoded.type === 'user') {
    identity = await User.findById(decoded.id).select('+refreshTokens');
    identityType = 'user';
  } else {
    // Backward compatibility for legacy tokens without `type`
    if (decoded.role === 'assistant') {
      identity = await TeamMember.findById(decoded.id).select('+refreshTokens');
      identityType = identity ? 'team_member' : null;
    }
    if (!identity) {
      identity = await User.findById(decoded.id).select('+refreshTokens');
      identityType = identity ? 'user' : null;
    }
    if (!identity && decoded.role !== 'assistant') {
      identity = await TeamMember.findById(decoded.id).select('+refreshTokens');
      identityType = identity ? 'team_member' : null;
    }
  }

  if (!identity) return next(new AppError('المستخدم غير موجود', 401));

  // Account state validations
  if (identity.isBanned) return next(new AppError('تم حظر هذا الحساب', 403));
  if (!identity.isActive) return next(new AppError('الحساب غير نشط', 401));
  if (identityType === 'team_member' && !identity.isAccepted) {
    return next(new AppError('لم يتم قبول الدعوة بعد', 401));
  }

  // Populate predictable unified identity structure
  identity.identityType = identityType;
  if (!identity.permissions || identity.permissions.length === 0) {
    identity.permissions = [...(ROLE_DEFAULT_PERMISSIONS[identity.role] || [])];
  } else if (['admin', 'super_admin'].includes(identity.role) && !identity.permissions.includes('*')) {
    identity.permissions.push('*');
  }

  req.user = identity;
  req.token = token;
  next();
});

/**
 * Restrict access to specific roles
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('ليس لديك صلاحية للوصول إلى هذا المورد', 403));
  }
  next();
};

/**
 * Require specific permissions (RBAC)
 */
const requirePermission = (...requiredPermissions) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('غير مصرح. يرجى تسجيل الدخول', 401));
  }

  if (!hasPermission(req.user, ...requiredPermissions)) {
    return next(new AppError('ليس لديك صلاحية لتنفيذ هذا الإجراء', 403));
  }

  next();
};

/**
 * Check if user owns the course (enrolled)
 */
const requireEnrollment = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId || req.params.id;
  const isEnrolled = req.user.enrolledCourses?.some(id => id.toString() === courseId);
  const isAdmin = ['admin', 'instructor'].includes(req.user.role);

  if (!isEnrolled && !isAdmin) {
    return next(new AppError('يجب شراء الكورس أولاً للوصول إلى هذا المحتوى', 403));
  }
  next();
});

module.exports = {
  protect,
  restrictTo,
  requirePermission,
  hasPermission,
  requireEnrollment,
};
