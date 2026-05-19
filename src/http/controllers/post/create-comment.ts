import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../../../env";
import { TypeORMCommentRepository } from "../../../repositories/typeorm/comment.repository";
import { CreateCommentUseCase } from "../../../use-cases/create-comment";

export class CreateCommentController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const commentRepository = new TypeORMCommentRepository();
      const createCommentUseCase = new CreateCommentUseCase(commentRepository);

      const authHeader = req.headers.authorization;
      let userId: string | undefined;

      if (authHeader) {
        const [, token] = authHeader.split(" ");

        if (!token) {
          return res.status(401).json({ message: "JWT token is missing" });
        }

        try {
          const decoded = verify(token, env.JWT_SECRET);
          userId = (decoded as any).sub;
        } catch (err) {}
      }

      const { postId, authorName, content } = req.body;

      const comment = await createCommentUseCase.execute({
        postId,
        userId,
        authorName,
        content,
      });

      return res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
}
