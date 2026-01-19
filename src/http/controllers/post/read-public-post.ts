import type { NextFunction, Request, Response } from "express";
import { ReadPublicPostUseCase } from "../../../use-cases/read-public-post";

export class ReadPublicPostController {
  constructor(private readonly useCase: ReadPublicPostUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await this.useCase.execute(id as string);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  }
}
