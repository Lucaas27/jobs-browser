import app from '@/app';
import { logger } from '@/services/logger.service';
const port = Number(process.env.PORT) || 5000;

try {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port} - ${process.env.NODE_ENV} 🚀🚀🚀`);
  });
} catch (error: unknown) {
  logger.error(`Server startup failed! ❌ - \n${error}`);
}
