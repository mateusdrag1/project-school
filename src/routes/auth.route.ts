import { Router } from "express";
import { AuthenticateUserController } from "../http/controllers/auth/authenticate-user";
import { RegisterUserController } from "../http/controllers/auth/register-user";

export const authRoutes = Router();

const registerUserController = new RegisterUserController();
const authenticateUserController = new AuthenticateUserController();

authRoutes.post("/register", registerUserController.handle);
authRoutes.post("/login", authenticateUserController.handle);
