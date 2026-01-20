import request from "supertest";
import { Post } from "../../src/entities/post.entity";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";

describe("PUT /posts/:id", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  it("should update an existing post successfully", async () => {
    const repository = AppDataSource.getRepository(Post);
    
    // 1. Criar um post inicial para editar
    const post = repository.create({
      title: "Título Original",
      content: "Conteúdo Antigo",
      author: "Arthur"
    });
    const savedPost = await repository.save(post);

    const updatedData = {
      title: "Título Atualizado pelo Teste",
      content: "Novo conteúdo validado",
      author: "Arthur e Matthieu"
    };

    // 2. Executar a edição via API 
    const res = await request(app)
      .put(`/posts/${savedPost.id}`)
      .send(updatedData);

    // 3. Validações conforme seu Controller
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post atualizado com sucesso!");
    expect(res.body.post.title).toBe(updatedData.title);
    expect(res.body.post.content).toBe(updatedData.content);
    
    // 4. Verificação de Persistência no Banco [cite: 61]
    const postInDb = await repository.findOneBy({ id: savedPost.id });
    expect(postInDb?.title).toBe(updatedData.title);
  });

  it("should return 404 when the post id does not exist", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    
    const res = await request(app)
      .put(`/posts/${fakeId}`)
      .send({ title: "Qualquer Título" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Post não encontrado");
  });
});