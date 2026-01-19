import type { NextFunction } from "express";
import { SearchPublicPostsUseCase } from "../../../use-cases/search-public-posts";

export class SearchPublicPostsController {
  constructor(
    private readonly searchPublicPostsUseCase: SearchPublicPostsUseCase,
  ) {}
  async handle(req: any, res: any, next: NextFunction) {
    try {
      const { q } = req.query;
      const posts = await this.searchPublicPostsUseCase.execute(String(q));
      return res.status(200).json(posts);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
