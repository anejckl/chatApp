const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = (pool) => {
  router.get("/users", async (req, res) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM users");

      res.json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving users." });
    }
  });

  router.post("/users", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await pool.execute(
        "INSERT INTO users (username, mail, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );

      res.status(201).json({
        message: "User created successfully",
        userId: result.insertId,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the user." });
    }
  });

  router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      res.json("User deleted successfully");
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user." });
    }
  });

  return router;
};
