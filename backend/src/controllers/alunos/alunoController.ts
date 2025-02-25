import { InternalError } from "../../core/errors/InternalError";

export async function create() {
  try {
    const alunoData = "a"
  }
  catch(error) {
    throw new InternalError(`Erro ao criar novo aluno: ${error}`);
  }
} 