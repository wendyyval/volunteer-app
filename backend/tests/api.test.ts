import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";
import routes from "../src/routes";

const app = express();
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes);

describe("GET /api/health", () => {
  it("should return ok:true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
