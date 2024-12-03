require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const { asyncHandler } = require("./endpoints/utils/asyncHandler.js");
const { setupSession } = require("./endpoints/utils/sessionConfig.js");
const { setupCors } = require("./endpoints/utils/corsConfig.js");

const app = express();
const PORT = process.env.PORT;

app.use(session(setupSession()));
app.use(express.json());
app.use(helmet());
app.use(setupCors());

const setApiKey = require("./endpoints/utils/apiKey.js");
app.use(asyncHandler(setApiKey));

const routes = [
  { path: "/api/chat", route: "./endpoints/chat.js" },
  { path: "/api/chat/history", route: "./endpoints/chatHistory.js" },
  { path: "/api/model", route: "./endpoints/model.js" },
  { path: "/api/terms", route: "./endpoints/terms/terms.js" },
  { path: "/api/admin", route: "./endpoints/admin/keys.js" },
  { path: "/api/user", route: "./endpoints/user/user.js"},
];

routes.forEach(({ path, route }) => {
  app.use(path, require(route));
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.stack}`);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});