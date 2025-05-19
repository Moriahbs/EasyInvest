const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profilePhoto: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  startups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup" }],
});

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fundingStage: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  hidden: { type: Boolean, default: false },
  image: { type: String, required: false },
  valuationLastRound: { type: Number, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  foundedYear: { type: Number, required: true },
  tags: { type: [String], required: true },
  contactEmail: { type: String, required: true },
  country: { type: String, required: true },
  contactPhone: { type: String, required: true },
  founders: { type: String, required: true },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // meta: {
  //   votes: { type: Number, default: 0 },
  //   favs: { type: Number, default: 0 },
  // },
});

const User = mongoose.model("User", userSchema);
const Startup = mongoose.model("Startup", startupSchema);

module.exports = { User, Startup };
