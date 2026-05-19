import { NextFunction, Request, Response } from "express";
import { TypeORMUserRepository } from "../../../repositories/typeorm/user.repository";
import { RegisterUserUseCase } from "../../../use-cases/register-user";

export class RegisterUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = new TypeORMUserRepository();
      const registerUserUseCase = new RegisterUserUseCase(userRepository);

      const { name, email, password } = req.body;
      const response = await registerUserUseCase.execute({
        name,
        email,
        password,
        role: "student",
      });

      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
