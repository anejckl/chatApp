const session = require("express-session");

const setupSession = () => ({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 3600000, // 1 hour
  },
});

module.exports = { setupSession };