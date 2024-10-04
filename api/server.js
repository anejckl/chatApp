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
var modelName = process.env.MODEL_NAME;
var temperature = 0.7;
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
    cookie: { secure: false },
    maxAge: 1 * 60 * 60 * 1000,
  })
);

app.post("/api/chat", async (req, res) => {
  try {
    const { input } = req.body;
    if (!req.session.chatHistory) {
      req.session.chatHistory = [];
    }

    const historyMessages = req.session.chatHistory.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "assistant") {
        return new AIMessage(msg.content);
      } else {
        return new HumanMessage(msg.content);
      }
    });

    const chatHistory = new ChatMessageHistory(historyMessages);
    const memory = new BufferMemory({ chatHistory });
    const conversation = new ConversationChain({
      llm: model,
      memory: memory,
    });

    let responseText = null;
    if (input) {
      const response = await conversation.call({ input });
      responseText = response.response || response.text;
      const updatedMessages = await memory.chatHistory.getMessages();
      const updatedMessagesArray = updatedMessages.map((msg) => ({
        role: msg._getType() === "human" ? "user" : "assistant",
        content: msg.content,
      }));

      req.session.chatHistory = updatedMessagesArray;
    }
    res.json({
      response: responseText,
      chatHistory: req.session.chatHistory,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
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
