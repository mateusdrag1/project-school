import type { NextFunction, Request, Response } from "express";
import { CreatePublicPostUseCase } from "../../../use-cases/create-public-post";

export class CreatePublicPostController {
  constructor(private readonly useCase: CreatePublicPostUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, content, author, category, published } =
        req.body;

      const newPost = await this.useCase.execute({
        title,
        description,
        content,
        author,
        category,
        published,
      });
      return res.status(201).json({
        message: "Post criado com sucesso!",
        post: newPost,
      });
    } catch (err) {
      next(err);
    }
  }
}
