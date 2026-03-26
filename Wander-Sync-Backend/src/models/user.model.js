import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // --- IDENTITY ---
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    bio: { type: String, default: "" },
    avatarUrl: String,
    profileImage: String,

    // --- PREFERENCES & CONTACT ---
    contactPhone: String,
    timezone: { type: String, default: "PKT" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },

  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export { User };
