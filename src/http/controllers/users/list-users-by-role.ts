import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../entities/models/user.interface";
import { ListUsersByRoleUseCase } from "../../../use-cases/list-users-by-role";

export class ListUsersByRoleController {
  constructor(
    private useCase: ListUsersByRoleUseCase,
    private role: UserRole,
  ) {}

  async handle(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.useCase.execute(this.role);
      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}
