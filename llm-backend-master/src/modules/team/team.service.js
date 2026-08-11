const crypto = require('crypto');
const TeamMember = require('./team.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const AppError = require('../../utils/AppError');

// ─── Invite a new team member ──────────────────────────────────────────────────
const inviteMember = async ({ name, email, permissions }) => {
  const existing = await TeamMember.findOne({ email });
  if (existing) throw new AppError('هذا البريد الإلكتروني مسجل بالفعل في الفريق', 400);

  const inviteToken = crypto.randomBytes(32).toString('hex');
  const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const member = await TeamMember.create({
    name,
    email,
    permissions: permissions || [],
    inviteToken,
    inviteExpires,
    isAccepted: false,
  });

  return { member, inviteToken };
};

// ─── Accept invite & set password ─────────────────────────────────────────────
const acceptInvite = async ({ token, password }) => {
  const member = await TeamMember.findOne({
    inviteToken: token,
    inviteExpires: { $gt: new Date() },
    isAccepted: false,
  }).select('+inviteToken +inviteExpires');

  if (!member) throw new AppError('رابط الدعوة غير صالح أو منتهي الصلاحية', 400);

  member.password = password;
  member.inviteToken = undefined;
  member.inviteExpires = undefined;
  member.isAccepted = true;
  await member.save();

  return member;
};

// ─── Login for team members ────────────────────────────────────────────────────
const loginMember = async ({ email, password }) => {
  const member = await TeamMember.findOne({ email, isAccepted: true }).select('+password +refreshTokens');
  if (!member || !(await member.comparePassword(password))) {
    throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
  }
  if (!member.isActive) throw new AppError('الحساب غير نشط', 401);

  const accessToken = generateAccessToken(member._id, 'assistant');
  const refreshToken = generateRefreshToken(member._id);

  member.refreshTokens = [...(member.refreshTokens || []).slice(-4), refreshToken];
  await member.save({ validateBeforeSave: false });

  return { member, accessToken, refreshToken };
};

// ─── Get all team members ──────────────────────────────────────────────────────
const getAllMembers = async () => {
  return TeamMember.find().sort({ createdAt: -1 });
};

// ─── Update permissions ────────────────────────────────────────────────────────
const updatePermissions = async (id, permissions) => {
  const member = await TeamMember.findByIdAndUpdate(
    id,
    { permissions },
    { new: true, runValidators: true }
  );
  if (!member) throw new AppError('العضو غير موجود', 404);
  return member;
};

// ─── Delete member ─────────────────────────────────────────────────────────────
const deleteMember = async (id) => {
  const member = await TeamMember.findByIdAndDelete(id);
  if (!member) throw new AppError('العضو غير موجود', 404);
};

// ─── Resend invite ─────────────────────────────────────────────────────────────
const resendInvite = async (id) => {
  const member = await TeamMember.findById(id);
  if (!member) throw new AppError('العضو غير موجود', 404);
  if (member.isAccepted) throw new AppError('العضو قبل الدعوة بالفعل', 400);

  const inviteToken = crypto.randomBytes(32).toString('hex');
  const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  member.inviteToken = inviteToken;
  member.inviteExpires = inviteExpires;
  await member.save({ validateBeforeSave: false });

  return { member, inviteToken };
};

module.exports = { inviteMember, acceptInvite, loginMember, getAllMembers, updatePermissions, deleteMember, resendInvite };
