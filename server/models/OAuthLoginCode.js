const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: String,
  browserChallenge: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required() { return !this.linkIdentity; } },
  linkIdentity: String,
  linkLogin: String,
  expiresAt: { type: Date, required: true, expires: 0 },
});

module.exports = mongoose.model("OAuthLoginCode", schema);

