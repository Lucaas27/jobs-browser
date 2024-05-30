import { z } from 'zod';

const APIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  count: z.number().optional(),
});

export type APIResponse = z.infer<typeof APIResponseSchema>;

export default APIResponseSchema;
