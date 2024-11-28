const pool = require("../../database");

async function logUserAction({ userId, action, status, ipAddress, details }) {
  try {
    await pool.execute(
      "INSERT INTO user_logs (user_id, action, status, ip_address, details) VALUES (?, ?, ?, ?, ?)",
      [userId, action, status, ipAddress, details]
    );
  } catch (error) {
    console.error("Error logging user action:", error);
  }
}

module.exports = {
  logUserAction,
};
