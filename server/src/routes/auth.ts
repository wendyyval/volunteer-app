import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import type { Role, User } from "../types";
import { users } from "../store";

const router = Router();

const DEMO_PASSWORD = "123456"; // demo password
const pwByEmail = new Map<string, string>(); //email->password
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(60).optional(),
  role: z.enum(["volunteer", "coordinator", "admin"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password, name, role } = parsed.data;

  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: "Email already exists" });
  }

  // default name from email if not provided
  const safeName = name ?? email.split("@")[0];

  const user: User = { id: randomUUID(), email, name: safeName, role: role ?? "volunteer" };
  users.push(user);

  // remember password in memory so login works with what the user chose
  pwByEmail.set(email, password);

  return res.status(201).json({ user, token: user.id });
});

router.post("/login", (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = users.find(u => u.email === email);
  if (!user || password !== DEMO_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  return res.json({ user, token: user.id });
});

export default router;
