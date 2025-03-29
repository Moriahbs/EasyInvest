import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  projects: mongoose.Types.Array<mongoose.Types.ObjectId>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export interface IProject extends Document {
  // _id: string;
  owner: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description: string;
  targetAudience: string;
  financialGoals: string;
  // image?: string;
  createdAt: Date;
  updatedAt?: Date;
  hidden: boolean;
  // meta: {
  //   votes: number;
  //   favs: number;
  // };
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  targetAudience: { type: String, required: true },
  financialGoals: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  hidden: { type: Boolean, default: false },
  // meta: {
  //   votes: { type: Number, default: 0 },
  //   favs: { type: Number, default: 0 },
  // },
});

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
