import request from "supertest";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";
import { getTeacherToken } from "../helpers/auth";

describe("POST /posts", () => {
  let token: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    token = await getTeacherToken();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("should create a new post successfully with title, content and author", async () => {
    const postData = {
      title: "Desenvolvimento com Node.js",
      description: "Post de teste para o Tech Challenge Fase 2.",
      content: "Este é um post de teste para o Tech Challenge Fase 2.",
      author: "Arthur e Matthieu",
      category: "Tecnologia",
      published: true,
    };

    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send(postData);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Post criado com sucesso!");
    expect(res.body.post).toHaveProperty("id");
    expect(res.body.post.title).toBe(postData.title);
    expect(res.body.post.content).toBe(postData.content);
    expect(res.body.post.author).toBe(postData.author);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).not.toBe(201);
  });

  it("should return 401 when no token is provided", async () => {
    const res = await request(app).post("/posts").send({
      title: "Post sem auth",
      description: "Sem token",
      content: "Conteúdo",
      author: "Alguém",
    });

    expect(res.status).toBe(401);
  });

  it("should return 403 when authenticated as a student", async () => {
    const email = `student_${Date.now()}@test.com`;
    await request(app).post("/register").send({
      name: "Aluno Teste",
      email,
      password: "senha123",
      role: "student",
    });
    const loginRes = await request(app)
      .post("/login")
      .send({ email, password: "senha123" });
    const studentToken = loginRes.body.token;

    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Post do aluno",
        description: "Tentativa",
        content: "Conteúdo",
        author: "Aluno",
      });

    expect(res.status).toBe(403);
  });
});
