const router = require('express').Router();
const userController = require('./user.controller');
const { protect, restrictTo, requirePermission } = require('../../middlewares/auth.middleware');
const { uploadImage, verifyMagicBytes } = require('../../middlewares/upload.middleware');

const { updateProfileValidator, userIdParamValidator } = require('./user.validator');
const { uploadLimiter, searchLimiter } = require('../../middlewares/rateLimiter.middleware');

router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', updateProfileValidator, userController.updateProfile);
router.patch('/profile/avatar', uploadLimiter, uploadImage.single('avatar'), verifyMagicBytes('image'), userController.uploadAvatar);

// Admin & authorized team routes
router.get('/', searchLimiter, requirePermission('students', 'students.read'), userController.getAllUsers);
router.patch('/:id/ban', requirePermission('students', 'students.update'), userIdParamValidator, userController.banUser);
router.patch('/:id/unban', requirePermission('students', 'students.update'), userIdParamValidator, userController.unbanUser);

module.exports = router;
