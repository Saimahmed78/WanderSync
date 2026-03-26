import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSecuritySchema = new mongoose.Schema(
  {
    // --- LINK TO USER ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1:1 relationship
      index: true,
    },

    hashedPassword: { type: String, required: true }, // Mapped from hashed_password

    // --- SECURITY FLAGS ---
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "DELETED"],
      default: "ACTIVE",
    },
    mfaEnabled: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    // --- SENSITIVE TOKENS & EXPIRY ---
    hashedVerificationToken: {
      type: String,
    },
    hashedVerificationTokenExpiry: {
      type: Date,
    },
    hashedForgotPasswordToken: {
      type: String,
    },
    hashedForgotPasswordTokenExpiry: {
      type: Date,
    },

    // --- SECURITY STATS ---

    lastLoginAt: Date,
    lastFailedAt: Date,
    lastPasswordChangeAt: Date,
    suspiciousScore: { type: Number, default: 0 },
    passwordChangedCount: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    totalLogins: { type: Number, default: 0 },
    lockUntil: Date,
  },
  {
    timestamps: true,
  },
);

//  Hash password before saving
userSecuritySchema.pre("save", async function () {
  if (this.isModified("hashedPassword") && this.hashedPassword) {
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
  }
});

//  Instance Methods
userSecuritySchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.hashedPassword);
};

// Optimized index for account locking logic
userSecuritySchema.index({ "stats.lockUntil": 1 });

userSecuritySchema.methods.generateRefreshToken = function (userId) {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );
  const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
  
  return { refreshToken, hashedRefreshToken: hashed };
};

userSecuritySchema.methods.generateAccessToken = function (userId, name, email) {
  return jwt.sign(
    { id: userId, name, email},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

userSecuritySchema.methods.generateToken = function (type) {
  console.log("Generating token of type:", type);
  const token = crypto.randomBytes(32).toString("hex");
  console.log("Generated token:", token); // Debug log"
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  if (type === "verification") {
    this.hashedVerificationToken = hashed;
    this.hashedVerificationTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min

     console.log(
    "this.hashedVerificationToken:",
    this.hashedVerificationToken,
    "this.hashedVerificationTokenExpiry:",
    this.hashedVerificationTokenExpiry,
  );
  }
 
  else if (type === "forgot") {
    this.hashedForgotPasswordToken = hashed;
    this.hashedForgotPasswordTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min

    console.log(
    "this.hashedForgotPasswordToken:",
    this.hashedForgotPasswordToken,
    "this.hashedForgotPasswordTokenExpiry:",
    this.hashedForgotPasswordTokenExpiry,
  );
  }
  return token; // send raw token to user
};

export const UserSecurity = mongoose.model("UserSecurity", userSecuritySchema);
