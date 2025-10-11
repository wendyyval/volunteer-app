import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { z } from "zod";

const router = Router();


export const HistoryItemSchema = z.object({
  id: z.string(),
  eventName: z.string().max(100),
  eventDate: z.string(),            // ISO date string ("2025-10-05")
  location: z.string().max(200),
  requiredSkills: z.array(z.string()).default([]),
  urgency: z.enum(["Low", "Medium", "High"]),
  participationStatus: z.enum(["Registered","Confirmed","Attended","No-Show","Cancelled","Withdrawn"]),
  hours: z.number().optional(),
});

export type HistoryItem = z.infer<typeof HistoryItemSchema>;

// In-memory store: userId -> history[]
const store = new Map<string, HistoryItem[]>();

//GET current user's history
router.get("/me", requireAuth, (req: any, res) => {
  const userId = req.user.sub as string; // your requireAuth should set req.user
  const list = store.get(userId) ?? [];
  res.json(list);
});

//POST add a history item for current user (for testing/demo)
const NewItemSchema = HistoryItemSchema.partial().extend({
  // allow client to omit id; we’ll generate it
  id: z.string().optional(),
});
router.post("/me", requireAuth, (req: any, res) => {
  const userId = req.user.sub as string;
  const parsed = NewItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
  }
  const item: HistoryItem = {
    id: parsed.data.id ?? crypto.randomUUID(),
    eventName: parsed.data.eventName ?? "Untitled Event",
    eventDate: parsed.data.eventDate ?? new Date().toISOString().slice(0,10),
    location: parsed.data.location ?? "Unknown",
    requiredSkills: parsed.data.requiredSkills ?? [],
    urgency: parsed.data.urgency ?? "Medium",
    participationStatus: parsed.data.participationStatus ?? "Registered",
    hours: parsed.data.hours,
  };
  const list = store.get(userId) ?? [];
  list.push(item);
  store.set(userId, list);
  res.status(201).json(item);
});

//OPTIONAL: seed sample rows for current user
router.post("/seed", requireAuth, (req: any, res) => {
  const userId = req.user.sub as string;
  const now = new Date();
  const sample: HistoryItem[] = [
    {
      id: crypto.randomUUID(),
      eventName: "Community Park Cleanup",
      eventDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()-10).toISOString(),
      location: "Austin, TX",
      requiredSkills: ["Lifting", "Teamwork"],
      urgency: "Low",
      participationStatus: "Attended",
      hours: 3,
    },
    {
      id: crypto.randomUUID(),
      eventName: "Food Bank Sorting",
      eventDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()-3).toISOString(),
      location: "Austin, TX",
      requiredSkills: ["Organizing"],
      urgency: "Medium",
      participationStatus: "Confirmed",
      hours: 2,
    },
  ];
  store.set(userId, sample);
  res.status(201).json({ seeded: sample.length });
});

export default router;
