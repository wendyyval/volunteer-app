import request from "supertest";
import app from "../../app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
