import mongoose from "mongoose";

const { Schema } = mongoose;

const userDeviceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: String,
    ipAddress: String,
    location: String,

    // --- TRUST & SECURITY ---
    isTrusted: { type: Boolean, default: false },
    deviceTrustLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },
    riskScore: { type: Number, default: 0 },

    // --- ACTIVITY ---
    activity: String, // e.g., "Login", "Password Change"
    lastUsedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// Compound index for fingerprinting lookups
userDeviceSchema.index({ userId: 1, deviceId: 1 });

export const UserDevice = mongoose.model("UserDevice", userDeviceSchema);

// Index to quickly find devices per user
userDeviceSchema.index({ userId: 1 });
// Index for sorting by recent activity
userDeviceSchema.index({ lastUsedAt: -1 });

const userDevice = mongoose.model("UserDevice", userDeviceSchema);
export {userDevice};
