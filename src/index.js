const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function init() {
    await pool.query(`CREATE TABLE IF NOT EXISTS tasks (
 id SERIAL PRIMARY KEY,
 title TEXT NOT NULL,
 done BOOLEAN NOT NULL DEFAULT false
 )`);
}
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "ok" });
    } catch (e) {
        res.status(503).json({ status: "db_unavailable" });
    }
});
app.get("/tasks", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id");
    res.json(rows);
});
app.post("/tasks", async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "title requerido" });
    const { rows } = await pool.query(
        "INSERT INTO tasks (title) VALUES ($1) RETURNING *", [title]);
    res.status(201).json(rows[0]);
});
const PORT = process.env.PORT || 3000;
init()
    .then(() => app.listen(PORT, "0.0.0.0", () => console.log("API en puerto " + PORT)))
    .catch((e) => { console.error(e); process.exit(1); });