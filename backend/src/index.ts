import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { email, z } from "zod";
import cron from "node-cron";

dotenv.config({ path: "./.env" });
console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://volunteer-gxhxcwj8w-wendy-valdezs-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const prisma = new PrismaClient();
console.log("Prisma client initialized..."); // confirmation log, remove maybe later idk, good ref
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user_credentials.create({
      data: {
        email,
        password_hash,
        role: "volunteer",
      },
    });

    console.log("Registered new user:", newUser.email);
    return res.status(201).json({ success: true, user: newUser });
  } catch (err: any) {
    console.error("Error registering user:", err);
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: "Registration failed" });
  }
});
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await prisma.user_credentials.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }


    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/users/saveprofile", async (req, res) => {
  const { userId, profile } = req.body;

  if (!userId || !profile?.fullName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const savedProfile = await prisma.user_profile.upsert({
      where: { user_id: Number(userId) },
      update: {
        full_name: profile.fullName,
        address1: profile.address1,
        address2: profile.address2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        preferences: profile.preferences,
      },
      create: {
        user_id: Number(userId),
        full_name: profile.fullName,
        address1: profile.address1,
        address2: profile.address2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        preferences: profile.preferences,
      },
    });

    res.json({ success: true, profile: savedProfile });
  } catch (err) {
    console.error("Failed to save profile:", err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});


app.get("/api/users", async (_req, res) => {
  try{
    const users = await prisma.user_credentials.findMany({
      include: {
        user_profile: true,
      },
    });

    res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        profile: u.user_profile ? {
          fullName: u.user_profile.full_name,
          city: u.user_profile.city,
          state: u.user_profile.state,
          zip: u.user_profile.zip,
          skills: u.user_profile.preferences || [],
          availability: u.user_profile.preferences || "",
          preferences: u.user_profile.preferences || null,

      }
      : null,
    }))
  );

  }catch(err){
    console.error("Error fetching users: ", err);
    res.status(500).json({error: "Failed to fetch users"});
  }
});

const eventSchema = z.object({
  event_name: z.string().min(2),
  description: z.string().min(5),
  location: z.string().min(2),
  urgency: z.enum(["Low", "Medium", "High"]),
  event_date: z.string(),
  requiredSkills: z.array(z.string()).default([]),
  creatorId: z.string().optional(),
});

app.get("/api/skills", async (_req, res) => {
  const allSkills = await prisma.skills.findMany({ orderBy: { skill_name: "asc" } });
  res.json(allSkills);
});

app.post("/api/skills", async (req, res) => {
  const { skill_name } = req.body;
  if (!skill_name) return res.status(400).json({ error: "Skill name is required" });

  try {
    const skill = await prisma.skills.upsert({
      where: { skill_name },
      update: {},
      create: { skill_name },
    });
    res.status(201).json(skill);
  } catch (err) {
    console.error("Error adding skill:", err);
    res.status(500).json({ error: "Failed to add skill" });
  }
});

