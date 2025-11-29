import { Router } from "express";
import { prisma } from "../db";

const router = Router();


router.get("/", async (req, res) => {
  const users = await prisma.user_credentials.findMany();
  res.json(users);
});

router.post("/saveprofile", async (req, res) => {
  const { userId, profile } = req.body;

  if (!userId)
    return res.status(400).json({ error: "Missing userId" });

  try {
    const savedProfile = await prisma.user_profile.upsert({
      where: { user_id: Number(userId) },
      update: {
        full_name: profile.fullName ?? "",
        address1: profile.address1 ?? "",
        address2: profile.address2 ?? null,
        city: profile.city ?? "",
        state: profile.state ?? "",
        zip: profile.zip ?? "",
        preferences: profile.preferences ?? "",
      },
      create: {
        user_id: Number(userId),
        full_name: profile.fullName ?? "",
        address1: profile.address1 ?? "",
        address2: profile.address2 ?? null,
        city: profile.city ?? "",
        state: profile.state ?? "",
        zip: profile.zip ?? "",
        preferences: profile.preferences ?? "",
      },
    });

    res.json({ success: true, profile: savedProfile });
  } catch (err) {
    console.error("Failed to save profile:", err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;
