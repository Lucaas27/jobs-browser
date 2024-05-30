import initApp from '@/app.js';
import mongo from '@/services/mongo.service.js';
import { logger } from '@/lib/logger.js';

try {
  const app = initApp(mongo);
  const port = Number(process.env.PORT) || 5000;
  const server = app.listen(port, () => {
    logger.info(`Server is running on port ${port} - ${process.env.NODE_ENV} 🚀🚀🚀`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    // Log the rejection
    logger.error(`Unhandled Rejection: ${err.message}\nOrigin: ${err.stack}`);
    // Close the server
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    // Log the error
    logger.error(`Caught exception: ${error}\nException origin: ${error.stack}`);
    // Close the server
    server.close(() => process.exit(1));
  });
} catch (error: unknown) {
  logger.error(`Server startup failed! ❌ - \n${(error as Error).message || error}`);
}
