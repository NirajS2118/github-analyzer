const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${CLIENT_URL}/?auth=failed` }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/?auth=success`);
  }
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({
    user: {
      id: req.user._id,
      login: req.user.login,
      name: req.user.name,
      avatar: req.user.avatar,
      profileUrl: req.user.profileUrl,
    },
  });
});

module.exports = router;
