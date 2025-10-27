import express from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();
const app = express();

app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes); 

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;