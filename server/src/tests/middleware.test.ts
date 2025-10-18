/// <reference types="vitest/globals" />
import request from "supertest";
import app from "../app";

describe("requireAuth middleware", () => {
    it("401 when Authorization header is missing", async () =>{
        await request(app).get("/api/history/me").expect(401);
    });

    it("401 when token is invalid", async() =>{
        await request(app).get("/api/history/me").set("Authorization", "Bearer not-a-token").expect(401);
    });
});