import request from "supertest";
import app from "../app";

function uniqueEmail(prefix = "u"){
    const n = Math.floor(Math.random() * 1e9);
    return `${prefix}${n}@example.com`;
}

describe("Auth routes", () => {
  it("registers a new user", async () => {
    const email = uniqueEmail("reg");
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret12", role: "volunteer" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({ email, role: "volunteer", id: expect.any(String) })
    );
  });

    it("logs in an existing user and returns JWT", async () => {
    const email = uniqueEmail("login");
    await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret12", role: "volunteer" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "secret12" });

    expect(res.status).toBe(200);
    expect(res.body.token).toMatch(/^eyJ/);        // looks like a JWT
    expect(res.body.user).toEqual(
      expect.objectContaining({ email, role: "volunteer", id: expect.any(String) })
    );
  });

  
  it("rejects invalid credentials", async () => {
    const email = uniqueEmail("badpw");
    await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret12", role: "volunteer" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "WRONG" });

    expect(res.status).toBe(401);
  });
});