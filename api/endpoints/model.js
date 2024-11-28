const express = require("express");
const router = express.Router();

function validateModel(req, res, next) {
  if (!req.openaiModel) {
    return res.status(500).json({ error: "Model is not initialized." });
  }
  next();
}

router.use(validateModel);

router.get("/", (req, res) => {
  const { modelName, temperature } = req.openaiModel;
  res.json({ modelName, temperature });
});

router.post("/settings", (req, res) => {
  const { modelName: newModelName, temperature: newTemperature } = req.body;

  if (newModelName) {
    req.openaiModel.modelName = newModelName;
  }
  if (newTemperature !== undefined) {
    req.openaiModel.temperature = newTemperature;
  }

  res.json({
    modelName: req.openaiModel.modelName,
    temperature: req.openaiModel.temperature,
  });
});

module.exports = router;