import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import {
  credentialsSchema,
  profileSchema,
  eventSchema,
  volunteerHistorySchema,
} from "./validation";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function requireAuth(req: any, res: any, next: any) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "invalid or expired token" });
  }
}

router.post("/auth/register", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password, role } = parsed.data;

  const existing = await prisma.user_credentials.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "email already registered" });

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user_credentials.create({
    data: { email, password_hash: hash, role },
  });

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ message: "Registered successfully", token });
});

router.post("/auth/login", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;

  const user = await prisma.user_credentials.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "invalid credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "invalid credentials" });

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ message: "Login successful", token });
});

router.get("/me/profile", requireAuth, async (req: any, res) => {
  const profile = await prisma.user_profile.findUnique({
    where: { user_id: req.user.sub },
  });
  res.json({ profile });
});

router.post("/me/profile", requireAuth, async (req: any, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = parsed.data;

  const profile = await prisma.user_profile.upsert({
    where: { user_id: req.user.sub },
    update: data,
    create: { user_id: req.user.sub, ...data },
  });

  res.json({ message: "Profile saved", profile });
});

router.get("/events", async (_req, res) => {
  const items = await prisma.event_details.findMany({ orderBy: { event_date: "asc" } });
  res.json({ events: items });
});

router.post("/events", requireAuth, async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const event = await prisma.event_details.create({ data: parsed.data });
  res.json({ message: "Event created", event });
});

router.get("/me/history", requireAuth, async (req: any, res) => {
  const items = await prisma.volunteer_history.findMany({
    where: { user_id: req.user.sub },
    include: { event: true },
    orderBy: { participation_date: "desc" },
  });
  res.json({ history: items });
});

router.post("/me/history", requireAuth, async (req: any, res) => {
  const parsed = volunteerHistorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const record = await prisma.volunteer_history.create({ data: parsed.data });
  res.json({ message: "History record added", record });
});

export default router;
