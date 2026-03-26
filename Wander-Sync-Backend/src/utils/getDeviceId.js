import { v4 as uuidv4 } from "uuid";

const DEVICE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
};
function getOrCreateDeviceId(req, res) {
  let deviceId = req?.cookies?.deviceId || req.headers["x-device-id"];

  if (!deviceId) {
    deviceId = uuidv4();

    if (res) {
      res.cookie("deviceId", deviceId, DEVICE_COOKIE_OPTIONS);
    }
  }

  return deviceId;
}

export { getOrCreateDeviceId };