import { Router } from "express";
import { prisma } from "../db";

const router = Router();

// CREATE EVENT
router.post("/", async (req, res) => {
  const event = await prisma.event_details.create({
    data: {
      event_name: req.body.event_name,
      description: req.body.description,
      location: req.body.location,
      urgency: req.body.urgency,
      event_date: new Date(req.body.event_date),
    },
  });

  res.status(201).json({ event });
});

// LIST EVENTS
router.get("/", async (req, res) => {
  const events = await prisma.event_details.findMany();
  res.json(events);
});

// DELETE EVENT
router.delete("/:id", async (req, res) => {
  await prisma.event_details.delete({
    where: { event_id: Number(req.params.id) },
  });

  res.json({ message: "Event deleted" });
});

export default router;
