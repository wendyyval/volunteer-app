import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/index";
import { prisma } from "../src/db";

let testEmail = "authtest@volunteer.app";
let token = "";

beforeAll(async () => {
  await prisma.volunteer_history.deleteMany();
  await prisma.user_profile.deleteMany();
  await prisma.user_credentials.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: testEmail,
        password: "Password123!",
        role: "volunteer",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should fail when registering the same user twice", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: testEmail,
        password: "Password123!",
        role: "volunteer",
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe("POST /api/auth/login", () => {
  it("should log in existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "Password123!",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
  });
});