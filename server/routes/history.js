const express = require("express");
const router = express.Router();

const Comparison = require("../models/Comparison");
const { requireAuth } = require("../middleware/auth");

// Save or update a comparison
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      user1Login,
      user2Login,
      user1Avatar,
      user2Avatar,
      user1Score,
      user2Score,
    } = req.body;

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
      existing.user1Avatar = user1Avatar;
      existing.user2Avatar = user2Avatar;
      existing.user1Score = user1Score;
      existing.user2Score = user2Score;
      existing.winner = winner;

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
    console.error("Failed to save comparison:", err);
    res.status(500).json({
      error: "Failed to save comparison",
    });
  }
});

// Get comparison history
router.get("/", requireAuth, async (req, res) => {
  try {
    const history = await Comparison.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    console.error("Failed to fetch history:", err);
    res.status(500).json({
      error: "Failed to fetch history",
    });
  }
});

// Delete a comparison
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Comparison.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        error: "Comparison not found",
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete comparison:", err);
    res.status(500).json({
      error: "Failed to delete",
    });
  }
});

module.exports = router;
