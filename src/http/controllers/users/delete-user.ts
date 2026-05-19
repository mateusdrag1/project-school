import { NextFunction, Request, Response } from "express";
import { DeleteUserUseCase } from "../../../use-cases/delete-user";

export class DeleteUserController {
  constructor(private useCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      await this.useCase.execute(req.params.id!);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
