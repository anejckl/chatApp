const express = require("express");
const router = express.Router();

module.exports = (pool, bcrypt) => {

  //POST (login)
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
          role_level: user.role_level,
        },
        sessionExpire: req.session.expiresAt - Date.now(),
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "An error occurred during login." });
    }
  });

  //POST (logout)
  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Could not log out. Please try again." });
      }
      res.clearCookie("connect.sid", { path: '/' });
      res.status(200).json({ message: "Logout successful." });
    });
  });

  //GET (checking user state)
  router.get("/check-auth", (req, res) => {
    if (req.session.isAuthenticated) {
      res.json({
        isAuthenticated: true,
        user: {
          id: req.session.userId,
          username: req.session.username,
          email: req.session.email,
          role_level: req.session.role,
        },
      });
    } else {
      res.json({ isAuthenticated: false, user: null });
    }
  });

  //GET (checking terms acceptance)
  router.get("/check-terms", (req, res) => {
    res.json({ acceptedTerms: !!req.session.acceptedTerms });
  });

  //POST (accepting terms)
  router.post("/accept-terms", (req, res) => {
    req.session.acceptedTerms = true;
    res.status(200).json({ message: 'Terms accepted' });
  });

  return router;
};
