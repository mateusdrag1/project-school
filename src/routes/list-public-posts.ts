import { Router } from "express";
import { ListPublicPostsController } from "../http/controllers/post/list-public-posts";
import { PostRepository } from "../repositories/typeorm/post.repository";
import { ListPublicPostsUseCase } from "../use-cases/list-public-posts";

const router = Router();

const postRepository = new PostRepository();
const useCase = new ListPublicPostsUseCase(postRepository);
const controller = new ListPublicPostsController(useCase);

router.get("/posts", controller.handle.bind(controller));

export { router as postRoutes };
