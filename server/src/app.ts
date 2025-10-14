import authRoutes from "./routes/auth";
import historyRoutes from "./routes/history";
import notificationRoutes from "./routes/notification";

import express from "express";
import cors, { type CorsOptions } from "cors";

const app = express();

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

export default app;
