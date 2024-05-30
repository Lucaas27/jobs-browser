import APIResponseSchema from '@/interfaces/APIResponse.js';
import { z } from 'zod';

const ErrorResponseSchema = APIResponseSchema.extend({
  error: z.object({
    name: z.string(),
    message: z.union([z.string(), z.array(z.string())]),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export default ErrorResponseSchema;
