import express, { Express, Request, Response } from 'express';
import { morganMiddleware } from '@/middlewares/morgan.middleware';
import { jobsRouter } from '@/routes/jobs';
import { logger } from '@/services/logger.service';

const app: Express = express();

app
  .use(express.json())
  .use(morganMiddleware())
  .use(`/api/${process.env.API_VERSION || 'v1'}/jobs`, jobsRouter);

app.get('/', async (req: Request, res: Response) => {
  res.send('Job Board API');
});

export default app;
