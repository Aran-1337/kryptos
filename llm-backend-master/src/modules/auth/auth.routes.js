const router = require('express').Router();
const authController = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  registerValidator, loginValidator, forgotPasswordValidator,
  resetPasswordValidator, changePasswordValidator,
} = require('./auth.validator');

const {
  authLimiter,
  passwordResetLimiter,
  otpLimiter,
  availabilityLimiter,
} = require('../../middlewares/rateLimiter.middleware');

router.post('/check-availability', availabilityLimiter, authController.checkAvailability);
router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-email/:token', otpLimiter, authController.verifyEmail);
router.post('/resend-verification', otpLimiter, authController.resendVerification);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.patch('/reset-password/:token', passwordResetLimiter, resetPasswordValidator, validate, authController.resetPassword);
router.patch('/change-password', protect, passwordResetLimiter, changePasswordValidator, validate, authController.changePassword);

module.exports = router;
