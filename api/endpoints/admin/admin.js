const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { generateRandomPassword } = require("../utils/passwordUtils");

module.exports = (pool) => {
  //GET all user
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

  //GET all keys
  router.get("/keys", async (req, res) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM api_keys");
      res.json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving keys." });
    }
  });

  //POST (create) users
  router.post("/users", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await pool.execute(
        "INSERT INTO users (username, mail, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );

      const [rows] = await pool.execute(
        "SELECT id, username, mail, role_level FROM users WHERE id = ?",
        [result.insertId]
      );
      const user = rows[0];

      res.status(201).json({
        message: "User created successfully",
        user: user,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the user." });
    }
  });

  //PUT (update) users
  router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, email, role_level } = req.body;

    try {
      const updates = [];
      const queryParams = [];

      const user = {
        username: { sql: "username = ?", value: username },
        email: { sql: "mail = ?", value: email },
        role_level: { sql: "role_level = ?", value: role_level },
      };

      for (const field in user) {
        const { sql, value } = user[field];
        if (value !== undefined) {
          updates.push(sql);
          queryParams.push(value);
        }
      }

      if (updates.length === 0) {
        return res
          .status(400)
          .json({ error: "No valid fields provided for update." });
      }

      const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
      queryParams.push(id);

      const [result] = await pool.execute(query, queryParams);

      res.json({ message: "User updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the user." });
    }
  });

  //POST (password reset)
  router.post("/reset-password/:userId", async (req, res) => {
    const userId = req.params.userId;
    const newPassword = generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      const [result] = await pool.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
      );

      if (result.affectedRows > 0) {
        return res.json({ message: "Password has been reset.", newPassword });
      } else {
        return res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while resetting the password." });
    }
  });

  //DELETE user
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
