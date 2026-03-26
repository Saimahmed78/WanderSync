import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const revokedTokenSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      ref: "Session",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true, // Unique for O(1) lookup in middleware
    },
    revokedAt: {
      type: Date,
      default: Date.now,
      expires: "7d", // Automatic cleanup: tokens disappear after 7 days
    },
  },
  {
    timestamps: true,
  },
);

export const RevokedToken = mongoose.model("RevokedToken", revokedTokenSchema);
