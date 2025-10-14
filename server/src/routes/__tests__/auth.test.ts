import request from "supertest";
import app from "../../app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("auth", () => {
  it("registers a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "new@site.com",
      name: "New User",
      role: "volunteer",
      password: "abcdef"
    });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("new@site.com");
    expect(res.body).toHaveProperty("token");
  });

  it("rejects duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      email: "dupe@site.com",
      name: "One",
      password: "abcdef"
    });
    const res = await request(app).post("/api/auth/register").send({
      email: "dupe@site.com",
      name: "Two",
      password: "abcdef"
    });
    expect(res.status).toBe(409);
  });

  it("logs in demo user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testing@gmail.com",
      password: "123456"
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("testing@gmail.com");
  });
});