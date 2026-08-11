const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teamMemberSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false, minlength: 8 },
  role:     { type: String, default: 'assistant' },

  permissions: {
    type: [String],
    default: [],
    // Possible values:
    // 'courses' | 'exams' | 'live' | 'support' | 'reviews' | 'cms'
    // 'books' | 'payments' | 'coupons' | 'activation' | 'students' | 'analytics'
  },

  // Invite system
  inviteToken:   { type: String, select: false },
  inviteExpires: { type: Date, select: false },
  isAccepted:    { type: Boolean, default: false }, // false = pending invite

  refreshTokens: [{ type: String, select: false }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

teamMemberSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

teamMemberSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

teamMemberSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.inviteToken;
  return obj;
};

module.exports = mongoose.model('TeamMember', teamMemberSchema);
