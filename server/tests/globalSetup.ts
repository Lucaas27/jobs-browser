import { vi } from 'vitest';
import * as mongodb from './__mocks__/mongodb.js';

// Mocking the MongoDB client
vi.mock('mongodb', async (importOriginal) => {
  const original = await importOriginal<typeof import('mongodb')>();
  // Partially replacing mongodb driver with my mock
  return { ...original, ...mongodb };
});
