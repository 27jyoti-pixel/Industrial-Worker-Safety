const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception] Shutting down due to uncaught exception:', err);
  process.exit(1);
});

let server;

// Connect Database and Start Server
connectDB()
  .then(() => {
    server = app.listen(config.port, () => {
      console.log('=======================================================');
      console.log(' Industrial Worker Safety & Compensation Backend API ');
      console.log(` Environment : ${config.env}`);
      console.log(` Port        : ${config.port}`);
      console.log(` Health Check: http://localhost:${config.port}/api/v1/health`);
      console.log('=======================================================');
    });
  })
  .catch((err) => {
    console.error('[Startup Error] Failed to start application:', err.message);
    process.exit(1);
  });

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection] Shutting down due to unhandled promise rejection:', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});