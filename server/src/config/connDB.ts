import { logger } from '@/services/logger.service';
import mongoose from 'mongoose';

const connDB = async () => {
  await mongoose.connect(process.env.MONGO_URI!, {
    dbName: 'jobs_browser',
  });
  logger.debug(`Connected to MongoDB - Database name: ${mongoose.connection.db.databaseName}`);
};

export { connDB };
