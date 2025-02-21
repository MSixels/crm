import { AddAlunoDto } from "../controllers/turmas/dtos/AddAlunoDto";
import { Turma } from "../models/Turma";
import { TurmasRepository } from "../repositories/turmasRepository";
import { IAddAluno } from "./interfaces/IAddAluno";
import { IAlunoInTurma } from "./interfaces/IAlunoInTurma";

export class TurmasService {
  private readonly turmasRepository: TurmasRepository;

  constructor(turmasRepository: TurmasRepository) {
    this.turmasRepository = turmasRepository;
  }

  async getAllTurmas() {
    return this.turmasRepository.getAll();
  }

  async getTurmaById(id: string) {
    return this.turmasRepository.getById(id);
  }

  async createTurma(data: Turma) {
    this.deactiveOthersTurmas()
    return this.turmasRepository.create(data);
  }

  async addAlunoInTurma(alunoInTurmaData: AddAlunoDto) {
    const data: IAddAluno = {
      alunoEmail: alunoInTurmaData.alunoEmail,
      alunoName: alunoInTurmaData.alunoName,
    } 
    await this.turmasRepository.createSubCollection<IAddAluno>("turmas", alunoInTurmaData.turmaId, "alunos", alunoInTurmaData.alunoId, data);
  }

  async editTurma(data: Turma, turmaId: string) {
    if(data.active) this.deactiveOthersTurmas(turmaId)
    return this.turmasRepository.update(turmaId, data);
  }

  async changeTurmaStatus(turmaId: string) {
    const turma = await this.turmasRepository.getById(turmaId);
    const data = {...turma, active: !turma?.active }

    if(data.active) this.deactiveOthersTurmas(turmaId);

    return this.turmasRepository.update(turmaId, data);
  }

  async getAlunosInTurma(turmaId: string) {
    return this.turmasRepository.getSubCollection<IAlunoInTurma>("turmas", turmaId, "alunos");
  }

  private async deactiveOthersTurmas(turmaId?: string) {
    return this.turmasRepository.deactiveOthersTurmas(turmaId);
  }

}