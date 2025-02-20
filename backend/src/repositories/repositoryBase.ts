import { firestore } from "../config/firebaseConfig";
import { IRepository } from "../core/interfaces/IRepository";
import { DocumentData, WithFieldValue } from "firebase-admin/firestore";

export class RepositoryBase<T extends DocumentData> implements IRepository<T> {
  constructor(private collectionName: string) {}

    async getAll(): Promise<T[]> {
      const collectionRef = firestore.collection(this.collectionName);
      const snapshot = await collectionRef.get();
  
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as unknown as T)); 
  }

  async getById(id: string): Promise<T | null> {
    const docRef = firestore.collection(this.collectionName).doc(id);
    const snapshot = await docRef.get();
    return snapshot.exists ? ({ id: snapshot.id, ...snapshot.data() } as unknown as T) : null;
  }

  async create(data: WithFieldValue<T>): Promise<string> {
    const collectionRef = firestore.collection(this.collectionName);
    const docRef = await collectionRef.add(data);
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = firestore.collection(this.collectionName).doc(id);
    await docRef.update(data);
  }

  async delete(id: string): Promise<void> {
    const docRef = firestore.collection(this.collectionName).doc(id);
    await docRef.delete();
  }

  async createSubCollection<W extends DocumentData>(principalCollectionName: string, principalCollectionId: string, subCollectionName: string, subCollectionId: string, data: WithFieldValue<W>): Promise<void> {
    const docRef = firestore
    .collection(principalCollectionName)
    .doc(principalCollectionId)
    .collection(subCollectionName)
    .doc(subCollectionId);

    await docRef.set(data);
  }
}