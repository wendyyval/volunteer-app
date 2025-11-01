import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/index.ts";

describe("POST /api/register", () => {
  it("should hit the debug route", async () => {
  const res = await request(app).get("/debug-route");
  console.log("DEBUG RESPONSE:", res.body);
  expect(res.status).toBe(200);
});
});
