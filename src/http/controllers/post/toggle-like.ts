import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../../../env";
import { TypeORMLikeRepository } from "../../../repositories/typeorm/like.repository";
import { ToggleLikeUseCase } from "../../../use-cases/toggle-like";

export class ToggleLikeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const likeRepository = new TypeORMLikeRepository();
      const toggleLikeUseCase = new ToggleLikeUseCase(likeRepository);

      const authHeader = req.headers.authorization;
      let userId: string | undefined;

      if (authHeader) {
        const [, token] = authHeader.split(" ");
        try {
          const decoded = verify(token, env.JWT_SECRET);
          userId = (decoded as any).sub;
        } catch (err) {}
      }

      const { postId } = req.body;

      const result = await toggleLikeUseCase.execute({
        postId,
        userId,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
