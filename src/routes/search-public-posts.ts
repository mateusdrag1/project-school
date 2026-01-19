import { Router } from "express";
import { SearchPublicPostsController } from "../http/controllers/post/search-public-posts";
import { PostRepository } from "../repositories/typeorm/post.repository";
import { SearchPublicPostsUseCase } from "../use-cases/search-public-posts";

const router = Router();

const postRepository = new PostRepository();
const useCase = new SearchPublicPostsUseCase(postRepository);
const controller = new SearchPublicPostsController(useCase);
router.get("/posts/search", controller.handle.bind(controller));

export { router as searchPublicPostsRoutes };
