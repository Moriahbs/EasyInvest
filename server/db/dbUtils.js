const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profilePhoto: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  targetAudience: { type: String, required: true },
  financialGoals: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  hidden: { type: Boolean, default: false },

  image: { type: String, required: false },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // meta: {
  //   votes: { type: Number, default: 0 },
  //   favs: { type: Number, default: 0 },
  // },
});

const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);

module.exports = { User, Project };
