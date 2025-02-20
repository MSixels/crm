import { Turma } from "../models/Turma";
import { RepositoryBase } from "./repositoryBase";

export class TurmasRepository extends RepositoryBase<Turma> {
  private static readonly COLLECTION_NAME = "turmas"

  constructor() {
    super(TurmasRepository.COLLECTION_NAME)
  }
}