const cors = require("cors");

const setupCors = () => cors({
  origin: process.env.ORIGIN || "*", // Allow all origins if not specified
  credentials: true,
});

module.exports = { setupCors };