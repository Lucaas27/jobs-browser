import { Request, Response } from 'express';
import { APIResponse } from '@/interfaces/APIResponse';
import { IJob } from '@/interfaces/Job';
import { Job } from '@/models/jobs';

/**
 * Fetch all jobs from the database. Includes pagination, filtering, etc
 *
 * @param {Request} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @return {Promise<Response<APIResponse>>} A promise with the JSON response
 * @route {GET} /api/v1/jobs
 * @access Public
 */
export const getJobs = async (req: Request, res: Response<APIResponse>): Promise<Response<APIResponse>> => {
  return res.status(200).json({ success: true, message: 'Get all jobs' });
};

/**
 * Fetch an individual job from the database by ID.
 *
 * @param {Request} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @return {Promise<Response<APIResponse>>} A promise with the JSON response
 * @route {GET} /api/v1/jobs/:id
 * @access Public
 */
export const getJob = async (req: Request, res: Response<APIResponse>): Promise<Response<APIResponse>> => {
  return res.status(200).json({ success: true, message: 'Get single job' });
};

/**
 * Add a new job in the database. User must be authenticated as an admin or employer.
 *
 * @param {Request} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @return {Promise<Response<APIResponse>>} A promise with the JSON response
 * @route {POST} /api/v1/jobs
 * @access Private
 */
export const createJob = async (req: Request, res: Response<APIResponse>): Promise<Response<APIResponse>> => {
  try {
    const jobCreated = await Job.create(req.body);
    return res.status(201).json({ success: true, message: 'Created a new job', data: { _id: jobCreated.id } });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to create a new job', error: err.message });
  }
};

/**const newJob: IJob = await Job.create(req.body) as IJob;const newJob: IJob = await Job.create(req.body) as IJob;
 * Update an individual job in the database using the job ID. User must be authenticated and own the job.
 *
 * @param {Request} req - The request object containing the updated job data.
 * @param {Response<APIResponse>} res - The response object to send the updated job data.
 * @return {Promise<Response<APIResponse>>} A promise that resolves when the job is successfully updated.
 * @route {PUT} /api/v1/jobs/:id
 * @access Private
 */
export const updateJob = async (req: Request, res: Response<APIResponse>): Promise<Response<APIResponse>> => {
  return res.status(200).json({ success: true, message: 'Update job' });
};

/**
 * Delete a job from the database using the job ID. User must be authenticated and own the job.
 *
 * @param {Request} req - The request object.
 * @param {Response<APIResponse>} res - The response object.
 * @return {Promise<Response<APIResponse>>} A promise that resolves when the job is successfully deleted.
 * @route {DELETE} /api/v1/jobs/:id
 * @access Private
 */
export const deleteJob = async (req: Request, res: Response<APIResponse>): Promise<Response<APIResponse>> => {
  return res.status(204).json({ success: true, message: 'Delete job' });
};

/**
 * Allow users to apply for an individual job. User must be authenticated and not an employer.
 *
 * @param {Request} req - The request object.
 * @param {Response<APIResponse>} res - The response object.
 * @return {Promise<Response<APIResponse>>} A promise that resolves when the job application is successful.
 * @route {POST} /api/v1/jobs/:id/apply
 * @access Private
 */
export const applyForJob = async (req: Request, res: Response<APIResponse>): Promise<Response<APIResponse>> => {
  return res.status(200).json({ success: true, message: 'Apply for job' });
};

/**
 * Retrieve all jobs within a specified radius.
 *
 * @param {Request} req - The request object.
 * @param {Response<APIResponse>} res - The response object.
 * @return {Promise<Response<APIResponse>>} A promise that resolves when the jobs within the radius are successfully retrieved.
 * @route {GET} /api/v1/jobs/:postcode/:distance
 * @access Public
 */
export const getJobsInRadius = async (req: Request, res: Response<APIResponse>): Promise<Response<APIResponse>> => {
  return res.status(200).json({ success: true, message: 'Get all jobs in the radius' });
};
