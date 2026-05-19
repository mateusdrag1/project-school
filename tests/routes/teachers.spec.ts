import request from "supertest";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";
import { getTeacherToken } from "../helpers/auth";

describe("Teachers routes", () => {
  let token: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    token = await getTeacherToken();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  describe("GET /teachers", () => {
    it("should list all teachers when authenticated as teacher", async () => {
      const res = await request(app)
        .get("/teachers")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((u: any) => expect(u.role).toBe("teacher"));
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/teachers");
      expect(res.status).toBe(401);
    });

    it("should return 403 when authenticated as student", async () => {
      const email = `student_${Date.now()}@test.com`;
      await request(app).post("/register").send({
        name: "Aluno",
        email,
        password: "senha123",
        role: "student",
      });
      const loginRes = await request(app)
        .post("/login")
        .send({ email, password: "senha123" });

      const res = await request(app)
        .get("/teachers")
        .set("Authorization", `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("POST /teachers", () => {
    it("should register a new teacher when authenticated as teacher", async () => {
      const email = `new_teacher_${Date.now()}@test.com`;

      const res = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Novo Professor", email, password: "senha123" });

      expect(res.status).toBe(201);
      expect(res.body.role).toBe("teacher");
      expect(res.body.email).toBe(email);
    });

    it("should return 409 when email already in use", async () => {
      const email = `dup_teacher_${Date.now()}@test.com`;
      await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Prof A", email, password: "senha123" });

      const res = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Prof B", email, password: "senha123" });

      expect(res.status).toBe(409);
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Sem Email" });

      expect(res.status).toBe(400);
    });

    it("should return 403 when authenticated as student", async () => {
      const email = `student_403_${Date.now()}@test.com`;
      await request(app).post("/register").send({
        name: "Aluno",
        email,
        password: "senha123",
        role: "student",
      });
      const loginRes = await request(app)
        .post("/login")
        .send({ email, password: "senha123" });

      const res = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${loginRes.body.token}`)
        .send({ name: "Tentativa", email: `x${email}`, password: "senha123" });

      expect(res.status).toBe(403);
    });
  });

  describe("PUT /teachers/:id", () => {
    it("should update a teacher's name when authenticated as teacher", async () => {
      const email = `upd_teacher_${Date.now()}@test.com`;
      const createRes = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Nome Antigo", email, password: "senha123" });

      const res = await request(app)
        .put(`/teachers/${createRes.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Nome Atualizado" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Nome Atualizado");
      expect(res.body.role).toBe("teacher");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .put("/teachers/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Qualquer" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /teachers/:id", () => {
    it("should delete a teacher and return 204", async () => {
      const email = `del_teacher_${Date.now()}@test.com`;
      const createRes = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Prof Deletável", email, password: "senha123" });

      const res = await request(app)
        .delete(`/teachers/${createRes.body.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .delete("/teachers/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).delete(
        "/teachers/00000000-0000-0000-0000-000000000000",
      );
      expect(res.status).toBe(401);
    });

    it("should return 403 when authenticated as student", async () => {
      const studentEmail = `student_del_${Date.now()}@test.com`;
      await request(app).post("/register").send({
        name: "Aluno",
        email: studentEmail,
        password: "senha123",
      });
      const loginRes = await request(app)
        .post("/login")
        .send({ email: studentEmail, password: "senha123" });

      const res = await request(app)
        .delete("/teachers/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(403);
    });
  });
});
