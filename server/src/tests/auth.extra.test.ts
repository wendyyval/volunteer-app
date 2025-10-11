/*zod val path, duplicate email branch, invalid password branch*/
import request from "supertest";
import app from "../app";


describe("auth extra branches", () => {
  it("rejects bad registration (400)", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({}) // missing fields
      .expect(400);
  });

  it("rejects duplicate email (409)", async () => {
    const email = `dup+${crypto.randomUUID()}@t.com`;

    await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret12", role: "volunteer" })
      .expect(201);


    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret12", role: "volunteer" })
      .expect(409);

    expect(res.body).toHaveProperty("error"); // check error msg
  });

  it("rejects bad login (401 wrong password)", async () => {
    const email = `badlogin+${crypto.randomUUID()}@t.com`;

    await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret12", role: "volunteer" })
      .expect(201);

    await request(app)
      .post("/api/auth/login")
      .send({ email, password: "WRONGPASS" })
      .expect(401);
  });
});