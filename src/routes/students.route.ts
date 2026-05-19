import { Router } from "express";
import { DeleteUserController } from "../http/controllers/users/delete-user";
import { ListUsersByRoleController } from "../http/controllers/users/list-users-by-role";
import { RegisterUserWithRoleController } from "../http/controllers/users/register-user-with-role";
import { UpdateUserController } from "../http/controllers/users/update-user";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { ensureRole } from "../middlewares/ensure-role";
import { TypeORMUserRepository } from "../repositories/typeorm/user.repository";
import { DeleteUserUseCase } from "../use-cases/delete-user";
import { ListUsersByRoleUseCase } from "../use-cases/list-users-by-role";
import { RegisterUserUseCase } from "../use-cases/register-user";
import { UpdateUserUseCase } from "../use-cases/update-user";

const router = Router();
const userRepository = new TypeORMUserRepository();

const listController = new ListUsersByRoleController(
  new ListUsersByRoleUseCase(userRepository),
  "student",
);
const registerController = new RegisterUserWithRoleController(
  new RegisterUserUseCase(userRepository),
  "student",
);
const updateController = new UpdateUserController(
  new UpdateUserUseCase(userRepository),
);
const deleteController = new DeleteUserController(
  new DeleteUserUseCase(userRepository),
);

router.get(
  "/students",
  ensureAuthenticated,
  ensureRole("teacher"),
  listController.handle.bind(listController),
);

router.post(
  "/students",
  ensureAuthenticated,
  ensureRole("teacher"),
  registerController.handle.bind(registerController),
);

router.put(
  "/students/:id",
  ensureAuthenticated,
  ensureRole("teacher"),
  updateController.handle.bind(updateController),
);

router.delete(
  "/students/:id",
  ensureAuthenticated,
  ensureRole("teacher"),
  deleteController.handle.bind(deleteController),
);

export { router as studentsRoutes };
