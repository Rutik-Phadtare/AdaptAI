const mongoose = require('mongoose');

const queryHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // allow guest queries too (no account required)
    },
    query: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['kid', 'teen', 'adult', 'professional', 'expert'],
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    apisResponded: {
      type: Number, // how many of the 5 APIs came back successfully
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QueryHistory', queryHistorySchema);
