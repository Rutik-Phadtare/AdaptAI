const express       = require('express');
const router        = express.Router();
const { protect }   = require('../middleware/auth');
const QueryHistory  = require('../models/QueryHistory');

// ─── GET /api/user/history ────────────────────────────────────────────────────
// Returns the 50 most recent queries for the logged-in user
router.get('/history', protect, async (req, res) => {
  try {
    const history = await QueryHistory
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/user/history/:id ────────────────────────────────────────────
// Deletes a single history item — only if it belongs to the logged-in user
router.delete('/history/:id', protect, async (req, res) => {
  try {
    const item = await QueryHistory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'History item not found.' });
    }

    // Security check: make sure the item belongs to THIS user
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorised to delete this item.' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Deleted.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;