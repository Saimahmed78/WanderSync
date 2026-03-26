import { Router } from "express";
import {
  forgotPassValidators,
  resendVerifcationEmailValidators,
  changePassValidators,
  resetPassValidators,
  userloginValidators,
  userRegistrationValidators,
} from "../validators/auth.validators.js";

import validateRequest from "../middlewares/validateRequest.js";
import {
  loginUser,
  logoutUser,
  resendVerification,
  registerUser,
  verifyAccount,
} from "../controllers/auth.controller.js";
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/password.controller.js";
import {
  googleLogin,
  googleCallback,
} from "../controllers/googleAuth.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = Router();

// --- Standard Auth ---
router.post(
  "/register",
  userRegistrationValidators(),
  validateRequest,
  registerUser,
);
router.post("/login", userloginValidators(), validateRequest, loginUser);
router.get("/logout", isLoggedIn, logoutUser);

// --- Google Auth (Moved here) ---
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// --- Verification & Passwords ---
router.get("/verify/:token", verifyAccount);
router.post(
  "/resendVerification",
  resendVerifcationEmailValidators(),
  validateRequest,
  resendVerification,
);
router.post(
  "/forgotPass",
  forgotPassValidators(),
  validateRequest,
  forgotPassword,
);
router.post(
  "/resetPass/:token",
  resetPassValidators(),
  validateRequest,
  resetPassword,
);
router.post(
  "/changePass",
  isLoggedIn,
  changePassValidators(),
  validateRequest,
  changePassword,
);
export { router as authRoutes };
