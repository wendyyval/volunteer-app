import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/index";
import { prisma } from "../src/db";
import bcrypt from "bcryptjs";

describe("EXTRA AUTH ROUTE TESTS", () => {
  it("POST /api/auth should 400 on missing email or password", async () => {
    const res = await request(app).post("/api/auth").send({ email: "" });
    expect(res.status).toBe(400);
  });

  it("POST /api/auth should return existing user if email already exists", async () => {
    const email = "exist@test.com";
    const password_hash = await bcrypt.hash("pass123", 10);

    await prisma.user_credentials.create({
      data: { email, password_hash, role: "volunteer" },
    });

    const res = await request(app).post("/api/auth").send({
      email,
      password: "anything",
    });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
  });

  it("POST /api/auth/register should create new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "newuser@test.com", password: "pass123" });

    expect([200, 201]).toContain(res.status);
    expect(res.body.user).toBeDefined();
  });

  it("POST /api/auth/login should return 401 if user not found", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "missing@test.com", password: "1234" });

    expect(res.status).toBe(401);
  });

  it("POST /api/auth/login should return 401 for wrong password", async () => {
    const email = "pwtest@test.com";
    const password_hash = await bcrypt.hash("correct", 10);

    await prisma.user_credentials.create({
      data: { email, password_hash, role: "volunteer" },
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("POST /api/auth/login should succeed with correct password", async () => {
    const email = "logintest@test.com";
    const password_hash = await bcrypt.hash("pass123", 10);

    await prisma.user_credentials.create({
      data: { email, password_hash, role: "volunteer" },
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "pass123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
