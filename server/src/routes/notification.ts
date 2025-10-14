import { Router, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getUserNotices } from "../store";
import { randomUUID } from "crypto";
import type { AppNotification } from "../types";

const router = Router();

router.get("/me", requireAuth, (req: any, res: Response) => {
  let items = getUserNotices(req.user.sub);
  const unread = String(req.query.unread ?? "").trim();
  if (unread === "1" || unread.toLowerCase() === "true") {
    items = items.filter(n => !n.read);
  }
  res.json({ items });
});

router.patch("/:id/read", requireAuth, (req: any, res: Response) => {
  const list = getUserNotices(req.user.sub);
  const n = list.find(x => x.id === req.params.id);
  if (!n) return res.status(404).json({ error: "Not found" });
  n.read = true;
  res.json({ item: n });
});

router.post("/seed", requireAuth, (req: any, res: Response) => {
  const list = getUserNotices(req.user.sub);
  const now = Date.now();
  const seeded: AppNotification[] = [
    { id: randomUUID(), userId: req.user.sub, kind:"info",    topic:"system",           title:"Welcome!",                 ts: now-60000, read:false },
    { id: randomUUID(), userId: req.user.sub, kind:"success", topic:"event_assignment", title:"Assigned: Food Bank",      message:"Sat 10am", ts: now-30000, read:false },
    { id: randomUUID(), userId: req.user.sub, kind:"warning", topic:"reminder",         title:"Event tomorrow",           message:"Park Cleanup 9am", ts: now-15000, read:false }
  ];
  list.push(...seeded);
  res.json({ seeded: seeded.length });
});

export default router;
