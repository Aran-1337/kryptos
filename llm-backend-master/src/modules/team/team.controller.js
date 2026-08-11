const teamService = require('./team.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

const invite = catchAsync(async (req, res) => {
  const { name, email, permissions } = req.body;
  const { member, inviteToken } = await teamService.inviteMember({ name, email, permissions });

  // Build invite link
  const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/accept-invite?token=${inviteToken}`;

  sendResponse(res, 201, {
    member,
    inviteLink, // Return link so admin can share it manually
  }, `تم إرسال الدعوة بنجاح إلى ${email}`);
});

const acceptInvite = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  const member = await teamService.acceptInvite({ token, password });
  sendResponse(res, 200, { member }, 'تم قبول الدعوة وإنشاء الحساب بنجاح');
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { member, accessToken, refreshToken } = await teamService.loginMember({ email, password });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 200, { user: member, accessToken }, 'تم تسجيل الدخول بنجاح');
});

const getAll = catchAsync(async (req, res) => {
  const members = await teamService.getAllMembers();
  sendResponse(res, 200, { members, count: members.length }, '');
});

const updatePermissions = catchAsync(async (req, res) => {
  const member = await teamService.updatePermissions(req.params.id, req.body.permissions);
  sendResponse(res, 200, { member }, 'تم تحديث الصلاحيات بنجاح');
});

const deleteMember = catchAsync(async (req, res) => {
  await teamService.deleteMember(req.params.id);
  sendResponse(res, 200, {}, 'تم حذف العضو بنجاح');
});

const resendInvite = catchAsync(async (req, res) => {
  const { member, inviteToken } = await teamService.resendInvite(req.params.id);
  const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/accept-invite?token=${inviteToken}`;
  sendResponse(res, 200, { member, inviteLink }, 'تم إعادة إرسال الدعوة بنجاح');
});

module.exports = { invite, acceptInvite, login, getAll, updatePermissions, deleteMember, resendInvite };
