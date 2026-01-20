import request from "supertest";
import { Post } from "../../src/entities/post.entity";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";

describe("DELETE /posts/:id", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("should delete a post successfully and return 204", async () => {
    const repository = AppDataSource.getRepository(Post);
    const post = repository.create({
      title: "Post para deletar",
      content: "Conteúdo temporário",
      author: "Professor Teste",
    });
    const savedPost = await repository.save(post);
    const res = await request(app).delete(`/posts/${savedPost.id}`);

    expect(res.status).toBe(204);

    const deletedPost = await repository.findOneBy({ id: savedPost.id });
    expect(deletedPost).toBeNull();
  });
});
