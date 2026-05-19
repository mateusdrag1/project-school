import request from "supertest";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";
import { getTeacherToken } from "../helpers/auth";

describe("Students routes", () => {
  let token: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    token = await getTeacherToken();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  describe("GET /students", () => {
    it("should list all students when authenticated as teacher", async () => {
      const email = `listed_student_${Date.now()}@test.com`;
      await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Aluno Listado", email, password: "senha123" });

      const res = await request(app)
        .get("/students")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((u: any) => expect(u.role).toBe("student"));
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/students");
      expect(res.status).toBe(401);
    });

    it("should return 403 when authenticated as student", async () => {
      const email = `student_cant_list_${Date.now()}@test.com`;
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
        .get("/students")
        .set("Authorization", `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe("POST /students", () => {
    it("should register a new student when authenticated as teacher", async () => {
      const email = `new_student_${Date.now()}@test.com`;

      const res = await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Novo Aluno", email, password: "senha123" });

      expect(res.status).toBe(201);
      expect(res.body.role).toBe("student");
      expect(res.body.email).toBe(email);
    });

    it("should return 403 — students cannot register other students", async () => {
      const studentEmail = `student_reg_${Date.now()}@test.com`;
      await request(app).post("/register").send({
        name: "Aluno",
        email: studentEmail,
        password: "senha123",
        role: "student",
      });
      const loginRes = await request(app)
        .post("/login")
        .send({ email: studentEmail, password: "senha123" });

      const res = await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${loginRes.body.token}`)
        .send({
          name: "Tentativa Aluno",
          email: `x${studentEmail}`,
          password: "senha123",
        });

      expect(res.status).toBe(403);
    });

    it("should return 409 when email already in use", async () => {
      const email = `dup_student_${Date.now()}@test.com`;
      await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Aluno A", email, password: "senha123" });

      const res = await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Aluno B", email, password: "senha123" });

      expect(res.status).toBe(409);
    });
  });

  describe("PUT /students/:id", () => {
    it("should update a student's name when authenticated as teacher", async () => {
      const email = `upd_student_${Date.now()}@test.com`;
      const createRes = await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Aluno Antigo", email, password: "senha123" });

      const res = await request(app)
        .put(`/students/${createRes.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Aluno Atualizado" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Aluno Atualizado");
    });

    it("should return 403 when student tries to edit another student", async () => {
      const victimEmail = `victim_${Date.now()}@test.com`;
      const victimRes = await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Vítima", email: victimEmail, password: "senha123" });

      const attackerEmail = `attacker_${Date.now()}@test.com`;
      await request(app).post("/register").send({
        name: "Atacante",
        email: attackerEmail,
        password: "senha123",
      });
      const loginRes = await request(app)
        .post("/login")
        .send({ email: attackerEmail, password: "senha123" });

      const res = await request(app)
        .put(`/students/${victimRes.body.id}`)
        .set("Authorization", `Bearer ${loginRes.body.token}`)
        .send({ name: "Invadido" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /students/:id", () => {
    it("should delete a student and return 204", async () => {
      const email = `del_student_${Date.now()}@test.com`;
      const createRes = await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Aluno Deletável", email, password: "senha123" });

      const res = await request(app)
        .delete(`/students/${createRes.body.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .delete("/students/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).delete(
        "/students/00000000-0000-0000-0000-000000000000",
      );
      expect(res.status).toBe(401);
    });

    it("should return 403 — students cannot delete other students", async () => {
      const studentEmail = `student_cant_del_${Date.now()}@test.com`;
      await request(app).post("/register").send({
        name: "Aluno",
        email: studentEmail,
        password: "senha123",
      });
      const loginRes = await request(app)
        .post("/login")
        .send({ email: studentEmail, password: "senha123" });

      const res = await request(app)
        .delete("/students/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(403);
    });
  });
});
