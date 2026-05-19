import request from "supertest";
import { Post } from "../../src/entities/post.entity";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";
import { getTeacherToken } from "../helpers/auth";

describe("DELETE /posts/:id", () => {
  let token: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    token = await getTeacherToken();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("should delete a post successfully and return 204", async () => {
    const repository = AppDataSource.getRepository(Post);
    const post = repository.create({
      title: "Post para deletar",
      description: "Descrição temporária",
      content: "Conteúdo temporário",
      author: "Professor Teste",
      category: "Comunicados",
    });
    const savedPost = await repository.save(post);

    const res = await request(app)
      .delete(`/posts/${savedPost.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const deletedPost = await repository.findOneBy({ id: savedPost.id });
    expect(deletedPost).toBeNull();
  });

  it("should return 401 when no token is provided", async () => {
    const res = await request(app).delete(
      "/posts/00000000-0000-0000-0000-000000000000",
    );

    expect(res.status).toBe(401);
  });
});
