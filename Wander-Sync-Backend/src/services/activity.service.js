
import { AuditLog } from "../models/auditLog.model.js";
import { collectTelemetry } from "../utils/collectTelemetry.js";
import { UserDevice } from "../models/userDevices.model.js";
import { TelemetryEvent } from "../models/telemetery/telemetery.model.js";

export async function recordActivity({
  req,
  user,
  event,
  sessionId = null,
  deviceId,
  metadata = {},
}) {
  const telemetry = collectTelemetry(req);

  try {
    // 1️⃣ Audit (ALWAYS)
    await writeAudit({
      user,
      event,
      telemetry,
      deviceId,
      sessionId,
      metadata,
    });

    // 2️⃣ Device tracking (ONLY when relevant)
    const deviceEvents = [
      "REGISTRATION",
      "LOGIN",
      "VERIFICATION_SUCCESS",
      "LOGOUT",
    ];
    if (deviceEvents.includes(event)) {
      await upsertUserDevice({ user, deviceId, telemetry, event });
    }

    // 3️⃣ Telemetry (ONLY for entry points)
    if (shouldWriteTelemetry(event)) {
      await writeTelemetry({ user, sessionId, telemetry });
    }
  } catch (error) {
    console.error("Failed to record activity:", error);
  }
}

async function writeAudit({
  user,
  event,
  telemetry,
  deviceId,
  sessionId,
  metadata,
}) {
  const auditLogDoc={
    userId: user._id,
    eventType: event,
    actorId: user._id,
    ipAddress: telemetry.ip_address,
    location: telemetry.location,
    userAgent: telemetry.user_agent,
    deviceInfo: {
      deviceId,
      browser: telemetry.browser_name,
      os: telemetry.os_name,
    },
    metadata: {
      sessionId,
      ...metadata,
    },
  }
  const auditLog = await AuditLog.create(auditLogDoc);
  // console.log("Audit log created:", auditLogDoc);
}

async function upsertUserDevice({ user, deviceId, telemetry, event }) {

  if (!deviceId) return;

  const filter = { userId: user._id, deviceId };
  const update = {
    ipAddress: telemetry.ip_address,
    userAgent: telemetry.user_agent,
    location: telemetry.location,
    activity: event,
    lastUsedAt: new Date(),
  };

  const device = await UserDevice.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

}

async function writeTelemetry({ user, sessionId, telemetry }) {
  await TelemetryEvent.create({
    userId: user?._id || null,
    sessionId,
    ipAddress: telemetry.ip_address,
    userAgent: telemetry.user_agent,
    language: telemetry.language,
    referrer: telemetry.referrer,
  });
}

function shouldWriteTelemetry(event) {
  return [
    "LOGIN",
    "REGISTRATION",
    "FORGOT_PASSWORD",
    "VERIFICATION_RESEND",
  ].includes(event);
}