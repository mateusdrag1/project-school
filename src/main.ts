import express from "express";
import { ResourceNotFoundError } from "./errors/domain.errors";
import { globalErrorHandler } from "./middlewares/error-handler";
import { createPublicPostRoutes } from "./routes/create-public-post";
import { deletePublicPostRoutes } from "./routes/delete-public-post";
import { editPublicPostRoutes } from "./routes/edit-public-post";
import { healthRoutes } from "./routes/health.route";
import { postRoutes } from "./routes/list-public-posts";
import { readPublicPostRoutes } from "./routes/read-public-post";
import { searchPublicPostsRoutes } from "./routes/search-public-posts";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(healthRoutes);

app.use(postRoutes);

app.use(searchPublicPostsRoutes);

app.use(readPublicPostRoutes);

app.use(createPublicPostRoutes);

app.use(editPublicPostRoutes);

app.use(deletePublicPostRoutes);

app.use((_req, _res, next) => {
  next(new ResourceNotFoundError("Route not found"));
});

app.use(globalErrorHandler);
