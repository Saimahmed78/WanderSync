import mongoose from "mongoose";

const revokedTokenSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      ref: "Session",
      required: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
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
