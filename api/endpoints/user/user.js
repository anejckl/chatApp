const express = require("express");
const router = express.Router();

function sendErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ error: message });
}

router.post("/", (req, res) => {
  const userDetails = req.body;

  if (!userDetails || !userDetails.sub) {
    console.error("Invalid user data received.");
    return sendErrorResponse(res, 400, "Invalid user data.");
  }

  req.session.user = userDetails;
  console.log("User details saved to session for user:", userDetails.sub);

  return res.status(200).json({ message: "User details saved successfully." });
});

router.post("/logout", (req, res) => {
  if (!req.session) {
    console.warn("No active session to destroy.");
    return sendErrorResponse(res, 400, "No active session found.");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return sendErrorResponse(res, 500, "Failed to log out.");
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    console.log("User logged out and session destroyed.");

    return res.status(200).json({ message: "Logged out successfully." });
  });
});

module.exports = router;