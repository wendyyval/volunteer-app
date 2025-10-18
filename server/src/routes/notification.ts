import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { z } from "zod";
import crypto from "crypto";

const router = Router();

// userId -> notifications[]
type NoticeKind = "success" | "info" | "warning" | "error";
type NoticeTopic = "event_assignment" | "event_update" | "reminder" | "system";

export type Notice = {
  id: string;
  kind: NoticeKind;
  topic: NoticeTopic;
  title: string;
  message?: string;
  ts: number;
  read?: boolean;
};

const store = new Map<string, Notice[]>();

const NewNotice = z.object({
  kind: z.enum(["success","info","warning","error"]),
  topic: z.enum(["event_assignment","event_update","reminder","system"]),
  title: z.string().min(1).max(120),
  message: z.string().optional()
});

// list (optionally only unread)
router.get("/me", requireAuth, (req: any, res) => {
  const uid = req.user.sub as string;
  const list = store.get(uid) ?? [];
  if (req.query.unread === "1") return res.json(list.filter(n => !n.read));
  res.json(list);
});

// push one (admin or system could call, but fine for demo)
router.post("/me", requireAuth, (req: any, res) => {
  const parsed = NewNotice.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });
  const uid = req.user.sub as string;
  const n: Notice = { id: crypto.randomUUID(), ts: Date.now(), read: false, ...parsed.data };
  const list = store.get(uid) ?? [];
  list.unshift(n);
  store.set(uid, list.slice(0, 200));
  res.status(201).json(n);
});

// mark read
router.post("/me/:id/read", requireAuth, (req: any, res) => {
  const uid = req.user.sub as string;
  const list = store.get(uid) ?? [];
  const idx = list.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx].read = true;
  res.json({ ok: true });
});

// simple seed
router.post("/seed", requireAuth, (req: any, res) => {
  const uid = req.user.sub as string;
  const now = Date.now();
  const seeded: Notice[] = [
    { id: crypto.randomUUID(), kind:"info", topic:"system", title:"Welcome!", ts: now-60000 },
    { id: crypto.randomUUID(), kind:"success", topic:"event_assignment", title:"Assigned to Food Bank", message:"Sat 10am", ts: now-30000 },
  ];
  store.set(uid, seeded);
  res.json({ seeded: seeded.length });
});

export default router;
