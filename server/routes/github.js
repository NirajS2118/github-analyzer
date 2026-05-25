const express = require("express");
const router = express.Router();
const { getUser, getRepos, computeStats } = require("../services/github");

router.get("/compare/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const [u1Data, u1Repos, u2Data, u2Repos] = await Promise.all([
      getUser(user1),
      getRepos(user1),
      getUser(user2),
      getRepos(user2),
    ]);

    const result1 = computeStats(u1Data, u1Repos);
    const result2 = computeStats(u2Data, u2Repos);

    res.json({ user1: result1, user2: result2 });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: `User not found` });
    }
    if (err.response?.status === 403) {
      return res.status(429).json({ error: "GitHub API rate limit hit. Add a GITHUB_TOKEN in .env to increase limits." });
    }
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const [user, repos] = await Promise.all([
      getUser(req.params.username),
      getRepos(req.params.username),
    ]);
    res.json(computeStats(user, repos));
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;
