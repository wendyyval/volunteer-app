import request from "supertest";
import app from "../../app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const TOKEN = "u-1";

describe("notifications", () => {
  it("seeds notifications", async () => {
    const res = await request(app)
      .post("/api/notifications/seed")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.seeded).toBeGreaterThan(0);
  });

  it("lists notifications", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it("marks a notification read", async () => {
    // seed first
    const seed = await request(app)
      .post("/api/notifications/seed")
      .set("Authorization", `Bearer ${TOKEN}`);
    const id = seed.body && seed.body.seeded ? undefined : undefined; // not needed for mark in test

    const list = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${TOKEN}`);

    const firstId = list.body.items[0].id as string;

    const res = await request(app)
      .patch(`/api/notifications/${firstId}/read`)
      .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.item.read).toBe(true);
  });
});
