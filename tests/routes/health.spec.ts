import request from "supertest";
import { app } from "../../src/main";

describe("GET /health", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: "ok",
      }),
    );
  });
});
