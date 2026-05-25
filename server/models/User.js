const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    name: String,
    avatar: String,
    email: String,
    profileUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
