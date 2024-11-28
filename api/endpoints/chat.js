const express = require("express");
const router = express.Router();
const { ConversationChain } = require("langchain/chains");
const { BufferMemory, ChatMessageHistory } = require("langchain/memory");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");

const mapChatHistory = (chatHistory = []) =>
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

router.post("/", async (req, res) => {
  try {
    const { role, content } = req.body;

    req.session.chatHistory = req.session.chatHistory || [];

    if (role === "user") {
      req.session.chatHistory.push({ role: "user", content });
    }

    const historyMessages = mapChatHistory(req.session.chatHistory);

    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(historyMessages),
    });

    const conversation = new ConversationChain({
      llm: req.openaiModel,
      memory,
    });

    const assistantResponse = await conversation.call({ input: content });
    const assistantContent = assistantResponse.response;

    req.session.chatHistory.push({
      role: "assistant",
      content: assistantContent,
    });

    res.json({
      role: "assistant",
      content: assistantContent,
      sessionExpire: Math.max(0, req.session.expiresAt - Date.now()),
    });
  } catch (error) {
    console.error("Error in /api/chat:", error.message);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
});

module.exports = router;
