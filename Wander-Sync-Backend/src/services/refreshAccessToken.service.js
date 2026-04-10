import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Session } from "../models/session.model.js";
import { RevokedToken } from "../models/revokedTokens.model.js";
const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "User is logged Out please login again. ");
  }

  let decodedRefresh;
  try {
    decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Refresh Token is invalid");
  }
  const hashedRefreshToken=crypto.createHash("sha256").update(refreshToken).digest("hex");
  const loggedinUser = await User.findById(decodedRefresh.id);
  if (!loggedinUser) {
    throw new ApiError(401, "User not found");
  }

  const sessionDoc = await Session.findOne({
    userId: loggedinUser._id,
    refreshToken: hashedRefreshToken,
  });
  console.log("Session doc ",sessionDoc)
  if (!sessionDoc) {
    throw new ApiError(401, "No active session found. Please login again.");
  }

  // 1. Check if it's the CURRENT active token
  const isCurrentToken = sessionDoc.refreshToken === refreshToken;
  if (!isCurrentToken) {
    throw new ApiError(401, "Invalid session. Please login again.");
  }

  // 2. Check if it's in the REVOKED list (Array search)
  const isRevokedToken = await RevokedToken.findOne({
    sessionId:sessionDoc.id,
    token:hashedRefreshToken
  })
  if (!isCurrentToken && !isRevokedToken) {
    throw new ApiError(401, "Invalid session. Please login again.");
  }

  // 3. The Guard Logic
  if (!isCurrentToken && !isRevokedToken) {
    throw new ApiError(401, "Invalid session. Please login again.");
  }

  if (isRevokedToken) {
    await sessionDoc.deleteOne();
    throw new ApiError(401, "Token reuse detected. All sessions revoked.");
  } 

  // Generate and set new access token
  const newAccessToken = loggedinUser.generateaccessToken();
  const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1 * 60 * 60 * 1000,
  };
  res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

  // Generate and set new refresh token
  const { newRefreshToken, newhashedRefreshToken } =
    userSecurity.generateRefreshToken(loggedinUser._id);
  const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };
  res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

  // Rotate refresh token in session
  sessionDoc.refreshToken = newhashedRefreshToken;
  await sessionDoc.save();

  return jwt.decode(newAccessToken);
};

export  {refreshAccessToken}