import { Router } from "express";
import { CreatePublicPostController } from "../http/controllers/post/create-public-post";
import { PostRepository } from "../repositories/typeorm/post.repository";
import { CreatePublicPostUseCase } from "../use-cases/create-public-post";

const router = Router();
const postRepository = new PostRepository();
const useCase = new CreatePublicPostUseCase(postRepository);
const controller = new CreatePublicPostController(useCase);
router.post("/posts", controller.handle.bind(controller));

export { router as createPublicPostRoutes };
