import { Router, Request, Response } from 'express';
import { APIResponse } from '@/interfaces/APIResponse';
import { getJobs, getJob, createJob, updateJob, deleteJob, getJobsInRadius, applyForJob } from '@/controllers/jobs';

const jobsRouter = Router();

jobsRouter.route('/').get(getJobs);

jobsRouter.route('/:id').get(getJob).put(updateJob).delete(deleteJob);

jobsRouter.route('/:postcode/:distance').get(getJobsInRadius);

jobsRouter.route('/new').post(createJob);

jobsRouter.route('/:id/apply').post(applyForJob);

export { jobsRouter };
