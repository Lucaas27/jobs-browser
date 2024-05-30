import 'express-async-errors';
import { Request, Response } from 'express';
import { CustomAPIError } from '@/middlewares/errorHandler.middleware.js';
import { APIResponse } from '@/interfaces/APIResponse.js';
import { Job, JobIdParam } from '@/api/jobs/jobs.model.js';
import mongo from '@/services/mongo.service.js';
import slugify from 'slugify';
import { validateAndGeocodeAddress } from '@/lib/geocoder.js';

/**
 * Fetch all jobs from the database.
 *
 * @param {Request} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @return {Promise<void>} A promise with the JSON response
 * @route {GET} /api/v1/jobs
 * @access Public
 */
export const getJobs = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const jobs = await mongo.getDocuments<Job>('jobs');

  res.status(200).json({
    success: true,
    count: jobs.length,
    message: 'Resources fetched successfully.',
    data: jobs,
  });
};

/**
 * Fetch an individual job from the database using the job ID.
 *
 * @param {Request<JobIdParam>} req - The request object
 * @param {Response<APIResponse>} res - The response object
 * @return {Promise<void>} A promise with the JSON response
 * @route {GET} /api/v1/jobs/:id
 * @access Private
 */
export const getJob = async (req: Request<JobIdParam>, res: Response<APIResponse>): Promise<void> => {
  const job = await mongo.getDocumentById<Job>('jobs', req.params.id);

  if (!job.length) {
    throw new CustomAPIError(`Resource id ${req.params.id} does not exist`, 404);
  }

  res.status(200).json({
    success: true,
    message: 'Resource fetched successfully',
    data: job,
  });
};

/**
 * Add a new job in the database. User must be authenticated as an admin or employer.
 *
 * @param {Request<object, APIResponse, Job>} req - The request object containing the job data to be added
 * @param {Response<APIResponse>} res - The response object to send the created job data
 * @return {Promise<void>} A promise that resolves when the job is successfully added
 * @route {POST} /api/v1/jobs
 * @access Private
 */
export const createJob = async (req: Request<object, APIResponse, Job>, res: Response<APIResponse>): Promise<void> => {
  // Slugify job title before saving to DB
  req.body.slug = slugify(req.body.title, { lower: true });
  if (!req.body.slug) {
    throw new CustomAPIError(`Failed to create resource. Slug could not be created`, 400);
  }

  // Validate and geocode address
  const location = (await validateAndGeocodeAddress(
    req.body.address.trim().toLocaleLowerCase('en-GB'),
  )) as Job['location'];

  req.body.location = location;
  if (!location) {
    throw new CustomAPIError(`Failed to create resource. Invalid address provided.`, 400);
  }

  const jobCreated = await mongo.createDocument<Job>('jobs', req.body);

  if (!jobCreated.length) {
    throw new CustomAPIError(`Failed to create resource.`, 500);
  }

  res.status(201).json({
    success: true,
    message: 'Resource created successfully',
    data: jobCreated,
  });
};

/**
 * Update an individual job in the database using the job ID. User must be authenticated and own the job.
 *
 * @param {Request<JobIdParam, APIResponse, Partial<Job>>} req - The request object containing the updated job data with only the fields that need to be updated. The `id` field is required.
 * @param {Response<APIResponse>} res - The response object to send the updated job data.
 * @return {Promise<void>} A promise that resolves when the job is successfully updated.
 * @route {PUT} /api/v1/jobs/:id
 * @access Private
 */
export const updateJob = async (
  req: Request<JobIdParam, APIResponse, Partial<Job>>,
  res: Response<APIResponse>,
): Promise<void> => {
  const updatedJob = await mongo.updateDocument<Job>('jobs', req.params.id, req.body);

  if (!updatedJob.length) {
    throw new CustomAPIError(`Resource ${req.params.id} could not be found`, 404);
  }

  res.status(200).json({
    success: true,
    message: 'Resource updated successfully',
    data: updatedJob,
  });
};

/**
 * Delete a job from the database using the job ID. User must be authenticated and own the job.
 *
 * @param {Request<JobIdParam>} req - The request object containing the job ID.
 * @param {Response<APIResponse>} res - The response object to send the deleted job data.
 * @return {Promise<void>} A promise that resolves when the job is successfully deleted.
 * @route {DELETE} /api/v1/jobs/:id
 * @access Private
 */
export const deleteJob = async (req: Request<JobIdParam>, res: Response<APIResponse>): Promise<void> => {
  const deletedJob = await mongo.deleteDocument<Job>('jobs', req.params.id);
  if (!deletedJob.length) {
    throw new CustomAPIError(`Resource ${req.params.id} does not exist`, 404);
  }

  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully',
    data: deletedJob,
  });
};

/**
 * Allow users to apply for an individual job. User must be authenticated and not an employer.
 *
 * @param {Request<JobIdParam>} req - The request object.
 * @param {Response<APIResponse>} res - The response object.
 * @return {Promise<void>} A promise that resolves when the job application is successful.
 * @route {POST} /api/v1/jobs/:id/apply
 * @access Private
 */
export const applyForJob = async (req: Request<JobIdParam>, res: Response<APIResponse>): Promise<void> => {
  res.status(200).json({ success: true, message: 'Success', data: null });
};

/**
 * Retrieve all jobs within a specified radius.
 *
 * @param {Request} req - The request object.
 * @param {Response<APIResponse>} res - The response object.
 * @return {Promise<void>} A promise that resolves when the jobs within the radius are successfully retrieved.
 * @route {GET} /api/v1/jobs/:postcode/:distance
 * @access Public
 */
export const getJobsInRadius = async (req: Request<JobIdParam>, res: Response<APIResponse>): Promise<void> => {
  res.status(200).json({ success: true, message: 'Success', data: null });
};
