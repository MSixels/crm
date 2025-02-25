import { evaluateStatusCrianca } from "../core/utils/rastreios/calculateResult";
import { getFaixaEtaria } from "../core/utils/rastreios/getFaixaEtaria";
import { RastreiosRepository } from "../repositories/rastreiosRepository";
import { TurmasRepository } from "../repositories/turmasRepository";
import { UsersRepository } from "../repositories/usersRepository";

export class RastreiosService {
  private readonly rastreiosRepository: RastreiosRepository;
  private readonly turmasRepository: TurmasRepository;
  private readonly usersRepository: UsersRepository

  constructor(rastreiosRepository: RastreiosRepository, turmasRepository: TurmasRepository, usersRepository: UsersRepository) {
    this.rastreiosRepository = rastreiosRepository;
    this.turmasRepository = turmasRepository;
    this.usersRepository = usersRepository;
  }

  async getAll(limit: number, cursor?: string, nomeAluno?: string, turmaId?: string) {
    let userIds: string[] = [];

    if (nomeAluno || turmaId) {
      const users = await this.usersRepository.getUsersByNameOrTurma(nomeAluno, turmaId);
      userIds = users.map(u => u.userId);
    }

    const rastreios = await this.rastreiosRepository.getWithFilters(limit, cursor, userIds);

    if(rastreios.length === 0) return { rastreios: [], nextCursor: null }

    const fetchedUserIds = [...new Set(rastreios.map(r => r.userId))];
    const users = await this.usersRepository.getByIds(fetchedUserIds, "userId");
    const usersMap = new Map(users?.map(u => [u.userId, u]));

    const fetchedTurmaIds = [...new Set(users?.map(u => u.turmaId).filter(Boolean))];
    const turmas = fetchedTurmaIds.length > 0 ? await this.turmasRepository.getByIds(fetchedTurmaIds) : [];
    const turmasMap = new Map(turmas?.map(u => [u.id, u.name]));

    const data = rastreios.map(rastreio => {
      const aluno = usersMap.get(rastreio.userId);
      const turma = aluno ? turmasMap?.get(aluno.turmaId) : "Sem turma"

      return {
        id: rastreio.id,
        nomeAluno: aluno?.name ?? "",
        turma,
        faixaEtaria: getFaixaEtaria(rastreio.typeQuest),
        dataRastreio: rastreio.createdAt.toDate().toISOString(),
        resultado: evaluateStatusCrianca(rastreio),
      };
    });

    const lastDoc = rastreios[rastreios.length - 1];

    return {
      rastreios: data,
      nextCursor: lastDoc ? lastDoc.id : null,
    };
  }
}