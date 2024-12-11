const { ChatOpenAI } = require("@langchain/openai");
const pool = require("../../database");


let apiKeyCache = {
  test: null,
  production: null,
};

async function refreshApiKeys() {
  try {
    const [rows] = await pool.query(
      "SELECT api_key, test FROM api_keys WHERE status = 1"
    );

    apiKeyCache = rows.reduce(
      (cache, row) => {
        if (row.test) {
          cache.test = row.api_key;
        } else {
          cache.production = row.api_key;
        }
        return cache;
      },
      { test: null, production: null }
    );

    console.log("✅ API keys refreshed.");
  } catch (error) {
    console.error("❌ Error refreshing API keys:", error);
  }
}

refreshApiKeys();
setInterval(refreshApiKeys, 3600000);

async function setApiKey(req, res, next) {
  try {
    const isAuthenticated = Boolean(req.session?.user);
    console.log("User is authenticated:", isAuthenticated);

    const apiKey = isAuthenticated ? apiKeyCache.production : apiKeyCache.test;

    if (!apiKey) {
      console.error(
        `❌ No suitable API key found for ${isAuthenticated ? "authenticated" : "unauthenticated"} user.`
      );
      return res.status(500).json({ error: "No suitable API key found." });
    }

    console.log(
      `✅ API key selected for ${isAuthenticated ? "authenticated" : "unauthenticated"} user.`
    );

    req.openaiModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: process.env.MODEL_NAME || "gpt-4",
      temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    });

    next();
  } catch (error) {
    console.error("❌ Error in setApiKey Middleware:", error);
    next(error);
  }
}

module.exports = setApiKey;