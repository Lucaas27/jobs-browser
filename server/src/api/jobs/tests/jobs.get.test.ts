import initApp from '@/app.js';
import { Express } from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import mockedMongoService from '@/services/mongo.service.js';
import validateSchema from '@/helpers/validateSchema.js';
import ErrorResponseSchema from '@/interfaces/ErrorResponse.js';
import APIResponseSchema from '@/interfaces/APIResponse.js';

// Mocking the MongoDB service itself
vi.mock('@/services/mongo.service.js');
const app: Express = initApp(mockedMongoService); // Initialize app with mocked mongo service;

describe('GET /jobs endpoints', () => {
  afterEach(() => {
    vi.resetAllMocks(); // Reset all mocks after each test
  });

  describe(`GET request to /api/${process.env.API_VERSION || 'v1'}/jobs`, async () => {
    it('should return 200 if request is successful', async () => {
      const mockJobs = [{ title: 'Job 1' }, { title: 'Job 2' }];
      (mockedMongoService.getDocuments as any).mockResolvedValue(mockJobs);
      const res = await request(app)
        .get(`/api/${process.env.API_VERSION || 'v1'}/jobs`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(validateSchema(APIResponseSchema, res.body)).toBe(true);
      expect(mockedMongoService.getDocuments).toHaveBeenCalledOnce();
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Resources fetched successfully/);
      expect(res.body.data).toEqual(mockJobs);
      expect(res.body.count).toBeDefined();
      expect(typeof res.body.count).toBe('number');
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 500 if there is any unexpected error fetching from the database', async () => {
      (mockedMongoService.getDocuments as any).mockRejectedValue(
        new Error('Failed to retrieve documents from the database'),
      );
      const res = await request(app)
        .get(`/api/${process.env.API_VERSION || 'v1'}/jobs`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(500);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(mockedMongoService.getDocuments).toHaveBeenCalledOnce();
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Something went wrong/);
      expect(res.body.error.message).toMatch(/Failed to retrieve documents from the database/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
  });

  describe(`GET request to /api/${process.env.API_VERSION || 'v1'}/jobs/:id`, () => {
    it('should return 200 if the request is successful', async () => {
      const mockJob = [{ title: 'Job 1', _id: '674c8fcf2b1030e7c0ea58d1' }];
      (mockedMongoService.getDocumentById as any).mockResolvedValue(mockJob);
      const res = await request(app)
        .get(`/api/${process.env.API_VERSION || 'v1'}/jobs/674c8fcf2b1030e7c0ea58d1`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(validateSchema(APIResponseSchema, res.body)).toBe(true);
      expect(mockedMongoService.getDocumentById).toHaveBeenCalledOnce();
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Resource fetched successfully/);
      expect(res.body.data).toEqual(mockJob);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
    it('should return 400 if the id is not in the correct format', async () => {
      (mockedMongoService.getDocumentById as any).mockResolvedValue([]);
      const res = await request(app)
        .get(`/api/${process.env.API_VERSION || 'v1'}/jobs/wrongformattedId`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      // Expect the response to be in the correct format
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(mockedMongoService.getDocumentById).toHaveBeenCalledTimes(0);
      expect(res.body.success).toBe(false);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Invalid ID. Input must be a 24 character hex string/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 404 if the id is not found', async () => {
      (mockedMongoService.getDocumentById as any).mockResolvedValue([]);
      const res = await request(app)
        .get(`/api/${process.env.API_VERSION || 'v1'}/jobs/674c8fcf2b1030e7c0ea58d1`)
        .set('Accept', 'application/json');

      // Expect the response to be in the correct format
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.status).toBe(404);
      expect(mockedMongoService.getDocumentById).toHaveBeenCalledOnce();
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Something went wrong/);
      expect(res.body.error.message).toMatch(/Resource id 674c8fcf2b1030e7c0ea58d1 does not exist/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 500 if there is any unexpected error fetching from the database', async () => {
      (mockedMongoService.getDocumentById as any).mockRejectedValue(
        new Error('Failed to retrieve documents from the database'),
      );
      const res = await request(app)
        .get(`/api/${process.env.API_VERSION || 'v1'}/jobs/674c8fcf2b1030e7c0ea58d1`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(500);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(mockedMongoService.getDocumentById).toHaveBeenCalledOnce();
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Something went wrong/);
      expect(res.body.error.message).toMatch(/Failed to retrieve documents from the database/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
  });
});
