import { hash } from "bcryptjs";
import request from "supertest";
import { User } from "../../src/entities/user.entity";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";

export async function getTeacherToken(): Promise<string> {
  const email = `teacher_${Date.now()}@test.com`;
  const password = "senha123";

  const repo = AppDataSource.getRepository(User);
  await repo.save(
    repo.create({
      name: "Prof Teste",
      email,
      password_hash: await hash(password, 6),
      role: "teacher",
    }),
  );

  const res = await request(app).post("/login").send({ email, password });
  return res.body.token as string;
}
