require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const { ChatOpenAI } = require("@langchain/openai");
const { ConversationChain } = require("langchain/chains");
const { BufferMemory, ChatMessageHistory } = require("langchain/memory");
const { HumanMessage, AIMessage, SystemMessage, } = require("@langchain/core/messages");

const app = express();
const PORT = 3000;

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
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 120000 }, // 1 hour in milliseconds
  })
);

app.use((req, res, next) => {
  if (!req.session.isInitialized) {
    req.session.isInitialized = true;
    req.session.chatHistory = [];
  } else {
    req.session.chatHistory = req.session.chatHistory || [];
  }
  req.session.expiresAt = Date.now() + req.session.cookie.maxAge;
  next();
});

const mapChatHistory = (chatHistory) =>
  chatHistory.map((msg) => {
    switch (msg.role) {
      case "system":
        return new SystemMessage(msg.content);
      case "assistant":
        return new AIMessage(msg.content);
      default:
        return new HumanMessage(msg.content);
    }
  });

app.post("/api/chat", async (req, res) => {
  try {
    const { role, content } = req.body;

    if (role === "user") {
      req.session.chatHistory.push({ role: "user", content });
    }

    const historyMessages = mapChatHistory(req.session.chatHistory);
    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(historyMessages),
    });
    const conversation = new ConversationChain({ llm: model, memory });

    const assistant = await conversation.call({ input: content });
    const assistantContent = assistant.response;

    req.session.chatHistory.push({
      role: "assistant",
      content: assistantContent,
    });

    res.json({
      role: "assistant",
      content: assistantContent,
      sessionExpire: req.session.expiresAt - Date.now(),
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.get("/api/chat/history", (req, res) => {
  res.json(req.session.chatHistory || []);
});

app.post("/api/chat/history/system", (req, res) => {
  const { systemMessage, action, oldSysMessage } = req.body;
  const indexOfSysMsg = req.session.chatHistory.findIndex(
    (msg) =>
      msg.role === "system" &&
      msg.content.trim().toLowerCase() ===
      (oldSysMessage ? oldSysMessage.trim().toLowerCase() : systemMessage.trim().toLowerCase())
  );

  switch (action) {
    case "add":
      if (indexOfSysMsg == -1) {
        req.session.chatHistory.push({
          role: "system",
          content: systemMessage,
        });
        return res.json({ success: true });
      }
      return res.json({ success: false });

    case "update":
      if (indexOfSysMsg === -1) {
        return res.json({ success: false });
      }

      req.session.chatHistory[indexOfSysMsg].content = systemMessage;
      return res.json({ success: true });

    case "remove":
      if (indexOfSysMsg == -1) {
        return res.status(404).json({ success: false });
      }

      req.session.chatHistory.splice(indexOfSysMsg, 1);
      return res.json({ success: true });

    default:
      return res.json({ success: false });
  }
});

app.get("/api/model", (req, res) => {
  res.json({ modelName: model.modelName, temperature: model.temperature });
});

app.post("/api/model/settings", (req, res) => {
  const { modelName: newModelName, temperature: newTemperature } = req.body;

  if (newModelName) {
    model.modelName = newModelName;
  }
  if (newTemperature !== undefined) {
    model.temperature = newTemperature;
  }

  res.json({ modelName: model.modelName, temperature: model.temperature });
});

// TODO: Remove for production
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
