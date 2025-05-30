const express = require('express');
const router = express.Router();
const { generateTemplate } = require('../services/openaiService.cjs');

router.post('/generate-template', async (req, res) => {
  console.log('BODY RECEIVED:', req.body); // Debug log
  const { prompt, purpose, audience, layout } = req.body;
  if (!prompt || !purpose || !audience || !layout) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const result = await generateTemplate(prompt, purpose, audience, layout);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;