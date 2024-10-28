const express = require("express");
const router = express.Router();

module.exports = (pool, bcrypt) => {
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ? OR mail = ?",
        [username, username]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const user = rows[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.isAuthenticated = true;
      req.session.role = user.role_level;

      res.json({
        message: "Login successful.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role_level,
        },
        sessionExpire: req.session.expiresAt - Date.now(),
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "An error occurred during login." });
    }
  });

  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Could not log out. Please try again." });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful." });
    });
  });

  return router;
};
