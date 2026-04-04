import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Session } from "../models/session.model.js";
const isLoggedIn = async (req, res, next) => {  //    check if cookies has accessToken
  const accessToken = req.cookies?.accessToken;  // if yes then return next
  if (accessToken) {    try {
      const decodedData = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );
      req.user = decodedData;
    } catch (err) {
      throw new ApiError(401, "Token is invalid", err);
    }
    return next();
  }

  // if not call refresh access Token m
  const refreshToken = req.cookies?.refreshToken;  if (!refreshToken) {
    throw new ApiError(401, "User is logged Out please login again. ");
  }

  let decodedRefresh;
  try {
    decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Refresh Token is invalid");
  }

  const loggedinUser = await User.findById(decodedRefresh.id);
  if (!loggedinUser) {
    throw new ApiError(401, "User not found");
  }
  const sessionDoc = await Session.findOne({
    userId: loggedinUser._id,
    refreshToken: crypto.createHash("sha256").update(refreshToken).digest("hex"),
  });  if (!sessionDoc) {
    throw new ApiError(401, "No active session found. Please login again.");
  }
  // 1. Check if it's the CURRENT active token
  const isCurrentToken = sessionDoc.refreshToken === refreshToken;
  if (!isCurrentToken ) {
    throw new ApiError(401, "Invalid session. Please login again.");
  }  // 2. Check if it's in the REVOKED list (Array search)
  const isRevokedToken = sessionDoc.revokedTokens.some(
    (entry) => entry.token === refreshToken,
  );
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
  const newAccessToken = loggedinUser.generateaccessToken();
  const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1 * 60 * 60 * 1000,
  };
  res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);
  const { newRefreshToken, newhashedRefreshToken } =
    userSecurity.generateRefreshToken(loggedinUser._id);
  const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };
  res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);
  sessionDoc.refreshToken = newhashedRefreshToken;
  await sessionDoc.save();

  req.user = jwt.decode(newAccessToken);

  next();
};

export { isLoggedIn };
