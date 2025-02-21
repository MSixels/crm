import { z } from "zod";


export const createTurmaSchema = z.object({
  name: z.string(),
  description: z.string(),
  modulos: z.array(z.string()).default([]),
  endDate: z.union([z.string().datetime(), z.null()]), 
  active: z.boolean(), 
  startDate: z.string().datetime(),
});

export const addAlunoInTurmaSchema = z.object({
  alunoName: z.string(),
  alunoEmail: z.string().email(),
  turmaId: z.string(),
  alunoId: z.string()
})

export const editTurmaSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().optional(), 
  startDate: z.string().datetime().optional(),
  endDate: z.union([z.string().datetime(), z.null()]).optional(),
})