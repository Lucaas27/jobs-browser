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

describe('POST /jobs endpoints', () => {
  afterEach(() => {
    vi.resetAllMocks(); // Reset all mocks after each test
  });
  describe(`POST request to /api/${process.env.API_VERSION || 'v1'}/jobs/new`, async () => {
    const newJob = {
      title: 'Test API',
      description: 'We are testing the API.',
      email: 'jobs@example.com',
      address: '56 high street',
      company: 'SuccessWorks Ltd.',
      industry: ['Customer Service'],
      jobType: 'Full-time',
      minEducation: "Bachelor's Degree",
      positionsAvailable: 1,
      experience: '2 Year - 5 Years',
      salary: 90000,
    };

    it('should return 201 if the request is successful', async () => {
      const mockData = [{ acknowledged: true, insertedId: 'mockId' }];
      (mockedMongoService.createDocument as any).mockResolvedValue(mockData);
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
        .set('Accept', 'application/json')
        .send(newJob);

      expect(res.status).toBe(201);
      expect(validateSchema(APIResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(true);
      expect(mockedMongoService.createDocument).toHaveBeenCalledOnce();
      expect(res.body.message).toMatch(/Resource created successfully/);
      expect(res.body.data).toEqual(mockData);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 and a validation error if the job title does not have at least 1 character', async () => {
      const invalidJob = { ...newJob, title: '' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
        ...newJob,
        title:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?',
      };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, description: '' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
        ...newJob,
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad asperiores repudiandae impedit, itaque, cum sint nam cumque temporibus expedita adipisci veritatis molestias! Totam est aspernatur inventore blanditiis suscipit perspiciatis mollitia?',
      };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, email: 'test.com' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, address: '' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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

    it('should return 400 and a validation error if the company field is empty', async () => {
      const invalidJob = { ...newJob, company: '' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
        .set('Accept', 'application/json')
        .send(invalidJob);

      expect(res.status).toBe(400);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(0);
      expect(res.body.error.name).toMatch(/ValidationError/);
      expect(res.body.error.message[0]).toMatch(/Please add Company name/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
    it('should return 400 and a validation error if the industry field does not have a correct value', async () => {
      const invalidJob = { ...newJob, industry: ['test'] };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, jobType: 'test' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, minEducation: 'test' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, experience: 'test' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, salary: 0 };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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
      const invalidJob = { ...newJob, salary: 'test' };
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
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

    it('should return 500 if it fails to insert data in the database', async () => {
      (mockedMongoService.createDocument as any).mockResolvedValue([]);
      const res = await request(app)
        .post(`/api/${process.env.API_VERSION || 'v1'}/jobs/new`)
        .set('Accept', 'application/json')
        .send(newJob);

      expect(res.status).toBe(500);
      expect(validateSchema(ErrorResponseSchema, res.body)).toBe(true);
      expect(res.body.success).toBe(false);
      expect(mockedMongoService.createDocument).toHaveBeenCalledTimes(1);
      expect(res.body.error.message).toMatch(/Failed to create resource/);
      expect(res.header['content-type']).toMatch(/application\/json/);
    });
  });
});
