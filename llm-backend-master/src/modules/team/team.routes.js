const router = require('express').Router();
const teamController = require('./team.controller');
const { protect, restrictTo, requirePermission } = require('../../middlewares/auth.middleware');

const {
  teamMemberIdParamValidator,
  teamLoginValidator,
  inviteMemberValidator,
  acceptInviteValidator,
  updatePermissionsValidator,
} = require('./team.validator');

const {
  authLimiter,
  otpLimiter,
} = require('../../middlewares/rateLimiter.middleware');

// Public routes (no auth)
router.post('/accept-invite', otpLimiter, acceptInviteValidator, teamController.acceptInvite);
router.post('/login', authLimiter, teamLoginValidator, teamController.login);

// Admin / Team Management routes
router.use(protect, requirePermission('team'));
router.get('/', teamController.getAll);
router.post('/invite', inviteMemberValidator, teamController.invite);
router.patch('/:id/permissions', updatePermissionsValidator, teamController.updatePermissions);
router.post('/:id/resend-invite', otpLimiter, teamMemberIdParamValidator, teamController.resendInvite);
router.delete('/:id', teamMemberIdParamValidator, teamController.deleteMember);

module.exports = router;
