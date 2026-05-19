import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserRole } from "../entities/models/user.interface";
import { env } from "../env";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  role: UserRole;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "JWT token is missing" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "JWT token is missing" });
  }

  try {
    const decoded = verify(token, env.JWT_SECRET);

    const { sub, role } = decoded as TokenPayload;

    req.user = {
      id: sub,
      role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid JWT token" });
  }
}
