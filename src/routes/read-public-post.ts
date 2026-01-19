import { Router } from "express";
import { ReadPublicPostController } from "../http/controllers/post/read-public-post";
import { PostRepository } from "../repositories/typeorm/post.repository";
import { ReadPublicPostUseCase } from "../use-cases/read-public-post";

const router = Router();

const postRepository = new PostRepository();
const useCase = new ReadPublicPostUseCase(postRepository);
const controller = new ReadPublicPostController(useCase);

router.get("/posts/:id", controller.handle.bind(controller));

export { router as readPublicPostRoutes };
