const router = require('express').Router();
const teamController = require('./team.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

// Public routes (no auth)
router.post('/accept-invite', teamController.acceptInvite);
router.post('/login', teamController.login);

// Admin-only routes
router.use(protect, restrictTo('admin'));
router.get('/', teamController.getAll);
router.post('/invite', teamController.invite);
router.patch('/:id/permissions', teamController.updatePermissions);
router.post('/:id/resend-invite', teamController.resendInvite);
router.delete('/:id', teamController.deleteMember);

module.exports = router;
