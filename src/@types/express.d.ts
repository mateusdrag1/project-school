import { UserRole } from "../entities/models/user.interface";

declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: UserRole;
    };
  }
}
