import { AddAlunoDto } from "../controllers/turmas/dtos/AddAlunoDto";
import { IRepository } from "../core/interfaces/IRepository";
import { Turma } from "../models/Turma";
import { IAddAluno } from "./interfaces/IAddAluno";

export class TurmasService {
  private readonly turmasRepository: IRepository<Turma>;

  constructor(turmasRepository: IRepository<Turma>) {
    this.turmasRepository = turmasRepository;
  }

  async getAllTurmas() {
    return this.turmasRepository.getAll();
  }

  async getTurmaById(id: string) {
    return this.turmasRepository.getById(id);
  }

  async createTurma(data: Turma) {
    return this.turmasRepository.create(data);
  }

  async addAlunoInTurma(alunoInTurmaData: AddAlunoDto) {
    const data: IAddAluno = {
      alunoEmail: alunoInTurmaData.alunoEmail,
      alunoName: alunoInTurmaData.alunoName,
    } 
    await this.turmasRepository.createSubCollection<IAddAluno>("turmas", alunoInTurmaData.turmaId, "alunos", alunoInTurmaData.alunoId, data);
  }
}