import express from "express";
import { PrismaClient } from "@prisma/client";


const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post("/register", async (req, res) => {
  const { email, password_hash, role } = req.body;

  if (!email || !password_hash) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const newUser = await prisma.user_credentials.create({
      data: { email, password_hash, role: role || "volunteer" },
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));