import express, { Express, Request, Response } from 'express';
import { morganMiddleware } from '@/middlewares/morgan.middleware';
import { jobsRouter } from '@/routes/jobs';
import { connDB } from '@/config/connDB';

// Connect to DB
connDB();

// Initialize app
const app: Express = express();

// Middleware
app
  .use(express.json())
  .use(morganMiddleware())
  .use(`/api/${process.env.API_VERSION || 'v1'}/jobs`, jobsRouter);

// Routes
app.get('/', async (req: Request, res: Response) => {
  res.send('Job Board API');
});

export default app;
