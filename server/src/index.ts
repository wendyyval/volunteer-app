import express from "express";
import cors from "cors";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import historyRouter from "./routes/history";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/history", historyRouter)

// TODO: app.use("/api/events", eventsRouter) ...etc

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
