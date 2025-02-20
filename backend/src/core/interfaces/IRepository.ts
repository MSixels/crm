import { DocumentData, WithFieldValue } from "firebase-admin/firestore";

export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: T): Promise<string>;
  update(id: string, data: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  createSubCollection<W extends DocumentData>(principalCollectionName: string, principalCollectionId: string, subCollectionName: string, subCollectionId: string, data: WithFieldValue<W>): Promise<void>
}