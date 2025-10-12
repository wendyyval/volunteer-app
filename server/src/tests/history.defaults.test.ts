/// <reference types="vitest/globals" />
import request from "supertest";
import { app, registerAndLogin } from "../tests/helpers";

describe("history defaults branch", () => {
  it("POST /me with minimal body uses defaults", async () => {
    const { token } = await registerAndLogin();

    const res = await request(app).post("/api/history/me")
      .set("Authorization", `Bearer ${token}`)
      // min valid payload: everything else defaults on server
      .send({ participationStatus: "Registered", urgency: "Medium" })
      .expect(201);

    expect(res.body.id).toBeTruthy();
    expect(res.body.eventName).toBe("Untitled Event"); // default
    expect(res.body.location).toBe("Unknown");         // default
  });
});