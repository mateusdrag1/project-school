import { Router } from "express";
import { DeletePublicPostController } from "../http/controllers/post/delete-public-post";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { ensureRole } from "../middlewares/ensure-role";
import { PostRepository } from "../repositories/typeorm/post.repository";
import { DeletePublicPostUseCase } from "../use-cases/delete-public-post";

const router = Router();
const postRepository = new PostRepository();
const useCase = new DeletePublicPostUseCase(postRepository);
const controller = new DeletePublicPostController(useCase);
router.delete(
  "/posts/:id",
  ensureAuthenticated,
  ensureRole("teacher"),
  controller.handle.bind(controller),
);

export { router as deletePublicPostRoutes };
