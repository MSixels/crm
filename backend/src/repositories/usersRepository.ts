import { User } from "../models/User";
import { RepositoryBase } from "./repositoryBase";
import { firestore } from "../config/firebaseConfig";

export class UsersRepository extends RepositoryBase<User> {
  private static readonly COLLECTION_NAME = "users"

  constructor() {
    super(UsersRepository.COLLECTION_NAME)
  }

  async getUsersAreAlunosByUserIds(userIds: string[]): Promise<User[]> {
    const usersSnapshot = await firestore
    .collection(UsersRepository.COLLECTION_NAME)
    .where("type", "==", 3) 
    .get();

    if(usersSnapshot.empty) return []

    const usersIncludeInIds = usersSnapshot.docs
    .filter((docSnap) => userIds.includes(docSnap.id))
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as unknown as User));

    return usersIncludeInIds;
  }
}