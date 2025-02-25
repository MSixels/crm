import { z } from "zod";

export const create = z.object({
  cpf: z.string(),
  name: z.string(),
  email: z.string(),
  matricula: z.string().optional(), 
  unidade: z.string().optional(), 
});