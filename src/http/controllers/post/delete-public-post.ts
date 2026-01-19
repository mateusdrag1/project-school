import type { Response } from "express";
import { DeletePublicPostUseCase } from "../../../use-cases/delete-public-post";

export class DeletePublicPostController {
  constructor(
    private readonly deletePublicPostUseCase: DeletePublicPostUseCase,
  ) {}

  async handle(req: { params: { id: string } }, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "O ID é obrigatório." });
      }

      await this.deletePublicPostUseCase.execute(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Erro ao deletar o post.",
      });
    }
  }
}
