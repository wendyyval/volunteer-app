import request from "supertest";
import app from "../../app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const TOKEN = "u-1"; // default demo user

describe("history", () => {
  it("seeds history", async () => {
    const res = await request(app)
      .post("/api/history/seed")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.seeded).toBeGreaterThan(0);
  });

  it("lists history", async () => {
    const res = await request(app)
      .get("/api/history")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it("adds a history item", async () => {
    const payload = {
      eventName: "Shelter Setup",
      eventDate: new Date().toISOString(),
      location: "Dallas, TX",
      requiredSkills: ["Lifting"],
      urgency: "Low",
      participationStatus: "Registered",
      hours: 1
    };
    const res = await request(app)
      .post("/api/history")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.item.eventName).toBe("Shelter Setup");
  });
});
