const authRepo = require('./auth.repository');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const { sendEmail, emailTemplates } = require('../../services/email.service');
const AppError = require('../../utils/AppError');
const redisConfig = require('../../config/redis');
const config = require('../../config');
const User = require('../users/user.model');
const TeamMember = require('../team/team.model');

const checkFieldExists = (field, value) => User.findOne({ [field]: value }).select('_id');

const register = async ({
  firstName, fatherName, lastName,
  email, password, phone,
  grade, school, governorate, city, educationType, gender,
  guardian,
  acceptTerms, acceptPrivacy, acceptNotifications,
}) => {
  const user = await authRepo.createUser({
    firstName, fatherName, lastName,
    email, password, phone,
    grade, school, governorate, city, educationType, gender,
    guardian,
    acceptTerms, acceptPrivacy, acceptNotifications: acceptNotifications || false,
    isEmailVerified: true,
  });

  return user;
};

const login = async ({ phone, email, password, deviceInfo }) => {
  let user;
  if (email) {
    user = await authRepo.findByEmail(email.toLowerCase());
  }
  if (!user && phone) {
    user = await authRepo.findByPhone(phone);
  }
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('البريد الإلكتروني/رقم الهاتف أو كلمة المرور غير صحيحة', 401);
  }
  if (user.isBanned) throw new AppError('تم حظر هذا الحساب', 403);

  // Device management - max 2 devices
  const { deviceId, fingerprint, ip, userAgent } = deviceInfo;
  const existingDevice = user.devices.find(d => d.deviceId === deviceId || d.fingerprint === fingerprint);

  if (!existingDevice) {
    if (user.devices.length >= config.maxDevices) {
      // Remove oldest device
      user.devices.sort((a, b) => a.lastLogin - b.lastLogin);
      user.devices.shift();
    }
    user.devices.push({ deviceId, fingerprint, ip, userAgent });
  } else {
    existingDevice.lastLogin = new Date();
    existingDevice.ip = ip;
  }

  const accessToken = generateAccessToken(user._id, user.role, { type: 'user' });
  const refreshToken = generateRefreshToken(user._id, { type: 'user' });

  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
  user.markModified('refreshTokens');
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

const logout = async (userId, accessToken, refreshToken, identityType) => {
  // 1. Blacklist access token in Redis if active and Redis available
  if (accessToken) {
    try {
      const decoded = require('jsonwebtoken').decode(accessToken);
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redisConfig.redis.setex(`blacklist:${accessToken}`, ttl, '1');
        }
      }
    } catch (_) {}
  }

  // 2. Authoritative server revocation: pull the refresh token from persistent database storage
  if (refreshToken) {
    if (identityType === 'team_member') {
      await TeamMember.findByIdAndUpdate(userId, { $pull: { refreshTokens: refreshToken } });
    } else if (identityType === 'user') {
      await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: refreshToken } });
    } else {
      await Promise.all([
        User.findByIdAndUpdate(userId, { $pull: { refreshTokens: refreshToken } }),
        TeamMember.findByIdAndUpdate(userId, { $pull: { refreshTokens: refreshToken } }),
      ]);
    }
  } else {
    // If no specific refreshToken provided, clear all refresh tokens for this identity
    if (identityType === 'team_member') {
      await TeamMember.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
    } else {
      await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
    }
  }
};

const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('انتهت صلاحية رمز التحديث. يرجى تسجيل الدخول مجدداً', 401);
    }
    throw new AppError('رمز التحديث غير صالح. يرجى تسجيل الدخول مجدداً', 401);
  }

  let identity = null;
  let identityType = null;

  if (decoded.type === 'team_member') {
    identity = await TeamMember.findById(decoded.id).select('+refreshTokens');
    identityType = 'team_member';
  } else if (decoded.type === 'user') {
    identity = await User.findById(decoded.id).select('+refreshTokens');
    identityType = 'user';
  } else {
    // Legacy fallback
    identity = await User.findById(decoded.id).select('+refreshTokens');
    identityType = identity ? 'user' : null;
    if (!identity) {
      identity = await TeamMember.findById(decoded.id).select('+refreshTokens');
      identityType = identity ? 'team_member' : null;
    }
  }

  if (!identity) {
    throw new AppError('المستخدم غير موجود', 401);
  }

  // Account status verification
  if (identity.isBanned) {
    throw new AppError('تم حظر هذا الحساب', 403);
  }
  if (!identity.isActive) {
    throw new AppError('الحساب غير نشط', 401);
  }
  if (identityType === 'team_member' && !identity.isAccepted) {
    throw new AppError('لم يتم قبول الدعوة بعد', 401);
  }

  // Server-side authoritative verification: is the refresh token in stored list?
  if (!identity.refreshTokens || !identity.refreshTokens.includes(refreshToken)) {
    throw new AppError('رمز التحديث غير صالح أو تم إلغاؤه', 401);
  }

  const role = identity.role || (identityType === 'team_member' ? 'assistant' : 'student');
  const newAccessToken = generateAccessToken(identity._id, role, { type: identityType });
  const newRefreshToken = generateRefreshToken(identity._id, { type: identityType });

  // Rotate refresh token
  identity.refreshTokens = (identity.refreshTokens || []).filter((t) => t !== refreshToken);
  identity.refreshTokens.push(newRefreshToken);
  if (identity.refreshTokens.length > 5) {
    identity.refreshTokens = identity.refreshTokens.slice(-5);
  }
  identity.markModified('refreshTokens');
  await identity.save({ validateBeforeSave: false });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: identity };
};

const verifyEmail = async (token) => {
  const user = await authRepo.verifyEmailToken(token);
  if (!user) throw new AppError('رمز التحقق غير صالح أو منتهي الصلاحية', 400);

  await User.findByIdAndUpdate(user._id, {
    isEmailVerified: true,
    emailVerificationToken: undefined,
    emailVerificationExpires: undefined,
  });
};

const resendVerification = async (email) => {
  const user = await authRepo.findByEmail(email);
  if (!user || user.isEmailVerified) return;

  try {
    const token = await authRepo.setEmailVerificationToken(user._id);
    const verifyUrl = `${config.clientUrl}/verify-email?token=${token}`;
    const template = emailTemplates.verifyEmail(user.name || user.firstName, verifyUrl);
    await sendEmail({ to: email, ...template });
  } catch (err) {
    // Log error internally without leaking to client
    console.error('Failed to send verification email:', err.message);
  }
};

const forgotPassword = async (email) => {
  const user = await authRepo.findByEmail(email);
  if (!user) return;

  try {
    const token = await authRepo.setPasswordResetToken(user._id);
    const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
    const template = emailTemplates.resetPassword(user.name, resetUrl);
    await sendEmail({ to: email, ...template });
  } catch (err) {
    // Log error internally without leaking to client
    console.error('Failed to send password reset email:', err.message);
  }
};

const resetPassword = async (token, newPassword) => {
  const user = await authRepo.findByPasswordResetToken(token);
  if (!user) throw new AppError('رمز إعادة التعيين غير صالح أو منتهي الصلاحية', 400);

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // Invalidate all sessions
  await user.save();
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('كلمة المرور الحالية غير صحيحة', 400);
  }
  user.password = newPassword;
  user.refreshTokens = [];
  await user.save();
};

module.exports = { checkFieldExists, register, login, logout, refreshAccessToken, verifyEmail, resendVerification, forgotPassword, resetPassword, changePassword };
