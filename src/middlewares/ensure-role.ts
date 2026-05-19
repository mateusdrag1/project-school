import { NextFunction, Request, Response } from "express";
import { UserRole } from "../entities/models/user.interface";
import { UnauthorizedError } from "../errors/domain.errors";

export function ensureRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new UnauthorizedError("Insufficient permissions"));
    }
    return next();
  };
}
