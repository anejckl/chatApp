const express = require("express");
const router = express.Router();

module.exports = (model) => {
  router.get("/", (req, res) => {
    res.json({ modelName: model.modelName, temperature: model.temperature });
  });

  router.post("/settings", (req, res) => {
    const { modelName: newModelName, temperature: newTemperature } = req.body;

    if (newModelName) {
      model.modelName = newModelName;
    }
    if (newTemperature !== undefined) {
      model.temperature = newTemperature;
    }

    res.json({ modelName: model.modelName, temperature: model.temperature });
  });

  return router;
};