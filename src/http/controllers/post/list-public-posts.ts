import type { NextFunction, Request, Response } from "express";
import { ListPublicPostsUseCase } from "../../../use-cases/list-public-posts";

export class ListPublicPostsController {
  constructor(private readonly useCase: ListPublicPostsUseCase) {}

  async handle(_req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await this.useCase.execute();
      return res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  }
}
