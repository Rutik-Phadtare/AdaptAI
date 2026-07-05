const express = require('express');
const router = express.Router();
const { orchestrate } = require('../services/aiOrchestrator');
const QueryHistory = require('../models/QueryHistory');

// POST /api/query
// Body: { query: "how does wifi work", level: "kid" }
router.post('/', async (req, res) => {
  const { query, level, userId } = req.body;

  // Basic validation
  if (!query || query.trim().length < 3) {
    return res.status(400).json({ error: 'Please enter a question (at least 3 characters).' });
  }

  const validLevels = ['kid', 'teen', 'adult', 'professional', 'expert'];
  const userLevel = validLevels.includes(level) ? level : 'adult';

  try {
    const response = await orchestrate(query.trim(), userLevel);

    // Save to MongoDB (optional — works even without userId for guest users)
    try {
      await QueryHistory.create({
        userId: userId || null,
        query: query.trim(),
        level: userLevel,
        response,
      });
    } catch (dbErr) {
      // Don't fail the whole request just because history save failed
      console.error('History save failed:', dbErr.message);
    }

    res.json({
      success: true,
      response,
      level: userLevel,
    });

  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
