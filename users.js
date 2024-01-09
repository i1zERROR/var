const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: false, unique: true },
  discordTag: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

const user = mongoose.model("database", UserSchema);

module.exports = user