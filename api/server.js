require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { ChatOpenAI } = require("@langchain/openai");
const { ConversationChain } = require("langchain/chains");
const { BufferMemory, ChatMessageHistory } = require("langchain/memory");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");

const app = express();
const PORT = 3000;

const openaiApiKey = process.env.OPENAI_API_KEY;

const modelName = process.env.MODEL_NAME;
const temperature = 0.7;

const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: modelName,
  temperature: temperature,
});

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1 * 60 * 60 * 1000 },
  })
);

app.post("/api/chat", async (req, res) => {
  try {
    const { role, content, system } = req.body;

    if (!content) {
      return res.status(400).json({ error: "No content provided." });
    }

    if (!req.session.chatHistory) {
      req.session.chatHistory = [];
    }

    if (system) {
      req.session.chatHistory = [{ role: "system", content: system }];
    }

    if (role === "user") {
      req.session.chatHistory.push({ role: "user", content });
    }

    const historyMessages = req.session.chatHistory.map((msg) => {
      switch (msg.role) {
        case "system":
          return new SystemMessage(msg.content);
        case "user":
          return new HumanMessage(msg.content);
        case "assistant":
          return new AIMessage(msg.content);
        default:
          return new HumanMessage(msg.content);
      }
    });

    const chatHistory = new ChatMessageHistory(historyMessages);
    const memory = new BufferMemory({ chatHistory });
    const conversation = new ConversationChain({
      llm: model,
      memory: memory,
    });

    const response = await conversation.call({ input: content });
    const assistantResponse = response.response || response.text;

    req.session.chatHistory.push({ role: "assistant", content: assistantResponse });

    res.json({
      role: "assistant",
      content: assistantResponse,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
});


app.get("/api/chat/history", (req, res) => {
  if (!req.session.chatHistory) {
    req.session.chatHistory = [];
  }
  res.json(req.session.chatHistory);
});

app.get("/api/model", (req, res) => {
  res.json({ modelName: model.modelName, temperature: model.temperature });
});

app.post("/api/model/settings", (req, res) => {
  const { modelName, temperature } = req.body;

  if (modelName) {
    model.modelName = modelName;
  }
  if (temperature !== undefined && temperature !== null) {
    model.temperature = temperature;
  }

  res.json({
    modelName: model.modelName,
    temperature: model.temperature,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
