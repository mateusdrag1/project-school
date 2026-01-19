import { Router } from "express";
import { DeletePublicPostController } from "../http/controllers/post/delete-public-post";
import { PostRepository } from "../repositories/typeorm/post.repository";
import { DeletePublicPostUseCase } from "../use-cases/delete-public-post";

const router = Router();
const postRepository = new PostRepository();
const useCase = new DeletePublicPostUseCase(postRepository);
const controller = new DeletePublicPostController(useCase);
router.delete("/posts/:id", controller.handle.bind(controller));

export { router as deletePublicPostRoutes };
