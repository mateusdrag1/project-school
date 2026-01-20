import request from "supertest";
import { Post } from "../../src/entities/post.entity";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";

describe("GET /posts/search", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("should return posts that match the search term in title or content", async () => {
    const repository = AppDataSource.getRepository(Post);

    await repository.save([
      {
        title: "Aprendendo Node.js",
        content: "Nesta aula veremos como criar APIs.",
        author: "Arthur",
      },
      {
        title: "Docker para Iniciantes",
        content: "Entenda o conceito de containers.",
        author: "Matthieu",
      },
    ]);

    const res = await request(app).get("/posts/search").query({ q: "Node" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const hasNodePost = res.body.some((post: any) =>
      post.title.includes("Node"),
    );
    expect(hasNodePost).toBe(true);
  });

  it("should return an empty array if no posts match the search term", async () => {
    const res = await request(app)
      .get("/posts/search")
      .query({ q: "PalavraInexistente" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
