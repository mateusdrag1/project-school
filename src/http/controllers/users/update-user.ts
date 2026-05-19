import { NextFunction, Request, Response } from "express";
import { UpdateUserUseCase } from "../../../use-cases/update-user";

export class UpdateUserController {
  constructor(private useCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      const user = await this.useCase.execute(id!, { name, email, password });
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}
