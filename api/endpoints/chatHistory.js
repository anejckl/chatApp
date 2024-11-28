const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json(req.session.chatHistory || []);
});

router.post("/system", (req, res) => {
  const { systemMessage, action, oldSysMessage } = req.body;
  const indexOfSysMsg = req.session.chatHistory.findIndex(
    (msg) =>
      msg.role === "system" &&
      msg.content.trim().toLowerCase() ===
        (oldSysMessage
          ? oldSysMessage.trim().toLowerCase()
          : systemMessage.trim().toLowerCase())
  );

  switch (action) {
    case "add":
      if (indexOfSysMsg === -1) {
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
      if (indexOfSysMsg === -1) {
        return res.status(404).json({ success: false });
      }

      req.session.chatHistory.splice(indexOfSysMsg, 1);
      return res.json({ success: true });

    default:
      return res.json({ success: false });
  }
});
module.exports = router;