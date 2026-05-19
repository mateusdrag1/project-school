import { NextFunction, Request, Response } from "express";
import { TypeORMUserRepository } from "../../../repositories/typeorm/user.repository";
import { AuthenticateUserUseCase } from "../../../use-cases/authenticate-user";

export class AuthenticateUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = new TypeORMUserRepository();
      const authenticateUserUseCase = new AuthenticateUserUseCase(
        userRepository,
      );

      const response = await authenticateUserUseCase.execute(req.body);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
