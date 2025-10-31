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

// //SKILLS
// router.post("/me/skills", requireAuth, async (req: any, res) => {
//   const { skills } = req.body; // expect array of skill IDs
//   if (!Array.isArray(skills)) return res.status(400).json({ error: "skills must be an array" });

//   try {
//     // Remove old skills first
//     await prisma.user_skills.deleteMany({ where: { user_id: req.user.sub } });

//     // Add new skills
//     await prisma.user_skills.createMany({
//       data: skills.map((skill_id: number) => ({ user_id: req.user.sub, skill_id })),
//       skipDuplicates: true,
//     });

//     res.json({ message: "Skills saved" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to save skills" });
//   }
// });

router.get("/skills", async (req, res) => {
    try {
        const skills = await prisma.skills.findMany({
            select: { skill_id: true, skill_name: true },
            orderBy: { skill_name: "asc" },
        });
        res.json({ skills });
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({ error: "Failed to fetch skills" });
    }
});


// //AVAILABILITY

// router.post("/me/availability", requireAuth, async (req: any, res) => {
//   const { availability } = req.body; // expect array of date strings
//   if (!Array.isArray(availability)) return res.status(400).json({ error: "availability must be an array" });

//   try {
//     // Remove old availability
//     await prisma.availability.deleteMany({ where: { user_id: req.user.sub } });

//     // Add new availability
//     await prisma.availability.createMany({
//       data: availability.map((date: string) => ({
//         user_id: req.user.sub,
//         available_date: new Date(date),
//       })),
//       skipDuplicates: true,
//     });

//     res.json({ message: "Availability saved" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to save availability" });
//   }
// });





router.get("/events", async (_req, res) => {
  const items = await prisma.event_details.findMany({ orderBy: { event_date: "asc" } });
  res.json({ events: items });
});

//router.post("/events", requireAuth, async (req, res) => {
//    console.log("Raw request body:", JSON.stringify(req.body, null, 2));
//    const parsed = eventSchema.safeParse(req.body);
//    console.log("Parsed data:", JSON.stringify(parsed.data, null, 2));
//    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
//  const event = await prisma.event_details.create({ data: parsed.data });
//  res.json({ message: "Event created", event });
//});



router.get("/me/history", requireAuth, async (req: any, res) => {
  const items = await prisma.volunteer_history.findMany({
    where: { user_id: req.user.sub },
    include: { event: true },
    orderBy: { participation_date: "desc" },
  });
  res.json({ history: items });
});

// router.post("/me/history", requireAuth, async (req: any, res) => {
//   const parsed = volunteerHistorySchema.safeParse(req.body);
//   if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

//   const record = await prisma.volunteer_history.create({ data: parsed.data });
//   res.json({ message: "History record added", record });
// });

export default router;
