const express = require("express");
const router = express.Router();
const pool = require("../../database");
const { ChatOpenAI } = require("@langchain/openai");

router.get("/keys", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM api_keys");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;