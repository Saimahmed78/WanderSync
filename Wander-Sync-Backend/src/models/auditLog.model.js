import mongoose from "mongoose";

const { Schema } = mongoose;

const auditLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
    },
    status: { type: String, enum: ["SUCCESS", "FAILURE"], default: "SUCCESS" },

    // References
    userId: { type: String, ref: "User"},
    actorId: { type: String, required: true },
    actorType: {
      type: String,
      enum: ["USER", "SYSTEM", "ADMIN"],
      default: "USER",
    },

    // Context
    ipAddress: String,
    location: String,
    userAgent: String,

    // Flexible storage for different event types
    deviceInfo: { type: mongoose.Schema.Types.Mixed },
    metadata: { type: mongoose.Schema.Types.Mixed },

    // Automatic cleanup after 90 days (7776000 seconds)
    // This keeps DB lean and costs low
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 7776000 },
    },
  },
  {
    timestamps: true,
  },
);

// Index for "Recent Activity" queries

// Fast user-based queries
auditLogSchema.index({ userId: 1 });
// Event type queries
auditLogSchema.index({ eventType: 1 });
// Recent logs first
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export { AuditLog };
