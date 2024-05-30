import dotenv from 'dotenv';
import cors from 'cors';
import express, { Express } from 'express';
import morganMiddleware from '@/middlewares/morgan.middleware.js';
import { errorHandler } from '@/middlewares/errorHandler.middleware.js';
import corsOptions from '@/config/cors.js';
import notFound from '@/middlewares/notFound.middleware.js';
import api from '@/api/index.js';
import { MongoService } from '@/interfaces/MongoService.js';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const initApp = (database: MongoService) => {
  // Instantiate app
  const app: Express = express();

  // Connect to MongoDB
  database.connect();

  // Middleware and Routers
  app
    .use(cors(corsOptions))
    .use(express.json())
    .use(morganMiddleware())
    .use(`/api/${process.env.API_VERSION || 'v1'}`, api)
    .use(notFound) // Catch 404 errors
    .use(errorHandler); // Custom error handler

  return app;
};

export default initApp;
