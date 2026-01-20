import request from "supertest";
import { AppDataSource } from "../../src/lib/typeorm/typeorm";
import { app } from "../../src/main";

describe("GET /posts", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should return status 200 and a list of posts", async () => {
    const res = await request(app).get("/posts");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("content");
      expect(res.body[0]).toHaveProperty("author");
    }
  });
});
