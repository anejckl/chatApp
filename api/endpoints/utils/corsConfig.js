const cors = require("cors");

const setupCors = () => cors({
  origin: process.env.ORIGIN,
  credentials: true,
});

module.exports = { setupCors };