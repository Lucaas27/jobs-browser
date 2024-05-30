import { Router } from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobsInRadius,
  applyForJob,
} from '@/api/jobs/jobs.controllers.js';
import JobSchema, { JobIdParam } from '@/api/jobs/jobs.model.js';
import validateRequest from '@/middlewares/validator.middleware.js';

const jobsRouter = Router();

jobsRouter.route('/').get(getJobs);
jobsRouter.route('/new').post(validateRequest({ body: JobSchema }), createJob);
jobsRouter
  .route('/:id')
  .get(validateRequest({ params: JobIdParam }), getJob)
  .patch(validateRequest({ params: JobIdParam, body: JobSchema.partial() }), updateJob)
  .delete(validateRequest({ params: JobIdParam }), deleteJob);
jobsRouter.route('/:postcode/:distance').get(getJobsInRadius);
jobsRouter.route('/:id/apply').post(applyForJob);

export default jobsRouter;
