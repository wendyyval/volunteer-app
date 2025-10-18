import request from "supertest";
import app from "../app";

async function authToken() {
  const email = `prof${Math.floor(Math.random() * 1e9)}@example.com`;
  await request(app).post("/api/auth/register")
    .send({ email, password: "secret12", role: "volunteer" });
  const login = await request(app).post("/api/auth/login")
    .send({ email, password: "secret12" });
  return login.body.token as string;
}

describe("Profile routes", () => {
  it("blocks unauthenticated", async () => {
    const res = await request(app).get("/api/profile/me");
    expect(res.status).toBe(401);
  });

  it("reads and writes current user's profile", async () => {
    const token = await authToken();

    const get1 = await request(app)
      .get("/api/profile/me")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(get1.status); // you return null or 404 initially

    const payload = {
      fullName: "Test User",
      address1: "123 Main St",
      address2: "",
      city: "Austin",
      state: "TX",
      zip: "78701",
      skills: ["Organizing", "Teamwork"],
      preferences: "Morning only",
      availability: ["2025-10-15", "2025-10-20"]
    };

    const save = await request(app)
      .post("/api/profile/me")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    expect(save.status).toBe(200);
    expect(save.body.fullName).toBe("Test User");

    const get2 = await request(app)
      .get("/api/profile/me")
      .set("Authorization", `Bearer ${token}`);
    expect(get2.status).toBe(200);
    expect(get2.body).toEqual(expect.objectContaining({ fullName: "Test User" }));
  });
});