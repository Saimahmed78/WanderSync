import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UserSecurity } from "../models/userSecurity.model.js";
import { Session } from "../models/session.model.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptionsBase = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
};

export async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing)
    throw new ApiError(409, "Registration failed", ["User already exists"]);

  const user = await User.create({ name, email });

  const userSecurityDoc = await UserSecurity.create({
    userId: user._id,
    hashedPassword: password,
  });

  const verificationToken = userSecurityDoc.generateToken("verification");

  if (
    !userSecurityDoc.hashedVerificationToken ||
    !userSecurityDoc.hashedVerificationTokenExpiry
  ) {
    throw new ApiError(400, "User registration failed", [
      "Verification token generation failed",
    ]);
  }

  await userSecurityDoc.save();

  const verificationURL = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
  return { user, verificationToken, verificationURL };
}

export async function verifyEmail(token) {
  if (!token) throw new ApiError(400, "Token is required");

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const userSecurity = await UserSecurity.findOne({
    hashedVerificationToken: hashed,
    hashedVerificationTokenExpiry: { $gt: Date.now() },
  });

  if (!userSecurity) throw new ApiError(404, "Token is expired or invalid");

  userSecurity.hashedVerificationToken = undefined;
  userSecurity.hashedVerificationTokenExpiry = undefined;
  userSecurity.emailVerified = true;
  await userSecurity.save();

  const user = await User.findById(userSecurity.userId);
  if (!user) throw new ApiError(404, "User associated with token not found");

  return { email: user.email, name: user.name };
}

export async function resendVerification(email) {
  const user = await User.findOne({ email });
  if (!user)
    throw new ApiError(404, "User not found. Please register your account");

  const userSecurity = await UserSecurity.findOne({ userId: user._id });
  if (!userSecurity)
    throw new ApiError(404, "User security settings not found");

  if (userSecurity.emailVerified)
    throw new ApiError(400, "User is already verified");

  const token = userSecurity.generateToken("verification");

  if (
    !userSecurity.hashedVerificationToken ||
    !userSecurity.hashedVerificationTokenExpiry
  ) {
    throw new ApiError(400, "Verification token generation failed");
  }

  await userSecurity.save();
  const verificationURL = `${process.env.CLIENT_URL}/verify/${token}`;
  return { name: user.name, verificationURL };
}


export async function login({ email, password, deviceId }, req) {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User does not exist");

  const userSecurity = await UserSecurity.findOne({ userId: user._id });
  if (!userSecurity) throw new ApiError(404, "User security not found");

  if (!userSecurity.emailVerified)
    throw new ApiError(403, "User is not verified");

  const isValid = await userSecurity.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(400, "Email or password is incorrect");

  const accessToken = userSecurity.generateAccessToken(user._id, user.name, user.email);
  const { refreshToken, hashedRefreshToken } =
    userSecurity.generateRefreshToken(user._id);

  await Session.create({
    userId: user._id,
    deviceId,                           // BUG FIX: was derived from req without res, so could be a fresh UUID on every login
    refreshToken: hashedRefreshToken,
    ipAddress: req?.ip,
    userAgent: req?.get("user-agent"),
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  userSecurity.lastLoginAt = new Date();
  userSecurity.totalLogins = (userSecurity.totalLogins || 0) + 1;
  await userSecurity.save();

  const accessCookieOptions = {
    ...cookieOptionsBase,
    maxAge: 15 * 60 * 1000,
  };
  const refreshCookieOptions = {
    ...cookieOptionsBase,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  return {
    user,
    accessToken,
    refreshToken,
    accessCookieOptions,
    refreshCookieOptions,
  };
}

export async function logout(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  await Session.deleteMany({ userId: user._id });

  const userSecurity = await UserSecurity.findOne({ userId: user._id });
  if (userSecurity) {
    await userSecurity.save();
  }

  return { user, clearCookieOptions: cookieOptionsBase };
}