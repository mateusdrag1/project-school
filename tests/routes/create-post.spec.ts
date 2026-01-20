import request from "supertest";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";

describe("POST /posts", () => {
  // Setup e Teardown da conexão com o PostgreSQL
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("should create a new post successfully with title, content and author", async () => {
    const postData = {
      title: "Desenvolvimento com Node.js",
      content: "Este é um post de teste para o Tech Challenge Fase 2.",
      author: "Arthur e Matthieu",
      published: true
    };

    const res = await request(app)
      .post("/posts")
      .send(postData);

    expect(res.status).toBe(201);

    expect(res.body.message).toBe("Post criado com sucesso!");

    expect(res.body.post).toHaveProperty("id");
    expect(res.body.post.title).toBe(postData.title);
    expect(res.body.post.content).toBe(postData.content);
    expect(res.body.post.author).toBe(postData.author);
  });

  it("should return 400 or 500 if required fields are missing", async () => {
    const res = await request(app)
      .post("/posts")
      .send({});

    expect(res.status).not.toBe(201);
  });
});