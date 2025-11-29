import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/index";
import { prisma } from "../src/db";

describe("EXTRA USER ROUTE TESTS", () => {
  it("POST /api/users/saveprofile should return 400 if userId missing", async () => {
    const res = await request(app)
      .post("/api/users/saveprofile")
      .send({ profile: {} });

    expect(res.status).toBe(400);
  });

  it("POST /api/users/saveprofile should create a new profile", async () => {
    const user = await prisma.user_credentials.create({
      data: {
        email: "profile1@test.com",
        password_hash: "hash",
        role: "volunteer",
      },
    });

    const res = await request(app)
      .post("/api/users/saveprofile")
      .send({
        userId: user.id,
        profile: {
          fullName: "Test User",
          address1: "123 St",
          address2: "Unit 2",
          city: "Houston",
          state: "TX",
          zip: "77000",
          preferences: "None",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.profile.user_id).toBe(user.id);
  });

  it("POST /api/users/saveprofile should update existing profile", async () => {
    const user = await prisma.user_credentials.create({
      data: {
        email: "profile2@test.com",
        password_hash: "hash",
        role: "volunteer",
      },
    });

    await prisma.user_profile.create({
      data: {
        user_id: user.id,
        full_name: "Old Name",
        address1: "Old Addr",
        city: "OldCity",
        state: "FL",
        zip: "12345",
        preferences: "",
      },
    });

    const res = await request(app)
      .post("/api/users/saveprofile")
      .send({
        userId: user.id,
        profile: {
          fullName: "New Name",
          address1: "New Address",
          city: "Chicago",
          state: "IL",
          zip: "60000",
          preferences: "Likes coding",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.profile.full_name).toBe("New Name");
    expect(res.body.profile.city).toBe("Chicago");
  });
});
