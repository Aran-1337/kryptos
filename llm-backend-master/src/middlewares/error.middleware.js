const AppError = require('../utils/AppError');
const config = require('../config');

const handleCastErrorDB = (err) => new AppError(`قيمة غير صالحة: ${err.path}`, 400);
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} مستخدم بالفعل. يرجى اختيار قيمة أخرى`, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(e => e.message);
  return new AppError(`بيانات غير صالحة: ${errors.join('. ')}`, 400);
};
const handleJWTError = () => new AppError('رمز المصادقة غير صالح. يرجى تسجيل الدخول مجدداً', 401);
const handleJWTExpiredError = () => new AppError('انتهت صلاحية رمز المصادقة. يرجى تسجيل الدخول مجدداً', 401);

const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('حجم الملف المرفوع أكبر من الحد الأقصى المسموح به', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError(`حقل رفع غير متوقع أو ملف زائد: ${err.field || ''}`, 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('تم تجاوز العدد الأقصى للملفات المسموح بها في الطلب الواحد', 400);
  }
  return new AppError(`خطأ أثناء رفع الملف: ${err.message}`, 400);
};

const sendErrorDev = (err, res) => {
  if (err.statusCode < 500) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, message: err.message });
  } else {
    // Redact potential connection string credentials from unexpected logs
    const safeMsg = (err.stack || err.message || '').replace(/mongodb(\+srv)?:\/\/[^:]+:[^@]+@/gi, 'mongodb$1://***:***@');
    console.error('💥 UNEXPECTED ERROR:', safeMsg || err.name || 'Unknown Error');
    res.status(500).json({ status: 'error', message: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً' });
  }
};

module.exports = (err, req, res, next) => {
  let error = err;
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (err.name === 'MulterError') error = handleMulterError(err);
  if (err.type === 'entity.too.large' || err.status === 413 || err.statusCode === 413) {
    error = new AppError('حجم البيانات المرسلة أكبر من الحد الأقصى المسموح به', 413);
  }
  if (err.message && (err.message.includes('Malformed part header') || err.message.includes('Multipart: Boundary not found'))) {
    error = new AppError('صيغة البيانات المرفوعة غير صالحة أو تحتوي على محارف غير مقبولة', 400);
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (config.env === 'development' && process.env.NODE_ENV !== 'test') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
