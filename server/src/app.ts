import express from "express";
import cors, { type CorsOptions } from "cors";

import authRoutes from "./routes/auth";
import historyRoutes from "./routes/history";
import profileRoutes from "./profile"; 
import notificationRoutes from "./routes/notification";

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin === FRONTEND_ORIGIN || origin === "http://localhost:5173") {
      return cb(null, true);
    }
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
