const express = require("express");
const router = express.Router();
const pool = require("../../database");

router.get("/keys", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM api_keys");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/key/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(status, id);

  try {
    const [result] = await pool.execute(
      "UPDATE api_keys SET status = ? WHERE id = ?",
      [status, id]
    );
    console.log(result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Key not found." });
    }

    res.json({ message: "Key status updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the key status." });
  }
});

module.exports = router;