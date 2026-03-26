import crypto from "crypto";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UserSecurity } from "../models/userSecurity.model.js";

const isProd = process.env.NODE_ENV === "production";
const clearCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
};

export async function forgotPassword(email) {
  const user = await User.findOne({ email });
  console.log("Looking for user with email:", email, "Found:", user); // Debug log
   if (!user)
    throw new ApiError(404, "User not found", ["Please register your account"]);
  const userSecurityDoc = await UserSecurity.findOne({ userId: user._id });
  if (!userSecurityDoc)
    throw new ApiError(404, "User Security not found", ["Please register your account"]);
  
  console.log("User found for forgot password:", user);
 

  const token = userSecurityDoc.generateToken("forgot");
  await userSecurityDoc.save();
  console.log("Generate User Security Document", userSecurityDoc);
  const resetURL = `${process.env.CLIENT_URL}/resetPass/${token}`;
  return { name: user.name, email: user.email, resetURL };
}

export async function resetPassword({ token, newPassword }) {
  console.log("Resetting password with token:", token);
  if (!token) throw new ApiError(404, "Token not found");

  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  console.log("Hashed token for lookup:", hashed);
  const user = await UserSecurity.findOne({
    hashedForgotPasswordToken: hashed,
  });

  if (user) {
    console.log("Token Match Found. Checking Expiry...");
    console.log("Stored Expiry:", user.hashedForgotPasswordTokenExpiry);
    console.log("Current Time:", new Date());

    if (user.hashedForgotPasswordTokenExpiry < new Date()) {
      console.log("FAILED: Token is actually expired.");
    }
  }

  console.log("User found for password reset:", user);
  if (!user) throw new ApiError(404, "Reset link is expired or invalid");

  user.hashedForgotPasswordToken = null;
  user.hashedForgotPasswordTokenExpiry = null;
  user.hashedPassword = newPassword;
  await user.save();
  const userDoc = await User.findById(user.userId);
  // Make payload available for email service
  return { email: userDoc.email, name: userDoc.name };
}

export async function changePassword({ userId, oldPass, newPass }) {
  const userSecurityDoc = await UserSecurity.findById(userId);
  if (!userSecurityDoc) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(oldPass, userSecurityDoc.hashedPassword);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect");

  if (oldPass === newPass) {
    throw new ApiError(400, "New password must be different from old password");
  }

  userSecurityDoc.hashedPassword = newPass;
  userSecurityDoc.refreshToken = null; // force re-login
  await userSecurityDoc.save();
  const userDoc = await User.findById(userSecurityDoc.userId);
  return { email: userDoc.email, name: userDoc.name, clearCookieOptions };
}

export async function hashPassword(password, user) {
  const hashed_password = await bcrypt.hash(password, 10);
  return hashed_password;
}

export async function isPasswordCorrect(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
