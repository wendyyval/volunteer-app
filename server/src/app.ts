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

export default app;