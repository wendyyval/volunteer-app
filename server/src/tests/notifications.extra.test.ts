import request from "supertest";
import { app, registerAndLogin } from "../tests/helpers";

describe("notifications extra branches", () => {
  it("GET /me (all) after seed", async () => {
    const { token } = await registerAndLogin();
    await request(app).post("/api/notifications/seed")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // covers the non-unread branch
    const all = await request(app).get("/api/notifications/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(all.body)).toBe(true);
    expect(all.body.length).toBeGreaterThan(0);
  });

  it("mark read 404 when id not found", async () => {
    const { token } = await registerAndLogin();
    await request(app).post("/api/notifications/seed")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    await request(app).post("/api/notifications/me/not-a-real-id/read")
      .set("Authorization", `Bearer ${token}`)
      .expect(404); // covers the 'not found' branch
  });

  it("create valid notice (201) then unread=1 shrinks after mark-read", async () => {
    const { token } = await registerAndLogin();

    const created = await request(app).post("/api/notifications/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ kind: "info", topic: "system", title: "Hello" })
      .expect(201);

    const unread1 = await request(app).get("/api/notifications/me?unread=1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(unread1.body.find((n: any) => n.id === created.body.id)).toBeTruthy();

    await request(app).post(`/api/notifications/me/${created.body.id}/read`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const unread2 = await request(app).get("/api/notifications/me?unread=1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(unread2.body.find((n: any) => n.id === created.body.id)).toBeFalsy();
  });
});