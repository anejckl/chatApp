const express = require("express");
const router = express.Router();

module.exports = (pool, bcrypt) => {
  router.get("/check-terms", (req, res) => {
    res.json({ acceptedTerms: !!req.session.acceptedTerms });
  });

  router.post("/accept-terms", (req, res) => {
    req.session.acceptedTerms = true;
    res.status(200).json({ message: 'Terms accepted' });
  });

  return router;
};
