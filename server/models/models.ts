import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  startups: mongoose.Types.Array<mongoose.Types.ObjectId>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  startups: [{ type: Schema.Types.ObjectId, ref: "Startup" }],
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export interface IStartup extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  location: string;
  fundingStage: string;
  image?: string;
  valuationLastRound: number;
  contactEmail: string;
  contactPhone: string;
  founders: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  foundedYear: number;
  tags: string[];
  updatedAt?: Date;
  hidden: boolean;
}

const startupSchema = new Schema<IStartup>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fundingStage: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  hidden: { type: Boolean, default: false },
  image: { type: String, required: false },
  location: { type: String, required: true },
  valuationLastRound: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  foundedYear: { type: Number, required: true },
  tags: { type: [String], required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  founders: { type: String, required: true },
});

export const Startup =
  mongoose.models.Startup || mongoose.model<IStartup>("Startup", startupSchema);
