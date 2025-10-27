import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Wval563#",     
  database: "volunteer_app", 
  port: 3306,
});

app.post("/register", async (req, res) => {
  const { email, password_hash, role } = req.body;

  if (!email || !password_hash) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const sql = "INSERT INTO user_credentials (id, email, password_hash, role) VALUES (UUID(), ?, ?, ?)";
    const [result] = await pool.query(sql, [email, password_hash, role || "volunteer"]);

    console.log("User inserted:", result);
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("MySQL error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

const PORT = 5713;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
