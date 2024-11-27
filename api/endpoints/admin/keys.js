const express = require("express");
const router = express.Router();
const pool = require("../../database");
const { OPENAI_API_KEY: envKey } = process.env;

router.get("/keys", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM api_keys");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getApiKey(session) {
  if (session?.user?.id) {
    try {
      const [rows] = await pool.query(
        "SELECT api_key FROM api_keys WHERE user_id = ? AND status = 'active' LIMIT 1",
        [session.user.id]
      );
      return rows.length ? rows[0].api_key : envKey;
    } catch (err) {
      console.error("Error fetching user API key:", err.message);
    }
  }
  return envKey;
}

module.exports = { router, getApiKey, };
