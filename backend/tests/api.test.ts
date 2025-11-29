import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";

// Load the actual backend app (index.ts)
let app: any;

beforeAll(async () => {
  const mod: any = await import("../src/index.ts");
  app = mod.default ?? mod;
});

describe("FULL API TEST SUITE", () => {

  // -------------------------------------------------------
  // HEALTH CHECK
  // -------------------------------------------------------
  it("GET /api/health should return ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  // -------------------------------------------------------
  // REGISTER + LOGIN
  // -------------------------------------------------------
  let userId: number = 0;

  it("POST /api/register should create a user", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.user).toBeDefined();
    userId = res.body.user.id;
  });

  it("POST /api/auth/login should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("testuser@example.com");
  });

  it("POST /api/auth/login should return 401 if missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("POST /api/auth/login should return 401 for wrong password", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "testuser@example.com",
      password: "WRONGPASSWORD"
    });

  expect(res.status).toBe(401);
  expect(res.body.error).toBeDefined();
});


it("POST /api/auth/login should return 401 for wrong password", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "testuser@example.com",
      password: "incorrectpass"
    });

  expect(res.status).toBe(401);
  expect(res.body.error).toBeDefined();
});




  // -------------------------------------------------------
  // SAVE PROFILE
  // -------------------------------------------------------
  it("POST /api/users/saveprofile should save user profile", async () => {
    const res = await request(app)
      .post("/api/users/saveprofile")
      .send({
        userId,
        profile: {
          fullName: "Wendy Valdez",
          address1: "123 Main St",
          address2: "",
          city: "Houston",
          state: "TX",
          zip: "77001",
          preferences: "None"
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.profile.user_id).toBe(userId);
  });

  // -------------------------------------------------------
  // GET USERS
  // -------------------------------------------------------
  it("GET /api/users should return list of users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // -------------------------------------------------------
  // SKILLS
  // -------------------------------------------------------
  it("POST /api/skills should add a skill", async () => {
    const res = await request(app)
      .post("/api/skills")
      .send({ skill_name: "First Aid" });

    expect([200, 201]).toContain(res.status);
    expect(res.body.skill_name).toBe("First Aid");
  });

  it("GET /api/skills should list skills", async () => {
    const res = await request(app).get("/api/skills");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/skills should return 400 if skill_name is missing", async () => {
  const res = await request(app).post("/api/skills").send({});
  expect(res.status).toBe(400);
  expect(res.body.error).toBeDefined();
});

it("POST /api/skills should handle duplicate skill gracefully", async () => {
  const res = await request(app)
    .post("/api/skills")
    .send({ skill_name: "First Aid" });  // same as before

  expect([200, 201, 409]).toContain(res.status);
});



  // -------------------------------------------------------
  // EVENTS (CREATE / LIST / DELETE)
  // -------------------------------------------------------
  let eventId: number = 0;

  it("POST /api/events should create event", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({
        event_name: "Cleanup Day",
        description: "Park cleanup",
        location: "Houston",
        urgency: "High",
        event_date: "2025-01-01",
        requiredSkills: []
      });

    expect([200, 201]).toContain(res.status);
    eventId = res.body.event.event_id;
  });

  it("GET /api/events should list events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("DELETE /api/events/:id should delete event", async () => {
    const res = await request(app).delete(`/api/events/${eventId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Event deleted");
  });

  // -------------------------------------------------------
  // HISTORY
  // -------------------------------------------------------
  it("POST /api/history should create history record", async () => {
    // create another event first
    const ev = await request(app)
      .post("/api/events")
      .send({
        event_name: "Food Drive",
        description: "Help pack food",
        location: "Houston",
        urgency: "Medium",
        event_date: "2025-02-01",
        requiredSkills: []
      });

    const newEventId = ev.body.event.event_id;

    const res = await request(app)
      .post("/api/history")
      .send({
        user_id: userId,
        event_id: newEventId,
        status: "Registered"
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.record).toBeDefined();
  });

  it("GET /api/history/:userId should return user history", async () => {
    const res = await request(app).get(`/api/history/${userId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
