import { Router, Response } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth";
import { getUserHistory } from "../store";
import type { HistoryItem, ParticipationStatus } from "../types";

const router = Router();

const createHistorySchema = z.object({
  eventName: z.string().min(2).max(100).default("Community Cleanup"),
  eventDate: z.string().default(() => new Date().toISOString()),
  location: z.string().min(2).max(200).default("Houston, TX"),
  requiredSkills: z.array(z.string()).default(["Teamwork"]),
  urgency: z.enum(["Low","Medium","High"]).default("Low"),
  participationStatus: z.enum([
    "Registered","Confirmed","Attended","No-Show","Cancelled","Withdrawn"
  ]).default("Registered"),
  hours: z.number().optional().default(2),
});

router.get("/", requireAuth, (req: any, res: Response) => {
  const items = getUserHistory(req.user.sub);
  res.json({ items });
});

router.post("/", requireAuth, (req: any, res: Response) => {
  const raw = req.body ?? {};

  // Normalize: treat empty strings/null as undefined so defaults apply
  const normalized = {
    ...raw,
    eventName:
      typeof raw.eventName === "string" && raw.eventName.trim() ? raw.eventName : undefined,
    eventDate:
      typeof raw.eventDate === "string" && raw.eventDate.trim() ? raw.eventDate : undefined,
    location:
      typeof raw.location === "string" && raw.location.trim() ? raw.location : undefined,
    requiredSkills: Array.isArray(raw.requiredSkills) ? raw.requiredSkills : undefined,
    hours: typeof raw.hours === "number" ? raw.hours : undefined,
  };

  const parsed = createHistorySchema.safeParse(normalized);
  if (!parsed.success) {
    console.error("❌ History validation failed:", parsed.error.flatten());
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const data = parsed.data;
  const item: HistoryItem = {
    id: `h-${Date.now()}`,
    userId: req.user.sub,
    eventName: data.eventName,
    eventDate: data.eventDate,
    location: data.location,
    requiredSkills: data.requiredSkills,
    urgency: data.urgency,
    participationStatus: data.participationStatus as ParticipationStatus,
    hours: data.hours,
  };

  const list = getUserHistory(req.user.sub);
  list.push(item);
  return res.status(201).json(item);
});

router.post("/seed", requireAuth, (req: any, res: Response) => {
  const list = getUserHistory(req.user.sub);
  const now = new Date();
  list.push(
    {
      id: `h-${Date.now()-1}`,
      userId: req.user.sub,
      eventName: "Food Bank Sorting",
      eventDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()-2).toISOString(),
      location: "Houston, TX",
      requiredSkills: ["Organizing", "Lifting"],
      urgency: "High",
      participationStatus: "Attended",
      hours: 3
    },
    {
      id: `h-${Date.now()-2}`,
      userId: req.user.sub,
      eventName: "Park Cleanup",
      eventDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()-5).toISOString(),
      location: "Austin, TX",
      requiredSkills: ["Teamwork"],
      urgency: "Medium",
      participationStatus: "Confirmed",
      hours: 2
    }
  );
  res.json({ seeded: 2 });
});

export default router;