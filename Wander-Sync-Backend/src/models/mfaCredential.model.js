import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
// Note: In a real app, use a utility to encrypt/decrypt (e.g., crypto)
import { encryptSecret } from "../utils/encryption.js";

const mfaCredentialSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["TOTP", "SMS", "EMAIL"],
      required: true,
    },
    encryptedSecret: {
      type: String,
      required: function () {
        return this.type === "TOTP";
      },
    },
    backupCodes: [String],

    // Security Context
    riskScore: { type: Number, default: 0 },
    deviceTrustLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },
    isActive: { type: Boolean, default: true },
    label: { type: String, trim: true }, // e.g., "Ali's iPhone"

    lastUsedAt: Date,
  },
  {
    timestamps: true,
  },
);

// --- INDEXES ---
// Compound index for finding active MFA methods for a user
mfaCredentialSchema.index({ userId: 1, isActive: 1 });

// --- PRE-SAVE HOOK ---
mfaCredentialSchema.pre("save", async function (next) {
  // Only encrypt if the secret is modified and exists
  if (this.isModified("encryptedSecret") && this.encryptedSecret) {
    this.encryptedSecret = await encryptSecret(this.encryptedSecret);
  }
  next();
});

const MFACredential = mongoose.model("MFACredential", mfaCredentialSchema);
export { MFACredential };
