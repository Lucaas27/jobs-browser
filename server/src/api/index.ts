import jobsRouter from '@/api/jobs/jobs.routes.js';
import { Router } from 'express';

const router = Router();

router.use('/jobs', jobsRouter);

export default router;
