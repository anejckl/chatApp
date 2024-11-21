require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const { ChatOpenAI } = require("@langchain/openai");
const bcrypt = require("bcrypt");

const chatRoutes = require("./endpoints/chat");
const chatHistoryRoutes = require("./endpoints/chatHistory");
const modelRoutes = require("./endpoints/model");
const authRoutes = require("./endpoints/terms/terms.js");

const app = express();
const PORT = process.env.PORT || 3000;

const {
  OPENAI_API_KEY: openaiApiKey,
  MODEL_NAME: modelName,
  ORIGIN,
  SECRET_KEY,
} = process.env;

const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: modelName,
  temperature: 0.7,
});

app.use(helmet());
app.use(cors({ origin:  ORIGIN, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 3600000, // 1 hour
    },
  })
);

app.use((req, res, next) => {
  req.session.chatHistory = req.session.chatHistory || [];
  req.session.isInitialized = req.session.isInitialized || true;
  req.session.expiresAt = Date.now() + req.session.cookie.maxAge;
  next();
});

app.use("/api/chat", chatRoutes(model));
app.use("/api/chat/history", chatHistoryRoutes);
app.use("/api/model", modelRoutes(model));
app.use("/api/terms", authRoutes());

app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.stack}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});