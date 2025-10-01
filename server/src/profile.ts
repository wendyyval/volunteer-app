import { Router } from "express";
import { db } from "./store";
import { profileSchema } from "./validation";
import { requireAuth } from "./auth";

export const profileRouter = Router();

profileRouter.get("/me", requireAuth, (req: any, res) => {
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user.profile ?? null);
});

profileRouter.post("/me", requireAuth, (req: any, res) => {
  const parse = profileSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });

  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.profile = parse.data;
  return res.status(200).json(user.profile);
});
