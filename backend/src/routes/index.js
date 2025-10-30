import express from "express";
const router = express.Router();

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Missing credentials" });

  console.log("Login attempt:", email);

  return res.json({ success: true, token: "mocktoken123" });
});

export default router;