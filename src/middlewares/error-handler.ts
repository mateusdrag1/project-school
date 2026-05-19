import { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";
import {
  InvalidCredentialsError,
  ResourceNotFoundError,
} from "../errors/domain.errors";

type HandlerFn = (
  error: unknown,
  req: Request,
  res: Response,
) => Response | void;

type ErrorKey =
  | "ZodError"
  | "ResourceNotFoundError"
  | "InvalidCredentialsError";

const errorHandlerMap = {
  ZodError: (error, _req, res) => {
    const zod = error as ZodError;
    return res.status(400).json({
      message: "Validation error",
      error: z.treeifyError(zod),
    });
  },

  ResourceNotFoundError: (error, _req, res) => {
    return res.status(404).json({
      message: (error as Error).message,
    });
  },

  InvalidCredentialsError: (error, _req, res) => {
    return res.status(401).json({
      message: (error as Error).message,
    });
  },
} satisfies Record<ErrorKey, HandlerFn> & Record<string, HandlerFn>;

const errorHandlerRegistry: Record<string, HandlerFn> = errorHandlerMap;

function getErrorName(error: unknown): string {
  if (error && typeof error === "object") {
    const ctorName = (error as any).constructor?.name;
    if (typeof ctorName === "string") return ctorName;

    const name = (error as any).name;
    if (typeof name === "string") return name;
  }
  return "UnknownError";
}

export function globalErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  if (error instanceof ZodError) {
    return errorHandlerMap.ZodError(error, req, res);
  }

  if (error instanceof ResourceNotFoundError) {
    return errorHandlerMap.ResourceNotFoundError(error, req, res);
  }

  if (error instanceof InvalidCredentialsError) {
    return errorHandlerMap.InvalidCredentialsError(error, req, res);
  }

  const handler = errorHandlerRegistry[getErrorName(error)];

  if (!handler) {
    return res.status(500).json({ message: "Internal server error" });
  }

  return handler(error, req, res);
}
