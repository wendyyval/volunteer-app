import express from "express";
import authRoutes from "./auth";
import historyRoutes from "./routes/history";
import profileRoutes from "./profile";
import notificationRoutes from "./routes/notification";
import cors, { type CorsOptions } from "cors";

const app = express();

const isProd = process.env.NODE_ENV === "production";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"; 

const corsOptions: CorsOptions = {
  origin: isProd ? [FRONTEND_ORIGIN] : [FRONTEND_ORIGIN, "http://localhost:5173"],
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};
app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;