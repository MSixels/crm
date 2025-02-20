import 'dotenv/config'
import Fastify from "fastify";
import cors from "@fastify/cors";
import { turmasRoutes } from "./routes/turmasRoutes";
import { TurmasRepository } from './repositories/turmasRepository';
import { TurmasService } from './services/turmasService';
import { AppError } from './core/errors/AppError';

export const app = Fastify({
  logger: true, 
});

app.register(cors, {
  origin: "*", 
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({ message: error.message });
  } else {
    console.error(error);
    reply.status(500).send({ message: "Erro interno no servidor" });
  }
});

const turmasRepository = new TurmasRepository();
const turmasService = new TurmasService(turmasRepository);

app.register(turmasRoutes, { prefix: "/turmas", turmasService });