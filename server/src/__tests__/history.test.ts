import request from "supertest";
import app from "../app";

async function makeUser() {
  const email = `hist${Math.floor(Math.random() * 1e9)}@example.com`;
  await request(app).post("/api/auth/register")
    .send({ email, password: "secret12", role: "volunteer" });
  const login = await request(app).post("/api/auth/login")
    .send({ email, password: "secret12" });
  return login.body.token as string;
}

describe("History routes", () => {
  it("requires auth", async () => {
    const res = await request(app).get("/api/history/me");
    expect(res.status).toBe(401);
  });

  it("returns empty list initially, then seeded items", async () => {
    const token = await makeUser();

    const empty = await request(app)
      .get("/api/history/me")
      .set("Authorization", `Bearer ${token}`);
    expect(empty.status).toBe(200);
    expect(Array.isArray(empty.body)).toBe(true);

    const seed = await request(app)
      .post("/api/history/seed")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 201]).toContain(seed.status);

    const after = await request(app)
      .get("/api/history/me")
      .set("Authorization", `Bearer ${token}`);
    expect(after.status).toBe(200);
    expect(after.body.length).toBeGreaterThanOrEqual(1);
  });
});