import request from "supertest";
import { app, registerAndLogin } from "./helpers";

describe("history extra branches", () => {
  it("seed endpoint populates rows", async () => {
    const { token } = await registerAndLogin();

    await request(app)
      .post("/api/history/seed")
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const list = await request(app)
      .get("/api/history/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(2);
  });

  it("rejects invalid add payload (400)", async () => {
    const { token } = await registerAndLogin();

    await request(app)
      .post("/api/history/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ eventDate: 12345 })
      .expect(400);
  });
});