import { Router } from "express";
import { CreateCommentController } from "../http/controllers/post/create-comment";
import { ToggleLikeController } from "../http/controllers/post/toggle-like";

export const commentLikeRoutes = Router();

const createCommentController = new CreateCommentController();
const toggleLikeController = new ToggleLikeController();

commentLikeRoutes.post("/comments", createCommentController.handle);
commentLikeRoutes.post("/likes", toggleLikeController.handle);
