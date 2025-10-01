import { Router } from "express";
import { db } from "./store";
import { registerSchema, loginSchema } from "./validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // ok for assignment

export const authRouter = Router();

/** Register */
authRouter.post("/register", async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });

  const { email, password, role } = parse.data;

  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: randomUUID(), email, passwordHash, role };
  db.users.push(user);

  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

/** Login */
authRouter.post("/login", async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });

  const { email, password } = parse.data;
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

/** Middleware to protect routes */
export function requireAuth(req: any, res: any, next: any) {
  const auth = req.headers.authorization?.split(" ")[1];
  if (!auth) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(auth, JWT_SECRET) as { sub: string; role: string };
    req.userId = decoded.sub;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
