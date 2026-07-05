const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const QueryHistory = require('../models/QueryHistory');

// GET /api/user/history
// Protected route — requires Bearer token in Authorization header
router.get('/history', protect, async (req, res) => {
  try {
    const history = await QueryHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // newest first
      .limit(50);              // max 50 results

    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
