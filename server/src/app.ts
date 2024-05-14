import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { morganMiddleware } from '@/middlewares/morgan.middleware';
import { jobsRouter } from '@/routes/jobs.route';
import { connDB } from '@/config/connDB';
import { errorHandler } from '@/middlewares/errorHandler.middleware';
import { corsOptions } from '@/config/cors';
import { notFound } from '@/middlewares/notFound.middleware';

// Connect to DB
connDB();

// Initialize app
const app: Express = express();

// Middleware and Routers
app
  .use(cors(corsOptions))
  .use(express.json())
  .use(express.urlencoded({ extended: true, limit: '30mb' }))
  .use(morganMiddleware())
  .use(`/api/${process.env.API_VERSION || 'v1'}/jobs`, jobsRouter)
  .use('*', notFound)
  .use(errorHandler);

export default app;
