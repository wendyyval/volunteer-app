import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config({ path: "./.env" });
console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://volunteer-gxhxcwj8w-wendy-valdezs-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const prisma = new PrismaClient();
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user_credentials.create({
      data: {
        email,
        password_hash,
        role: "volunteer",
      },
    });

    console.log("Registered new user:", newUser.email);
    return res.status(201).json({ success: true, user: newUser });
  } catch (err: any) {
    console.error("Error registering user:", err);
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: "Registration failed" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
