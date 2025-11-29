import { Router } from "express";
import { prisma } from "../db";

const router = Router();


router.post("/", async (req, res) => {
  const user_id = req.body.user_id ?? req.body.userId;
  const event_id = req.body.event_id ?? req.body.eventId;
  const status = req.body.status ?? "Registered";

  if (!user_id || !event_id)
    return res.status(400).json({ error: "Missing user or event" });

  const record = await prisma.volunteer_history.create({
    data: {
      user_id: Number(user_id),
      event_id: Number(event_id),
      participation_date: new Date(),
      status,
    },
  });

  res.status(201).json({ success: true, record });
});


router.get("/:id", async (req, res) => {
  const userId = Number(req.params.id);

  const history = await prisma.volunteer_history.findMany({
    where: { user_id: userId },
    include: {
      event: {
        include: {
          event_skills: {
            include: {
              skill: true,
            },
          },
        },
      },
    },
  });

  const formatted = history.map((h) => ({
    history_id: h.history_id,
    eventName: h.event.event_name,
    date: h.participation_date,
    location: h.event.location,
    requiredSkills: h.event.event_skills.map((es) => es.skill.skill_name),
    status: h.status,
  }));

  res.json(formatted);
});

export default router;
