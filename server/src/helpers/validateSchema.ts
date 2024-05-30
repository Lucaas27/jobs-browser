import { z } from 'zod';

const validateSchema = (schema: z.AnyZodObject, data: unknown) => {
  const result = schema.safeParse(data);

  return result.success;
};

export default validateSchema;
