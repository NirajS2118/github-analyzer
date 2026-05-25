const mongoose = require("mongoose");

const comparisonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user1Login: { type: String, required: true },
    user2Login: { type: String, required: true },
    user1Avatar: String,
    user2Avatar: String,
    user1Score: Number,
    user2Score: Number,
    winner: String,
  },
  { timestamps: true }
);

comparisonSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Comparison", comparisonSchema);
