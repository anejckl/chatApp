const { ChatOpenAI } = require("@langchain/openai");
const pool = require("../../database");

async function setApiKey(req, res, next) {
  try {
    let apiKey;

    if (false) {
      const [rows] = await pool.query(
        "SELECT api_key FROM api_keys WHERE test = 0 AND status = 'active' LIMIT 1"
      );
      apiKey = rows.length ? rows[0].api_key : null;
    } else {
      const [rows] = await pool.query(
        "SELECT api_key FROM api_keys WHERE test = 1 AND status = 'active' LIMIT 1"
      );
      apiKey = rows.length ? rows[0].api_key : null;
    }

    if (!apiKey) {
      return res.status(500).json({ error: "No suitable API key found." });
    }

    req.openaiModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4",
      temperature: 0.7,
    });

    next();
  } catch (error) {
    console.error("Error fetching API key:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = setApiKey;