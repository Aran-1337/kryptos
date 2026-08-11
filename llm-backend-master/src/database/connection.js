const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  let targetUri = config.mongo.uri;

  try {
    const conn = await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 1500 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return;
  } catch (err) {
    console.warn('⚠️ Local MongoDB not running. Starting In-Memory MongoDB Server...');
  }

  try {
    await mongoose.disconnect();
  } catch (e) {}

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    targetUri = mongoServer.getUri();
    
    const conn = await mongoose.connect(targetUri);
    console.log(`✅ In-Memory MongoDB connected: ${conn.connection.host}`);

    // Auto seed admin user
    try {
      const User = require('../modules/users/user.model');
      const existingAdmin = await User.findOne({ email: 'admin@platform.com' });
      if (!existingAdmin) {
        await User.create({
          firstName: 'المدير',
          fatherName: 'العام',
          lastName: 'للمنصة',
          email: 'admin@platform.com',
          phone: '01000000000',
          password: 'Admin123456!',
          grade: 'grade1',
          governorate: 'Cairo',
          educationType: 'arabic',
          gender: 'male',
          guardian: {
            fullName: 'ولي الأمر',
            relation: 'father',
            phone: '01100000000'
          },
          acceptTerms: true,
          acceptPrivacy: true,
          role: 'admin',
          isEmailVerified: true,
          isActive: true
        });
        console.log('🎉 Default Admin created successfully: admin@platform.com / Admin123456!');
      }
    } catch (seedErr) {
      console.warn('Admin seed note:', seedErr.message);
    }

  } catch (fallbackErr) {
    console.error('❌ MongoDB connection error:', fallbackErr.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = connectDB;
