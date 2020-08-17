const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  authGoogleId: {
    type: String,
    default: null,
  },
  authFacebookId: {
    type: String,
    default: null,
  },
  authType: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
