import { Session } from "../models/session.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/sessions
// Fetch currently active sessions (not expired and not revoked)
export const getSessions = asyncHandler(async (req, res) => {
  const now = new Date(); 
  // 1. Fetch ALL Active Sessions
  // Logic: expiresAt is in the future AND revokedAt does not exist (null)
  const activeSessions = await Session.find({
    userId: req.user.id, // Mongoose usually uses _id
    expiresAt: { $gt: now },
    revokedAt: { $exists: false } // In Mongoose/Mongo, "null" is often treated as field not existing
  }).sort({ lastActiveAt: -1 }); 
  // 2. Fetch RECENT Logged Out Sessions (History)
  // Logic: expired or revoked
  const pastSessions = await Session.find({
    userId: req.user._id,
    $or: [
      { expiresAt: { $lt: now } },
      { revokedAt: { $exists: true } }
    ],
  })
  .sort({ lastActiveAt: -1 })
  .limit(5); // Prevents payload bloat 
  return res.status(200).json(
    new ApiResponse(200, {
      active: activeSessions,
      history: pastSessions,
    }, "Sessions fetched successfully")
  );
});

// PATCH /api/revoke-all
// Revoke all sessions for the current user
export const revokeAllSessions = asyncHandler(async (req, res) => {
  const result = await Session.updateMany(
    { 
      userId: req.user._id,
      revokedAt: { $exists: false } // Only revoke ones not already revoked
    },
    { 
      $set: { 
        revokedAt: new Date(),
        revokedReason: "User requested logout from all devices" 
      } 
    }
  );

  
  
  return res
    .status(200)
    .json(new ApiResponse(200, null, "All sessions revoked successfully"));
});

// PATCH /api/revoke/:id
// Revoke a specific session by its UUID
export const revokeSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await Session.findOneAndUpdate(
    {
      _id: id, // Your model uses UUID strings as _id
      userId: req.user._id,
    },
    {
      $set: { revokedAt: new Date() },
    },
    { new: true }
  );

  if (!session) {
    return res.status(404).json(new ApiResponse(404, null, "Session not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Session revoked successfully"));
});