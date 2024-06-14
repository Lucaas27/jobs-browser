import {
  Db,
  MongoClient,
  Document,
  ObjectId,
  DeleteResult,
  OptionalUnlessRequiredId,
  Filter,
  WithId,
  InsertOneResult,
} from 'mongodb';
import { logger } from '@/lib/logger.js';
import { MongoService } from '@/interfaces/MongoService.js';

/**
 * Represents a MongoDB service that provides CRUD operations for MongoDB collections.
 */
class MongoDBService implements MongoService {
  /**
   * The MongoDB client instance.
   * @private
   */
  private _connection: MongoClient | null = null;

  /**
   * The MongoDB database instance.
   * @private
   */
  private _db: Db | null = null;

  /**
   * Connects to the MongoDB cluster using the provided URI and database name.
   *
   * @return {Promise<void>} Promise that resolves once the connection is established
   */
  async connect(): Promise<void> {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error(`MongoDB URI not found in environment variables. Exiting...`);
      }
      // Connect to MongoDB cluster
      this._connection = await new MongoClient(process.env.MONGO_URI).connect();
      // Select database
      this._db = this._connection.db(process.env.MONGO_DB || 'jobs_browser');
      logger.debug(`Connected to MongoDB - using database: ${this._db.databaseName}`);
    } catch (error) {
      throw new Error(`Unable to connect to MongoDB: ${error.message || error}`);
    }
  }

  /**
   * Retrieves the MongoDB client instance.
   *
   * @return {MongoClient} The MongoDB client instance.
   */
  getMongoClient(): MongoClient {
    if (!this._connection) {
      throw new Error('MongoDB connection is currently down. Try again later');
    }
    return this._connection;
  }

  /**
   * Retrieves the MongoDB database instance.
   *
   * @return {Db} The MongoDB database instance.
   */
  getDB(): Db {
    if (!this._db) {
      throw new Error('Database connection is currently down. Try again later');
    }
    return this._db;
  }

  /**
   * Retrieves all documents from a specified collection.
   *
   * @param {string} collectionName - The name of the collection to retrieve documents from
   * @return {Promise<WithId<T>[] | never[]>} An array of documents with ids from the specified collection when promise resolves or an empty array if no documents are found
   */
  async getDocuments<T extends Document>(collectionName: string): Promise<WithId<T>[] | never[]> {
    try {
      const db = this.getDB();
      const cursor = db.collection<T>(collectionName).find();

      const result = await cursor.toArray();

      return result;
    } catch (error) {
      logger.error(`Failed to retrieve documents from the database: ${error.message || error}`);
      throw new Error(`Failed to retrieve documents from the database: ${error.message || error}`);
    }
  }

  /**
   * Retrieves a document by ID from a specified collection.
   *
   * @param {string} collectionName - The name of the collection to retrieve the document from
   * @param {string } id - The ID of the document to retrieve
   * @return {Promise<WithId<T> | never[]>} The retrieved document with id as an array when promise resolves or empty array if not found
   */
  async getDocumentById<T extends Document>(collectionName: string, id: string): Promise<WithId<T>[] | never[]> {
    try {
      const db = this.getDB();

      const result = await db.collection<T>(collectionName).findOne({ _id: new ObjectId(id) } as Filter<T>);
      if (!result) {
        return [];
      }

      return [result];
    } catch (error) {
      logger.error(`Failed to retrieve document with ID "${id}": ${error.message || error}`);
      throw new Error(`Failed to retrieve document with ID "${id}": ${error.message || error}`);
    }
  }

  /**
   * Creates a new document in the specified collection.
   *
   * @param {string} collectionName - The name of the collection to insert the document into
   * @param {OptionalUnlessRequiredId<T>} document - The document to be inserted
   * @return {Promise<WithId<T>[] | never[]>} The inserted document as an array or an empty array if not found when promise resolves
   */
  async createDocument<T extends Document>(
    collectionName: string,
    document: OptionalUnlessRequiredId<T>,
  ): Promise<never[] | InsertOneResult<T>[]> {
    try {
      const db = this.getDB();

      const result = await db
        .collection<T>(collectionName)
        .insertOne({ ...document, createdAt: new Date(), updatedAt: new Date() });

      if (!result.acknowledged) {
        return [];
      }

      return [result];
    } catch (error) {
      logger.error(`Failed to create document: ${error.message || error}`);
      throw new Error(`Failed to create document: ${error.message || error}`);
    }
  }

  /**
   * Updates a document in the specified collection.
   *
   * @param {string} collectionName - The name of the collection to update the document in
   * @param {string } id - The ID of the document to update
   * @param {Partial<T>} document - The partial document with updated values
   * @return {Promise<WithId<T>[]>} The updated document with id as an array when promise resolves
   */
  async updateDocument<T extends Document>(
    collectionName: string,
    id: string,
    document: Partial<T>,
  ): Promise<WithId<T>[]> {
    try {
      const db = this.getDB();
      const updateDoc = { $set: { ...document, updatedAt: new Date() } };
      const result = await db
        .collection<T>(collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) } as Filter<T>, updateDoc, { returnDocument: 'after' });

      if (!result) {
        return [];
      }

      return [result];
    } catch (error) {
      logger.error(`Failed to update document with ID "${id}": ${error.message || error}`);
      throw new Error(`Failed to update document with ID "${id}": ${error.message || error}`);
    }
  }

  /**
   * Deletes a document from the specified collection.
   *
   * @param {string} collectionName - The name of the collection to delete the document from
   * @param {string } id - The ID of the document to delete
   * @return {Promise<DeleteResult[] >} The result of the deletion operation as an array or undefined if deletion fails when promise resolves
   */
  async deleteDocument<T extends Document>(collectionName: string, id: string): Promise<DeleteResult[]> {
    try {
      const db = this.getDB();
      const result: DeleteResult = await db
        .collection<T>(collectionName)
        .deleteOne({ _id: new ObjectId(id) } as Filter<T>);

      if (result.deletedCount !== 1) {
        return [];
      }

      return [result];
    } catch (error) {
      logger.error(`Failed to delete document with ID "${id}": ${error.message || error}`);
      throw new Error(`Failed to delete document with ID "${id}": ${error.message || error}`);
    }
  }
}
const mongoService = new MongoDBService();

export default mongoService;
