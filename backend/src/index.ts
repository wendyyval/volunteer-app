import express from "express";
import cors from "cors";
import { prisma } from "./db";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import skillsRoutes from "./routes/skills";  
import eventsRoutes from "./routes/events";   
import historyRoutes from "./routes/history";
import healthRoutes from "./routes/health";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillsRoutes);  
app.use("/api/events", eventsRoutes);   
app.use("/api/history", historyRoutes);
app.use("/api/register", authRoutes);

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(4000, () => {
    console.log("Server running on port 4000");
  });
}
