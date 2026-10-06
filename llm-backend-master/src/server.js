require('dotenv').config();
const app = require('./app');
const connectDB = require('./database/connection');
const config = require('./config');

// Handle uncaught exceptions FIRST
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  // Validate production configuration before initializing resources
  config.validateProductionConfig();

  await connectDB();

  const redisConfig = require('./config/redis');
  await redisConfig.init();
  const { initQueues } = require('./services/queue.service');
  initQueues();

  const server = app.listen(config.port, () => {
    console.log(`🚀 Server running in ${config.env} mode on port ${config.port}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION:', err.name, err.message);
    server.close(() => process.exit(1));
  });

  // Graceful shutdown on SIGTERM / SIGINT
  const gracefulShutdown = (signal) => {
    console.log(`👋 ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed');
      try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close();
          console.log('MongoDB connection closed');
        }
        if (redisConfig.redisAvailable && redisConfig.bullmqConnection) {
          await redisConfig.bullmqConnection.quit().catch(() => {});
          console.log('Redis queue connection closed');
        }
      } catch (err) {
        console.error('Error during graceful shutdown:', err.message);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();
