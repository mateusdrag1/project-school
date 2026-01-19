import "reflect-metadata";
import { DataSource } from "typeorm";
import { Post } from "../../entities/post.entity";
import { env } from "../../env/index";
import { CreatePostsTable1768826864000 } from "./migrations/1768826864000-CreatePostsTable";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: false,
  logging: env.NODE_ENV === "development",
  entities: [Post],
  migrations: [CreatePostsTable1768826864000],
  ssl: false,
});
