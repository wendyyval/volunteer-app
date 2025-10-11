import request from "supertest";
import app from "../app";

export { app };

export async function registerAndLogin() {
  const email = `u${Date.now()}@ex.com`;
  const password = "secret12";

  await request(app)
    .post("/api/auth/register")
    .send({ email, password, role: "volunteer" })
    .expect(201);

  const login = await request(app)
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200);

  return { token: login.body.token as string, user: login.body.user };
}