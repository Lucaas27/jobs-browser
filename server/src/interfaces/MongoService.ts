import { Document, DeleteResult, OptionalUnlessRequiredId, WithId, MongoClient, Db, InsertOneResult } from 'mongodb';

export interface MongoService {
  connect(): Promise<void>;
  getDB(): Db;
  getMongoClient(): MongoClient;
  getDocuments<T extends Document>(collectionName: string): Promise<WithId<T>[] | never[]>;
  getDocumentById<T extends Document>(collectionName: string, id: string): Promise<WithId<T>[] | never[]>;
  createDocument<T extends Document>(
    collectionName: string,
    document: OptionalUnlessRequiredId<T>,
  ): Promise<never[] | InsertOneResult<T>[]>;
  updateDocument<T extends Document>(
    collectionName: string,
    id: string,
    document: Partial<T>,
  ): Promise<WithId<T>[] | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteDocument<T extends Document>(collectionName: string, id: string): Promise<DeleteResult[] | never[]>;
}
