import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../entities/models/user.interface";
import { RegisterUserUseCase } from "../../../use-cases/register-user";

export class RegisterUserWithRoleController {
  constructor(
    private useCase: RegisterUserUseCase,
    private role: UserRole,
  ) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const user = await this.useCase.execute({
        name,
        email,
        password,
        role: this.role,
      });
      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
}
