import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import jwt from "jsonwebtoken";

const router = Router();


router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const existing = await prisma.user_credentials.findUnique({ where: { email } });
  if (existing) return res.status(200).json({ success: true, user: existing });

  const password_hash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user_credentials.create({
    data: { email, password_hash, role: "volunteer" },
  });

  return res.status(201).json({ success: true, user: newUser });
});


router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const existing = await prisma.user_credentials.findUnique({ where: { email } });
  if (existing) return res.status(200).json({ success: true, user: existing });

  const password_hash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user_credentials.create({
    data: { email, password_hash, role: "volunteer" },
  });

  return res.status(201).json({ success: true, user: newUser });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).json({ error: "Invalid credentials" });

  const user = await prisma.user_credentials.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token, user });
});

export default router;
