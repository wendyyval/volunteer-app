import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import historyRoutes from "./routes/history";
import profileRoutes from "./profile";
import notificationsRouter from "./routes/notification";


const app = express();
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://volunteer-kc7lcyy0b-wendy-valdezs-projects.vercel.app" // your deployed Vercel frontend
];

// event storage in memory for now
const events: any[] = [];



app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationsRouter);


// Get all events
app.get("/api/events", (_req, res) => {
  res.json(events);
});
// Create a new event
app.post("/api/events", (req, res) => {
  const newEvent = req.body;
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Delete an event by ID
app.delete("/api/events/:id", (req, res) => {
    const eventId = req.params.id;
    const index = events.findIndex(ev => ev.id === eventId);
    if (index !== -1) {
        events.splice(index, 1);
        res.status(200).send({ message: "Deleted" });
    } else {
        res.status(404).send({ message: "Event not found" });
    }
});


export default app;