app.get("/api/events", async (_req, res) => {
  try {
    const events = await prisma.event_details.findMany({
    include: {
      event_skills: {
        include: { skill: true },
      },
    },
  });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/api/events", async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const { requiredSkills, ...eventData } = parsed.data;

  try {
    const event = await prisma.event_details.create({
      data: {
        event_name: eventData.event_name,
        description: eventData.description,
        location: eventData.location,
        urgency: eventData.urgency,
        event_date: new Date(eventData.event_date),
      },
    });
    const volunteers = await prisma.user_credentials.findMany({
          where: { role: "volunteer" },
    });

    for (const v of volunteers) {
      await prisma.notification.create({
        data: {
          user_id: v.id,
          message: `A new event "${event.event_name}" has been added!`,
        },
      });
    }    

    const skills = await prisma.skills.findMany({
      where: { skill_name: { in: requiredSkills } },
    });

    if (skills.length > 0) {
      await prisma.event_skills.createMany({
        data: skills.map((skill) => ({
          event_id: event.event_id,
          skill_id: skill.skill_id,
        })),
        skipDuplicates: true,
      });
    }
    if (req.body.creatorId) {
      await prisma.volunteer_history.create({
        data: {
          user_id: Number(req.body.creatorId),
          event_id: event.event_id,
          participation_date: new Date(),
          status: "Registered",
        },
      });
    }  
    res.status(201).json({
      message: "Event created successfully",
      event,
      linkedSkills: skills.map((s) => s.skill_name),
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  const eventId = Number(req.params.id);

  if (!eventId) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    await prisma.event_skills.deleteMany({
      where: { event_id: eventId }
    });

    await prisma.volunteer_history.deleteMany({
      where: { event_id: eventId }
    });

    await prisma.event_details.delete({
      where: { event_id: eventId }
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting event:", err);
    return res.status(500).json({ error: "Failed to delete event" });
  }
});



app.get("/api/notifications/me", async (req, res) => {
  const userId = Number(req.headers["x-user-id"]);
  if (!userId) return res.status(401).json({ error: "Missing user ID header" });

  const unreadOnly = req.query.unread === "1";

  try {
    const notices = await prisma.notification.findMany({
      where: unreadOnly
        ? { user_id: userId, read: false }
        : { user_id: userId },
      orderBy: { created_at: "desc" },
    });

    res.json(
      notices.map((n) => ({
        id: String(n.id),
        title: "Notification",
        message: n.message,
        read: n.read,
        kind: "info",
        topic: "general",
        ts: n.created_at.getTime(),
      }))
    );
  } catch (err) {
    console.error("Failed fetching notifications", err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
});
app.get("/api/notifications/reminders/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const upcoming = await prisma.volunteer_history.findMany({
      where: { user_id: userId },
      include: { event: true },
    });

    const now = Date.now();
    const reminders: any[] = [];

    for (const h of upcoming) {
      const eventTime = new Date(h.event.event_date).getTime();
      const diffHours = (eventTime - now) / (1000 * 60 * 60);


      if (diffHours < 24 && diffHours > 23) {
        reminders.push({
          title: "Event Reminder",
          message: `Reminder: "${h.event.event_name}" is happening tomorrow!`,
        });
      }

      if (diffHours < 2 && diffHours > 1) {
        reminders.push({
          title: "Event Starting Soon",
          message: `"${h.event.event_name}" starts in about 2 hours.`,
        });
      }
    }

    res.json(reminders);
  } catch (err) {
    console.error("Reminder error", err);
    res.status(500).json({ error: "Failed to load reminders" });
  }
});


app.post("/api/notifications/me/:id/read", async (req, res) => {
  const userId = Number(req.headers["x-user-id"]);
  if (!userId) return res.status(401).json({ error: "Missing user ID header" });

  const id = Number(req.params.id);

  try {
    await prisma.notification.updateMany({
      where: { id, user_id: userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed updating notification", err);
    res.status(500).json({ error: "Failed to mark read" });
  }
});


app.get("/api/history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await prisma.volunteer_history.findMany({
      where: { user_id: Number(userId) },
      include: {
        event: {
          include: {
            event_skills: {
              include: { skill: true },
            },
          },
        },
      },
      orderBy: { participation_date: "desc" },
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
  } catch (err) {
    console.error("Error fetching volunteer history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.post("/api/history", async (req, res) => {
  const { user_id, event_id, status } = req.body;

  if (!user_id || !event_id)
    return res.status(400).json({ error: "Missing user_id or event_id" });

  try {
    const record = await prisma.volunteer_history.create({
      data: {
        user_id: Number(user_id),
        event_id: Number(event_id),
        participation_date: new Date(),
        status: status || "Registered",
      },
    });
    res.status(201).json({ success: true, record });
  } catch (err) {
    console.error("Error adding volunteer history:", err);
    res.status(500).json({ error: "Failed to add history" });
  }
});


const port = process.env.PORT || 3001;


cron.schedule("0 8 * * *", async () => {
  console.log("Running daily event reminder job...");
  console.log("🔥 Reminder cron job triggered at", new Date().toLocaleString());

  const today = new Date();

  try {
    const upcomingEvents = await prisma.event_details.findMany({
      include: {
        volunteer_history: true,
      },
    });

    for (const ev of upcomingEvents) {
      const eventDate = new Date(ev.event_date);

      const diffDays =
        Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let reminderMessage = null;

      if (diffDays === 7) {
        reminderMessage = `Reminder: Your event "${ev.event_name}" is in 1 week!`;
      }
      if (diffDays === 1) {
        reminderMessage = `Reminder: Your event "${ev.event_name}" is tomorrow!`;
      }
      if (diffDays === 0) {
        reminderMessage = `Reminder: Your event "${ev.event_name}" is today!`;
      }

      if (reminderMessage) {
        for (const vh of ev.volunteer_history) {
          await prisma.notification.create({
            data: {
              user_id: vh.user_id,
              message: reminderMessage,
            },
          });
        }
      }
    }
  } catch (err) {
    console.error("Reminder job failed:", err);
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;

