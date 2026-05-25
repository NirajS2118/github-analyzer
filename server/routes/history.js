const express = require("express");
const router = express.Router();
const Comparison = require("../models/Comparison");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, async (req, res) => {
  try {
    const { user1Login, user2Login, user1Avatar, user2Avatar, user1Score, user2Score } = req.body;

    const winner =
      user1Score > user2Score
        ? user1Login
        : user2Score > user1Score
        ? user2Login
        : "tie";

    const existing = await Comparison.findOne({
      userId: req.user._id,
      user1Login,
      user2Login,
    });

    if (existing) {
      existing.user1Score = user1Score;
      existing.user2Score = user2Score;
      existing.winner = winner;
      existing.updatedAt = Date.now();
      await existing.save();
      return res.json(existing);
    }

    const comparison = await Comparison.create({
      userId: req.user._id,
      user1Login,
      user2Login,
      user1Avatar,
      user2Avatar,
      user1Score,
      user2Score,
      winner,
    });

    res.status(201).json(comparison);
  } catch (err) {
    res.status(500).json({ error: "Failed to save comparison" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const history = await Comparison.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Comparison.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;
