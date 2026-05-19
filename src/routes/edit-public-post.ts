import { Router } from "express";
import { EditPublicPostController } from "../http/controllers/post/edit-public-post";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { ensureRole } from "../middlewares/ensure-role";
import { PostRepository } from "../repositories/typeorm/post.repository";
import { EditPublicPostUseCase } from "../use-cases/edit-public-post";

const router = Router();
const postRepository = new PostRepository();
const useCase = new EditPublicPostUseCase(postRepository);
const controller = new EditPublicPostController(useCase);
router.put(
  "/posts/:id",
  ensureAuthenticated,
  ensureRole("teacher"),
  controller.handle.bind(controller),
);

export { router as editPublicPostRoutes };
