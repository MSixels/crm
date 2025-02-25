import { FastifyInstance } from "fastify";
import { RastreiosService } from "../services/rastreiosService";
import { getAllRastreiosQuery } from "../controllers/rastreios/rastreioController";

export async function rastreiosRoutes(app: FastifyInstance, opts: { rastreiosService: RastreiosService }) {
  const { rastreiosService } = opts;

  app.get("/", async (request, reply) => getAllRastreiosQuery(request, reply, rastreiosService));
}