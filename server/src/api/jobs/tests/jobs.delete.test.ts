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

describe('DELETE /jobs endpoints', () => {
  afterEach(() => {
    vi.resetAllMocks(); // Reset all mocks after each test
  });

  describe(`DELETE request to /api/${process.env.API_VERSION || 'v1'}/jobs/:id`, () => {
    it('should return 200 and delete the job', async () => {
      const mockData = [{ title: 'Job to delete', _id: '664bbf89bad5420fcbba2b88' }];
      (mockedMongoService.deleteDocument as any).mockResolvedValue(mockData);
      const res = await request(app)
        .delete(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(validateSchema(APIResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockData);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 if the job id is invalid', async () => {
      (mockedMongoService.deleteDocument as any).mockResolvedValue([]);
      const res = await request(app)
        .delete(`/api/${process.env.API_VERSION || 'v1'}/jobs/invalid-id`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.deleteDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Invalid ID/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 404 if the job does not exist', async () => {
      (mockedMongoService.deleteDocument as any).mockResolvedValue([]);
      const res = await request(app)
        .delete(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json');

      expect(res.status).toBe(404);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.deleteDocument).toHaveBeenCalledTimes(1);
      expect(res.body.error.message).toMatch(/Resource 664bbf89bad5420fcbba2b88 does not exist/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
  });
});
