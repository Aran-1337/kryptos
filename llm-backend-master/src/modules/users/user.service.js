const userRepo = require('./user.repository');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../services/cloudinary.service');
const AppError = require('../../utils/AppError');
const { paginate, paginateResponse } = require('../../helpers/pagination');

const { escapeRegex } = require('../../utils/sanitize');

const getProfile = (userId) => userRepo.findById(userId)
  .populate('enrolledCourses', 'title thumbnail slug')
  .populate('certificates', 'certificateId issuedAt')
  .populate('wishlist', 'title thumbnail slug price');

const updateProfile = async (userId, data) => {
  const allowed = [
    'firstName', 'fatherName', 'lastName', 'name', 'phone',
    'school', 'governorate', 'city', 'educationType', 'gender',
    'guardian', 'acceptNotifications'
  ];
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([k]) => allowed.includes(k))
  );

  // If name parts provided, recompute full name
  if (filtered.firstName || filtered.fatherName || filtered.lastName) {
    const existing = await userRepo.findById(userId);
    const first = filtered.firstName || existing?.firstName || '';
    const father = filtered.fatherName || existing?.fatherName || '';
    const last = filtered.lastName || existing?.lastName || '';
    filtered.name = `${first} ${father} ${last}`.trim();
  }

  return userRepo.updateById(userId, filtered);
};

const uploadAvatar = async (userId, file) => {
  const user = await userRepo.findById(userId);

  // Delete old avatar
  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'avatars',
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
  });

  return userRepo.updateById(userId, {
    avatar: { publicId: result.public_id, url: result.secure_url },
  });
};

const getAllUsers = async (query) => {
  const { page, limit, skip } = paginate(query);
  const filter = {};
  if (query.role && typeof query.role === 'string') filter.role = query.role.trim();
  if (query.search && typeof query.search === 'string') {
    const escaped = escapeRegex(query.search.trim());
    if (escaped) {
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }
  }

  const [users, total] = await Promise.all([
    userRepo.findAll(filter, { skip, limit, sort: { createdAt: -1 } }),
    userRepo.countDocuments(filter),
  ]);

  return paginateResponse(users, total, page, limit);
};

const banUser = (userId) => userRepo.updateById(userId, { isBanned: true });
const unbanUser = (userId) => userRepo.updateById(userId, { isBanned: false });

module.exports = { getProfile, updateProfile, uploadAvatar, getAllUsers, banUser, unbanUser };
