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

export async function deleteUser({ userId, password }) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(400, "Password is incorrect");

  await User.findByIdAndDelete(userId);
  return { email: user.email, name: user.name, clearCookieOptions };
}

export async function getUserById(userId) {
  const user = await User.findById({_id: userId}).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

export async function updateProfile({ userId, payload }) {
  // 1. Combine all allowed fields from all three UI sections
  const allowed = [
    "name", "avatar", "bio", "username",          // Identity
    "jobTitle", "skills",              // Professional
    "phoneNumber", "timezone", "theme" // Preferences
  ];

  // 2. Filter the payload so users can't inject random data (like "role: admin")
  const update = Object.fromEntries(
    Object.entries(payload).filter(([k]) => allowed.includes(k))
  );
  const userDoc = await User.findById(userId);
  if (!userDoc) throw new ApiError(404, "User not found");
  // 3. Update only the fields provided in the specific request
  const user = await User.findByIdAndUpdate(
    userDoc._id, 
    { $set: update }, // Use $set to only update the fields sent
    { new: true, runValidators: true }
  );

  
  return user;
}
