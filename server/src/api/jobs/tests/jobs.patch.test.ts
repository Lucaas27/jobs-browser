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

describe('PATCH /jobs endpoints', () => {
  afterEach(() => {
    vi.resetAllMocks(); // Reset all mocks after each test
  });

  describe(`PATCH request to /api/${process.env.API_VERSION || 'v1'}/jobs/:id`, () => {
    it('should return 200 if the request is successful', async () => {
      const mockData = [{ title: 'Updated Job' }];
      (mockedMongoService.updateDocument as any).mockResolvedValue(mockData);
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send({ title: 'Updated Job' });

      expect(res.status).toBe(200);
      expect(validateSchema(APIResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].title).toEqual(mockData[0].title);
      expect(res.body.message).toMatch(/Resource updated successfully/);
      expect(mockedMongoService.updateDocument).toHaveBeenCalledTimes(1);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
    it('should return 400 if the job to id is invalid', async () => {
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/invalid-id`)
        .set('Accept', 'application/json')
        .send({ title: 'Updated Job' });

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.updateDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.message[0]).toMatch(/Invalid ID/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 404 if the job to update does not exist', async () => {
      (mockedMongoService.updateDocument as any).mockResolvedValue([]);
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send({ title: 'Updated Job' });

      expect(res.status).toBe(404);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.updateDocument).toHaveBeenCalledTimes(1);
      expect(res.body.error.message).toMatch(/Resource 664bbf89bad5420fcbba2b88 could not be found/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the job title does not have at least 1 character', async () => {
      const invalidJob = { title: '' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please enter Job title/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the job title exceeds 100 characters', async () => {
      const invalidJob = {
        title:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?',
      };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Job title can not exceed 100 characters/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the description does not have at least 1 character', async () => {
      const invalidJob = { description: '' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please enter Job description/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the description exceeds 1000 characters', async () => {
      const invalidJob = {
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?',
      };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Job description can not exceed 1000 characters./);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the email is invalid', async () => {
      const invalidJob = { email: 'test.com' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please enter a valid email address/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the address field is empty', async () => {
      const invalidJob = { address: '' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please add an address/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
    it('should return 400 and a validation error if the industry field does not have a correct value', async () => {
      const invalidJob = { industry: ['test'] };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please select a correct option for industry/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the jobType field does not have a correct value', async () => {
      const invalidJob = { jobType: 'test' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please select a correct option for jobType/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the minEducation field does not have a correct value', async () => {
      const invalidJob = { minEducation: 'test' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please select a correct option for minEducation/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the experience field does not have a correct value', async () => {
      const invalidJob = { experience: 'test' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please select a correct option for experience/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the salary field is zero', async () => {
      const invalidJob = { salary: 0 };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please enter expected salary for this job/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the salary field is not a number', async () => {
      const invalidJob = { salary: 'test' };
      const res = await request(app)
        .patch(`/api/${process.env.API_VERSION || 'v1'}/jobs/664bbf89bad5420fcbba2b88`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Expected number/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
  });
});
