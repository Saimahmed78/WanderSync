import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as UserService from "../services/user.service.js";
import * as MailService from "../services/mail/mail.service.js";

// DELETE /api/v1/user
const deleteAccount = asyncHandler(async (req, res) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");
  const { password } = req.body;
  const result = await UserService.deleteUser({
    userId: req.user.id,
    password,
  });

  res.clearCookie("AccessToken", result.clearCookieOptions);
  res.clearCookie("RefreshToken", result.clearCookieOptions);

  await MailService.sendAccountDeletionEmail({
    email: result.email,
    name: result.name,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Account deleted successfully"));
});

// (Optional) GET /api/v1/user/me
const getProfile = asyncHandler(async (req, res) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");
  const user = await UserService.getUserById(req.user.id);
  return res.status(200).json(new ApiResponse(200,user, "Profile fetched"));
});

// (Optional) PATCH /api/v1/user
const updateProfile = asyncHandler(async (req, res) => {
  console.log("Update profile controller for user ID:", req.user?.id);
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");
  const user = await UserService.updateProfile({
    userId: req.user.id,
    payload: req.body,
  });
  return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

export { deleteAccount, getProfile, updateProfile };
