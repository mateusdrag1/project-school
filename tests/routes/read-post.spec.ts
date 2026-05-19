import request from "supertest";
import { Post } from "../../src/entities/post.entity";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";

describe("GET /posts/:id", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("should return a specific post when a valid ID is provided", async () => {
    const repository = AppDataSource.getRepository(Post);
    const post = repository.create({
      title: "Título para Leitura",
      description: "Descrição para leitura",
      content: "Conteúdo detalhado do post.",
      author: "Matthieu",
      category: "Educação",
    });
    const savedPost = await repository.save(post);

    const res = await request(app).get(`/posts/${savedPost.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", savedPost.id);
    expect(res.body.title).toBe("Título para Leitura");
    expect(res.body.content).toBe("Conteúdo detalhado do post.");
  });

  it("should return 404 when the post does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";

    const res = await request(app).get(`/posts/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Post not found");
  });
});
