import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import mongoService from '@/services/mongo.service';
import { mockCollection, mockCursor, mockDb, MongoClient } from 'tests/__mocks__/mongodb.js';
import { ObjectId } from 'mongodb';

describe('MongoDBService', () => {
  beforeEach(async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017';
    await mongoService.connect(); // Ensure MongoDBService is connected to the mock MongoDB
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear all mocks to ensure test isolation
  });

  describe('connect method', () => {
    it('should connect to MongoDB', async () => {
      expect(MongoClient().connect).toHaveBeenCalledOnce();
    });
    it('should handle error when MongoDB URI is not set', async () => {
      delete process.env.MONGO_URI; // Simulate MongoDB URI not being set
      await expect(mongoService.connect()).rejects.toThrow(/MongoDB URI not found in environment variables/);
    });

    it('should handle error when MongoDB connection fails', async () => {
      // Simulate MongoDB connection failure for a single call
      MongoClient().connect.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(mongoService.connect()).rejects.toThrow('Unable to connect to MongoDB: Connection failed');
    });
  });

  describe('getDB method', () => {
    it('should return the database', async () => {
      const db = mongoService.getDB();
      expect(db).toBeDefined();
    });

    it('should handle error when database is not available', () => {
      // Simulate DB connection not being initialized
      mongoService['_db'] = null;

      expect(() => {
        mongoService.getDB(); // This will throw internally
      }).toThrow('Database connection is currently down. Try again later');
    });
  });

  describe('getMongoClient method', () => {
    it('should return the connection', async () => {
      const connection = mongoService.getMongoClient();
      expect(connection).toBeDefined();
      expect(MongoClient().connect).toHaveBeenCalledOnce();
    });

    it('should handle error when connection is not available', () => {
      // Simulate DB connection not being initialized
      mongoService['_connection'] = null;

      expect(() => {
        mongoService.getMongoClient(); // This will throw internally
      }).toThrow('MongoDB connection is currently down. Try again later');
    });
  });

  describe('getDocuments method', () => {
    it('should retrieve all documents from a collection as an array', async () => {
      await mongoService.connect();
      const documents = [
        { id: '1', title: 'Test Document' },
        { id: '2', title: 'Test Document 2' },
      ];

      // Mock the toArray method to return documents
      mockCursor.toArray.mockResolvedValue(documents);

      const result = await mongoService.getDocuments('testcollection');

      expect(mockCollection.find).toHaveBeenCalledOnce();
      expect(mockDb.collection).toHaveBeenCalledWith('testcollection');
      expect(result).toEqual(documents);
      expect(result).toBeInstanceOf(Array);
    });

    it('should handle error when retrieving documents fails', async () => {
      mockCursor.toArray.mockRejectedValueOnce(new Error('Mock error message'));
      await expect(mongoService.getDocuments('testcollection')).rejects.toThrow(/Failed to retrieve documents/);

      expect(mockCursor.toArray).toHaveBeenCalledOnce();
      expect(mockCollection.find).toHaveBeenCalledOnce();
      expect(mockDb.collection).toHaveBeenCalledWith('testcollection');
    });
  });

  describe('getDocumentById method', () => {
    it('should retrieve a document by ID from a collection as an array', async () => {
      const document = { id: '664a0291d852f2522868b431', title: 'Test Document' };

      // Mock the findOne method to return document
      mockCollection.findOne.mockResolvedValue(document);

      const result = await mongoService.getDocumentById('testcollection', document.id);

      expect(result).toBeInstanceOf(Array);
      expect(mockCollection.findOne).toHaveBeenCalledOnce();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId(document.id) }); // Ensure the correct filter is used during the mongoService call
      expect(result).toEqual([document]);
    });

    it('should handle error if ID is not in the correct format', async () => {
      const id = 'test';
      await expect(mongoService.getDocumentById('testcollection', id)).rejects.toThrow(
        /Failed to retrieve document with ID "test": input must be a 24 character hex string, 12 byte Uint8Array, or an integer/,
      );
    });

    it('should return an empty array if document is not found', async () => {
      const id = '664a0291d852f2522868b431';

      // Mock the findOne method to return null
      mockCollection.findOne.mockResolvedValue(null);

      const result = await mongoService.getDocumentById('testcollection', id);

      expect(result).toBeInstanceOf(Array);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId(id) }); // Ensure the correct filter is used during the mongoService call
      expect(result.length).toEqual(0);
      expect(mockCollection.findOne).toHaveBeenCalledOnce();
    });
  });

  describe('createDocument method', () => {
    it('should create a new document in a collection', async () => {
      const newDocument = { id: '664a0291d852f2522868b431', title: 'New Document' };
      const insertResult = { acknowledged: true, insertedId: '664a0291d852f2522868b431' };

      // Mock the insertOne method to return insertResult
      mockCollection.insertOne.mockResolvedValue(insertResult);

      const result = await mongoService.createDocument('testcollection', newDocument);

      expect(result).toBeInstanceOf(Array);
      expect(mockCollection.insertOne).toHaveBeenCalledOnce();
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        ...newDocument,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }); // Check the document passed to insertOne during the mongoService call
      expect(result).toEqual([insertResult]);
      expect(result[0]).toHaveProperty('acknowledged', true);
      expect(result[0]).toHaveProperty('insertedId', '664a0291d852f2522868b431');
    });

    it('should handle error when creating a document fails', async () => {
      const newDocument = { id: '664a0291d852f2522868b431', title: 'New Document' };
      mockCollection.insertOne.mockRejectedValueOnce(new Error('Mock Failure')); // Simulate insertion error

      await expect(mongoService.createDocument('testcollection', newDocument)).rejects.toThrow(
        /Failed to create document: Mock Failure/,
      );
      expect(mockCollection.insertOne).toHaveBeenCalledOnce();
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        ...newDocument,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }); // Ensure the correct filter is used during the mongoService call
    });

    it('should return an empty array when acknowledged value is false', async () => {
      const newDocument = { title: 'New Document' };
      mockCollection.insertOne.mockResolvedValue({ acknowledged: false }); // Simulate insertion failure

      const result = await mongoService.createDocument('testcollection', newDocument);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);
      expect(mockCollection.insertOne).toHaveBeenCalledOnce();
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        ...newDocument,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }); // Ensure the correct filter is used during the mongoService call
    });
  });

  describe('updateDocument method', () => {
    it('should update a document in a collection', async () => {
      const updatedDocument = { title: 'Updated Document' };
      const returnedDocument = { _id: '664a0291d852f2522868b431', ...updatedDocument };
      const id = '664a0291d852f2522868b431';
      mockCollection.findOneAndUpdate.mockResolvedValue(returnedDocument);
      const result = await mongoService.updateDocument('testcollection', id, updatedDocument);

      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([returnedDocument]);
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledOnce();
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: new ObjectId(id) },
        { $set: { ...updatedDocument, updatedAt: expect.any(Date) } },
        { returnDocument: 'after' },
      ); // Ensure the correct filter is used during the mongoService call
    });

    it('should handle error when updating a document fails', async () => {
      const updatedDocument = { title: 'Updated Document' };
      const id = '664a0291d852f2522868b431';
      mockCollection.findOneAndUpdate.mockRejectedValueOnce(new Error('Mock Failure')); // Simulate update failure

      await expect(mongoService.updateDocument('testcollection', id, updatedDocument)).rejects.toThrow(
        /Failed to update document/,
      );
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledOnce();
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: new ObjectId(id) },
        { $set: { ...updatedDocument, updatedAt: expect.any(Date) } },
        { returnDocument: 'after' },
      ); // Ensure the correct filter is used during the mongoService call
    });

    it('should handle error when updating a document returns null', async () => {
      const updatedDocument = { title: 'Updated Document' };
      const id = '664a0291d852f2522868b431';
      mockCollection.findOneAndUpdate.mockResolvedValueOnce(null); // Simulate null result

      const result = await mongoService.updateDocument('testcollection', id, updatedDocument);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledOnce();
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: new ObjectId(id) },
        { $set: { ...updatedDocument, updatedAt: expect.any(Date) } },
        { returnDocument: 'after' },
      ); // Ensure the correct filter is used during the mongoService call
    });
  });

  describe('deleteDocument method', () => {
    it('should delete a document from a collection', async () => {
      const id = '664a0291d852f2522868b431';
      mockCollection.deleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
      const result = await mongoService.deleteDocument('testcollection', id);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(1);
      expect(result).toEqual([{ acknowledged: true, deletedCount: 1 }]);
      expect(mockCollection.deleteOne).toHaveBeenCalledOnce();
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: new ObjectId(id) }); // Ensure the correct filter is used during the mongoService call
    });

    it('should return an empty array if deleted value is less than 1', async () => {
      const id = '664a0291d852f2522868b431';
      mockCollection.deleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 0 });
      const result = await mongoService.deleteDocument('testcollection', id);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);
      expect(mockCollection.deleteOne).toHaveBeenCalledOnce();
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: new ObjectId(id) }); // Ensure the correct filter is used during the mongoService call
    });
    it('should handle error when deleting a document fails', async () => {
      const id = '664a0291d852f2522868b431';
      mockCollection.deleteOne.mockRejectedValueOnce(new Error('Mock Failure')); // Simulate deletion failure

      await expect(mongoService.deleteDocument('testcollection', id)).rejects.toThrow(/Failed to delete document/);
      expect(mockCollection.deleteOne).toHaveBeenCalledOnce();
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: new ObjectId(id) });
    });
  });
});
