import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import historyRoutes from "./routes/history";
import profileRoutes from "./routes/profile";
import notificationsRouter from "./routes/notification";
import { db } from "./store"; 
const app = express();
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://volunteer-kc7lcyy0b-wendy-valdezs-projects.vercel.app" // your deployed Vercel frontend
];





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
    res.json(db.events);
});
// Create a new event
app.post("/api/events", (req, res) => {
  const newEvent = req.body;
    db.events.push(newEvent);
  res.status(201).json(newEvent);
});

// Route to get all users (volunteers)
app.get("/api/users", (req, res) => {
    console.log("Returning all users:", db.users);
    res.json(db.users);
});

app.post("/api/users/saveprofile", (req, res) => {
    const { userId, profile } = req.body;

    if (!userId || !profile) {
        return res.status(400).json({ error: "Missing userId or profile" });
    }

    // Find the user in your in-memory database
    const user = db.users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Assign the profile to the user
    user.profile = profile;

    return res.status(200).json({ message: "Profile updated successfully", user });
});

// Delete an event by ID
app.delete("/api/events/:id", (req, res) => {
    const eventId = req.params.id;
    const index = db.events.findIndex(ev => ev.id === eventId);
    if (index !== -1) {
        db.events.splice(index, 1);
        res.status(200).send({ message: "Deleted" });
    } else {
        res.status(404).send({ message: "Event not found" });
    }
});


export default app;