import type { NextFunction, Request, Response } from "express";
import { EditPublicPostUseCase } from "../../../use-cases/edit-public-post";

export class EditPublicPostController {
  constructor(private readonly useCase: EditPublicPostUseCase) {}
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, content, author, category, published } =
        req.body;
      const updatedPost = await this.useCase.execute(id as string, {
        title,
        description,
        content,
        author,
        category,
        published,
      });
      if (!updatedPost) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      return res.status(200).json({
        message: "Post atualizado com sucesso!",
        post: updatedPost,
      });
    } catch (err) {
      next(err);
    }
  }
}
