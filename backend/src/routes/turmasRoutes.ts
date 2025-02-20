import { addAlunoInTurmaHandler, createTurmaHandler, getAllTurmasQuery, getTurmaByIdQuery } from "../controllers/turmas/turmasController";
import { TurmasService } from "../services/turmasService";
import { FastifyInstance } from "fastify";

export async function turmasRoutes(app: FastifyInstance, opts: { turmasService: TurmasService }) {
  const { turmasService } = opts;

  app.get("/", async (request, reply) => getAllTurmasQuery(request, reply, turmasService));
  app.get("/:id", async (request, reply) => getTurmaByIdQuery(request, reply, turmasService));
  app.post("/", async (request, reply) => createTurmaHandler(request, reply, turmasService))
  app.post("/add-aluno", async (request, reply) => addAlunoInTurmaHandler(request, reply, turmasService));
}