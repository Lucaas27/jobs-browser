import { z } from 'zod';

const RequestValidatorsSchema = z.object({
  body: z.instanceof(z.ZodObject).optional(),
  params: z.instanceof(z.ZodObject).optional(),
  query: z.instanceof(z.ZodObject).optional(),
});

export type RequestValidators = z.infer<typeof RequestValidatorsSchema>;

export default RequestValidatorsSchema;
