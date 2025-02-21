import { firestore } from "../config/firebaseConfig";
import { Turma } from "../models/Turma";
import { RepositoryBase } from "./repositoryBase";

export class TurmasRepository extends RepositoryBase<Turma> {
  private static readonly COLLECTION_NAME = "turmas"

  constructor() {
    super(TurmasRepository.COLLECTION_NAME)
  }

  async deactiveOthersTurmas(exceptTurmaId?: string) {
    const turmasAtivas = await firestore.collection(TurmasRepository.COLLECTION_NAME).where("active", "==", true).get();
    if (turmasAtivas.empty) return;
    const batch = firestore.batch();
    turmasAtivas.forEach((doc) => {
      if (exceptTurmaId && doc.id !== exceptTurmaId) {
        batch.update(doc.ref, { active: false });
      }
    });
  
    await batch.commit();
  }
}