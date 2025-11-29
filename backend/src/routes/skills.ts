import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.post("/", async (req, res) => {
  const { skill_name } = req.body;

  if (!skill_name) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  try {
    // Try create
    const skill = await prisma.skills.create({
      data: { skill_name },
    });
    return res.status(201).json(skill);

  } catch (err: any) {
    // If already exists, return existing one
    if (err.code === "P2002") {
      const existing = await prisma.skills.findUnique({
        where: { skill_name },
      });
      return res.status(201).json(existing);
    }

    console.error("Skill error:", err);
    return res.status(500).json({ error: "Failed to add skill" });
  }
});

// GET skills
router.get("/", async (req, res) => {
  const skills = await prisma.skills.findMany();
  res.json(skills);
});

export default router;
