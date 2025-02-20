import { FastifyReply, FastifyRequest } from "fastify";
import { TurmasService } from "../../services/turmasService";
import { Turma } from "../../models/Turma";
import { addAlunoInTurmaSchema, createTurmaSchema } from "./turmaSchema";
import { InternalError } from "../../core/errors/InternalError";
import { NotFoundError } from "../../core/errors/NotFoundError";
import { BadRequestError } from "../../core/errors/BadRequestError";

export async function getAllTurmasQuery(_: FastifyRequest, reply: FastifyReply, turmasService: TurmasService) {
  try {
    const turmas = await turmasService.getAllTurmas();
    reply.send(turmas);
  } catch (error) {
    throw new InternalError("Erro ao buscar turmas");
  }
}

export async function getTurmaByIdQuery(req: FastifyRequest, reply: FastifyReply, turmasService: TurmasService) {
  try {
    const { id } = req.params as { id: string };
    if (!id) throw new BadRequestError("O id não pode ser vazio");

    const turma = await turmasService.getTurmaById(id);
    if (!turma) throw new NotFoundError("Turma não encontrada");

    reply.send(turma);
  } catch (error) {
    throw new InternalError(`Erro ao buscar turma: ${error}`);
  }
}

export async function createTurmaHandler(req: FastifyRequest, reply: FastifyReply, turmasService: TurmasService) {
  try {
    const turmaData = createTurmaSchema.parse(req.body);
    const turma = await turmasService.createTurma(turmaData as Turma);
    reply.send(turma);
  } catch (error) {
    throw new InternalError(`Erro ao criar turma: ${error}`);
  }


}

export async function addAlunoInTurmaHandler(req: FastifyRequest, reply: FastifyReply, turmasService: TurmasService) {
    try {
      const alunoInTurmaData = addAlunoInTurmaSchema.parse(req.body);
      await turmasService.addAlunoInTurma(alunoInTurmaData);
      reply.send(true);
    }
    catch(error) {
      throw new InternalError(`Erro ao adicionar aluno dentro de uma turma: ${error}`);
    }
}