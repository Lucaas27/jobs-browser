import { z } from 'zod';

const JobSchema = z
  .object({
    title: z.string().min(1, 'Please enter Job title.').max(100, 'Job title can not exceed 100 characters.').trim(),
    slug: z.string().optional().or(z.literal('')),
    description: z
      .string()
      .min(1, 'Please enter Job description.')
      .max(1000, 'Job description can not exceed 1000 characters.')
      .trim()
      .toLowerCase(),
    email: z.string().email('Please enter a valid email address.').trim().toLowerCase(),
    address: z.string().min(1, 'Please add an address.').trim().toLowerCase(),
    location: z
      .object({
        type: z.literal('Point'),
        coordinates: z.array(z.number()).length(2).optional(),
        formattedAddress: z.string().optional().or(z.literal('')),
        streetNumber: z.string().optional().or(z.literal('')),
        street: z.string().optional().or(z.literal('')),
        city: z.string().optional().or(z.literal('')),
        state: z.string().optional().or(z.literal('')),
        postcode: z.string().optional().or(z.literal('')),
        country: z.string().optional().or(z.literal('')),
        countryCode: z.string().optional().or(z.literal('')),
      })
      .optional()
      .or(z.literal('')),
    company: z.string().min(1, 'Please add Company name.').trim().toLowerCase(),
    industry: z.array(
      z.preprocess(
        (input) => {
          if (typeof input === 'string') {
            return input.toLowerCase().trim();
          }
          return input;
        },
        z.enum(
          [
            'healthcare',
            'marketing',
            'customer service',
            'information technology',
            'manufacturing',
            'engineering',
            'design',
            'hospitality',
            'retail',
            'finance and banking',
            'education',
            'telecommunications',
            'construction',
            'other',
          ],
          {
            errorMap: (_issue, ctx) => ({
              message: `Please select a correct option for industry, "${ctx.data}" is not supported.`,
            }),
          },
        ),
      ),
    ),
    jobType: z.preprocess(
      (input) => {
        if (typeof input === 'string') {
          return input.toLowerCase().trim();
        }
        return input;
      },
      z.enum(['full-time', 'part-time', 'contract', 'temporary', 'internship'], {
        errorMap: (_issue, ctx) => ({
          message: `Please select a correct option for jobType, "${ctx.data}" is not supported.`,
        }),
      }),
    ),
    minEducation: z.preprocess(
      (input) => {
        if (typeof input === 'string') {
          return input.toLowerCase().trim();
        }
        return input;
      },
      z.enum(['gcse', "bachelor's degree", "master's degree", 'certificate of higher education', 'phd'], {
        errorMap: (_issue, ctx) => ({
          message: `Please select a correct option for minEducation, "${ctx.data}" is not supported.`,
        }),
      }),
    ),
    positionsAvailable: z.number().default(1),
    experience: z.enum(['no experience', '1 Year - 2 Years', '2 Year - 5 Years', '5 Years+'], {
      errorMap: (_issue, ctx) => ({
        message: `Please select a correct option for experience, "${ctx.data}" is not supported.`,
      }),
    }),
    salary: z.number().min(1, 'Please enter expected salary for this job.'),
    deadline: z.date().default(new Date(new Date().setDate(new Date().getDate() + 7))),
    applicantsApplied: z.array(z.string()).optional().default([]),
    createdAt: z.date().optional().default(new Date()),
    updatedAt: z.date().optional().default(new Date()),
  })
  .strict();

export const JobIdParam = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID. Input must be a 24 character hex string.'),
});

export type Job = z.infer<typeof JobSchema>;
export type JobIdParam = z.infer<typeof JobIdParam>;

export default JobSchema;
