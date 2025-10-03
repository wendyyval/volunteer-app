import express from "express";
import cors from "cors";
import authRoutes from "./auth";
import historyRoutes from "./routes/history";
import profileRoutes from "./profile";


const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/profile", profileRoutes);

export default app;