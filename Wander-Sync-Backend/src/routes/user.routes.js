import Router from "express";
import {
  deleteAccount,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import {
  getSessions,
  revokeAllSessions,
  revokeSession,
} from "../controllers/session.controller.js";
import { accountDeletionValidators } from "../validators/auth.validators.js";
import validateRequest from "../middlewares/validateRequest.js";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
const router = Router();

router.get("/me", isLoggedIn, getProfile);

router.patch("/updateIdentity", isLoggedIn, updateProfile);
router.patch("/updateProfessional", isLoggedIn, updateProfile);
router.patch("/updateContact", isLoggedIn, updateProfile);
router.post(
  "/deleteAccount",
  isLoggedIn,
  accountDeletionValidators,
  validateRequest,
  deleteAccount,
);

// --- Session Management ---auth1.routes
router.get("/sessions", isLoggedIn, getSessions);
router.delete("/revokeAllSessions", isLoggedIn, revokeAllSessions); // changed to /sessions for cleaner REST
router.delete("/revokeSession/:id", isLoggedIn, revokeSession);

export { router as userRoutes };
