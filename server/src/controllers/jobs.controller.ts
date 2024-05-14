import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import { Job } from '@/models/jobs.model';
import { CustomAPIError } from '@/middlewares/errorHandler.middleware';
/**
 * Fetch all jobs from the database. Includes pagination, filtering, etc
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @return {Promise<void>} A promise with the JSON response
 * @route {GET} /api/v1/jobs
 * @access Public
 */
export const getJobs = asyncHandler(async (_req: Request, res: Response, next: NextFunction) => {
  const jobs = await Job.find();
  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

/**
 * Fetch an individual job from the database by ID.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @return {Promise<void>} A promise with the JSON response
 * @route {GET} /api/v1/jobs/:id
 * @access Public
 */
export const getJob = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new CustomAPIError(`Resource ${req.params.id} does not exist`, 404));
  }

  res.status(200).json({ success: true, data: job });
});

/**
 * Add a new job in the database. User must be authenticated as an admin or employer.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @return {Promise<void>} A promise with the JSON response
 * @route {POST} /api/v1/jobs
 * @access Private
 */
export const createJob = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const jobCreated = await Job.create(req.body);
  res.status(201).json({ success: true, data: { _id: jobCreated.id } });
});

/**const newJob: IJob = await Job.create(req.body) as IJob;const newJob: IJob = await Job.create(req.body) as IJob;
 * Update an individual job in the database using the job ID. User must be authenticated and own the job.
 *
 * @param {Request} req - The request object containing the updated job data.
 * @param {Response} res - The response object to send the updated job data.
 * @return {Promise<void>} A promise that resolves when the job is successfully updated.
 * @route {PUT} /api/v1/jobs/:id
 * @access Private
 */
export const updateJob = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updatedJob) {
    return next(new CustomAPIError(`Resource ${req.params.id} does not exist`, 404));
  }
  res.status(200).json({ success: true, data: updatedJob });
});

/**
 * Delete a job from the database using the job ID. User must be authenticated and own the job.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the job is successfully deleted.
 * @route {DELETE} /api/v1/jobs/:id
 * @access Private
 */
export const deleteJob = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const deletedJob = await Job.findByIdAndDelete(req.params.id);
  if (!deletedJob) {
    return next(new CustomAPIError(`Resource ${req.params.id} does not exist`, 404));
  }
  res.status(200).json({ success: true, data: deletedJob.id });
});

/**
 * Allow users to apply for an individual job. User must be authenticated and not an employer.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the job application is successful.
 * @route {POST} /api/v1/jobs/:id/apply
 * @access Private
 */
export const applyForJob = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true });
});

/**
 * Retrieve all jobs within a specified radius.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the jobs within the radius are successfully retrieved.
 * @route {GET} /api/v1/jobs/:postcode/:distance
 * @access Public
 */
export const getJobsInRadius = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true });
});
