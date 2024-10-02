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

app.use(
  cors({
    origin: "http://localhost:4200",
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
  })
);

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error("OpenAI API key is undefined");
}

const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-4",
  temperature: 0.7,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: "Input is required." });
    }
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

    const response = await conversation.call({ input });
    const updatedMessages = await memory.chatHistory.getMessages();
    const updatedMessagesArray = updatedMessages.map((msg) => ({
      role: msg._getType() === "human" ? "user" : "assistant",
      content: msg.content,
    }));

    req.session.chatHistory = updatedMessagesArray;
    res.json({ response: response.response || response.text });
  } catch (error) {
    console.error("Error handling chat:", error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
