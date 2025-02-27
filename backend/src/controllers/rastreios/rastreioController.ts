import { FastifyReply, FastifyRequest } from "fastify";
import { RastreiosService } from "../../services/rastreiosService";
import { InternalError } from "../../core/errors/InternalError";
import { generatePdfSchema } from "./rastreioSchema";

export async function getAllRastreiosQuery(request: FastifyRequest, reply: FastifyReply, rastreiosService: RastreiosService) {
  try {
    const { limit, name, turmaId, nextCursor } = request.query as {
      limit?: string;
      name?: string;
      turmaId?: string;
      nextCursor?: string; 
    };

    const pageSize = limit ? parseInt(limit, 10) : 10;

    const rastreios = await rastreiosService.getAll(
      pageSize,
      nextCursor,
      name,
      turmaId,
    );

    reply.send(rastreios);
  } catch (error) {
    throw new InternalError("Erro ao buscar rastreios");
  }
}

export async function downloadRastreiosPdf(request: FastifyRequest, reply: FastifyReply, rastreiosService: RastreiosService) {
  try {
    const data = generatePdfSchema.parse(request.body);
    const pdfBuffer = await rastreiosService.generatePDF(data.ids);

    reply
      .type("application/pdf")
      .header("Content-Disposition", `attachment; filename="rastreios.pdf"`)
      .send(pdfBuffer);
  } catch (error) {
    throw new InternalError("Erro ao gerar o PDF");
  }
}