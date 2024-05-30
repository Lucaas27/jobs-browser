import { vi } from 'vitest';

// Mock cursor object with toArray, limit, and sort methods
// These methods simulate the cursor returned by MongoDB's find() operation
const mockCursor = {
  // Mock toArray method to simulate converting cursor to an array of documents
  toArray: vi.fn().mockReturnValue([]),
  // Mock limit method to chain and return the cursor itself
  limit: vi.fn().mockReturnThis(),
  // Mock sort method to chain and return the cursor itself
  sort: vi.fn().mockReturnThis(),
};

// Mock collection object to simulate MongoDB collection operations
const mockCollection = {
  // Mock find method to return the mockCursor object
  find: vi.fn(() => mockCursor),
  // Mock findOne method to simulate finding a single document
  findOne: vi.fn(),
  // Mock insertOne method to simulate inserting a document
  insertOne: vi.fn(),
  // Mock findOneAndUpdate method to simulate updating a document
  findOneAndUpdate: vi.fn(),
  // Mock deleteOne method to simulate deleting a document
  deleteOne: vi.fn(),
};

// Mock database object to simulate MongoDB database operations
const mockDb = {
  // Mock collection method to return the mockCollection object
  collection: vi.fn(() => mockCollection),
};

// Mock client object to simulate MongoDB client operations
const mockClient = {
  // Mock connect method to simulate establishing a connection to the database
  connect: vi.fn(),
  // Mock db method to return the mockDb object
  db: vi.fn(() => mockDb),
  // Mock close method to simulate closing the database connection
  close: vi.fn(),
};

// Mock the resolved value of the connect method to return the mockClient itself
mockClient.connect.mockResolvedValue(mockClient);

// Mock MongoClient constructor to return the mockClient object
const MongoClient = vi.fn(() => mockClient);

// Export the mocks for use in tests
export { MongoClient, mockCollection, mockDb, mockCursor };
