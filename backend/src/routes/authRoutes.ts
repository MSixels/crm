import { FastifyInstance } from "fastify";
import { AuthService } from "../services/authService";
import { CpfLightService } from "../integrations/cpfLight";

export async function authRoutes(app: FastifyInstance, opts: { authService: AuthService }) {
  const { authService } = opts;
  const t = new CpfLightService();

  app.get('/', () => t.authenticate())
}