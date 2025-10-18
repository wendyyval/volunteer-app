import authRoutes from "./routes/auth";
import historyRoutes from "./routes/history";
import profileRoutes from "./profile";
import notificationsRouter from "./routes/notification";
import { db } from "./store"; 
import notificationRoutes from "./routes/notification";

import express from "express";
import cors, { type CorsOptions } from "cors";

const app = express();





app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN ?? ""
].filter(Boolean);

const originCheck = (
  requestOrigin: string | undefined,
  cb: (err: Error | null, allow?: boolean) => void
) => {
  if (!requestOrigin) return cb(null, true); 
  if (allowedOrigins.includes(requestOrigin)) return cb(null, true);
  return cb(new Error(`CORS blocked: ${requestOrigin}`));
};

const corsOptions: CorsOptions = {
  origin: originCheck,
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/notifications", notificationRoutes);


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
export default app;
