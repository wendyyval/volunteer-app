/// <reference types="vitest/globals" />
import request from "supertest";
import { registerAndLogin, app } from "../tests//helpers";

describe("notifications", () => {
  it("seed + unread filter + mark read (200/200/200)", async () => {
    const { token } = await registerAndLogin(); // <-- destructure

    await request(app)
      .post("/api/notifications/seed")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const unread = await request(app)
      .get("/api/notifications/me?unread=1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(unread.body)).toBe(true);
    expect(unread.body.length).toBeGreaterThan(0);

    const firstId = unread.body[0].id as string;

    await request(app)
      .post(`/api/notifications/me/${firstId}/read`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("rejects invalid create payload (400)", async () => {
    const { token } = await registerAndLogin(); // <-- destructure

    await request(app)
      .post("/api/notifications/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ kind: "nope", topic: "system", title: "" }) // invalid
      .expect(400);
  });
});