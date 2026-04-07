// middleware/collectTelemetry.js
import requestIp from "request-ip";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

/**
 * Collects detailed client information from the request object.
 * Now uses a hybrid of local DB and live API for maximum reliability.
 */
export async function collectTelemetry(req) {
  // --- 1. IP & PROXY DETECTION ---
  const ip = requestIp.getClientIp(req) || req.ip || "127.0.0.1";
  const rawXff = req.headers["x-forwarded-for"];
  const clientIp = rawXff ? String(rawXff).split(",")[0].trim() : ip;

  // --- 2. USER-AGENT PARSING ---
  const uaRaw = req.headers["user-agent"] || "";
  const parser = new UAParser(uaRaw);
  const ua = parser.getResult();
  
  // --- 3. GEOLOCATION LOGIC ---
  const isLocalhost = clientIp === '::1' || clientIp === '127.0.0.1' || clientIp.includes('127.0.0.1');
  
  let locationString = "Unknown Location";
  let locationDetails = null;

  if (isLocalhost) {
    locationString = "LocalHost (Development)";
  } else {
    try {
      // 🚀 STRATEGY: Try the Live API first (Most accurate for production)
      const response = await fetch(`http://ip-api.com/json/${clientIp}`);
      const data = await response.json();

      if (data.status === 'success') {
        locationString = `${data.city}, ${data.country}`;
        locationDetails = {
          country: data.country,
          region: data.regionName,
          city: data.city,
          lat: data.lat,
          lon: data.lon,
          provider: "ip-api"
        };
      } else {
        // 🛠 FALLBACK: If API fails, try local geoip-lite
        const geo = geoip.lookup(clientIp);
        if (geo) {
          locationString = `${geo.city || "Unknown City"}, ${geo.country}`;
          locationDetails = { ...geo, provider: "geoip-lite" };
        }
      }
    } catch (error) {
      console.error("Geo API fetch failed, using fallback:", error.message);
      // Secondary fallback to local DB
      const geo = geoip.lookup(clientIp);
      if (geo) {
        locationString = `${geo.city || "Unknown City"}, ${geo.country}`;
        locationDetails = { ...geo, provider: "geoip-lite" };
      }
    }
  }

  // --- 4. DEVICE NORMALIZATION ---
  const rawDeviceType = ua.device?.type ? ua.device.type.toUpperCase() : "DESKTOP";

  // --- 5. FINAL OBJECT ---
  return {
    uaRaw: uaRaw,
    ipAddress: clientIp,
    ipVersion: clientIp.includes(":") ? "v6" : "v4",
    browserName: ua.browser?.name || "Unknown Browser",
    osName: ua.os?.name || "Unknown OS",
    deviceType: rawDeviceType,
    deviceModel: ua.device?.model || (isLocalhost ? "Development Machine" : "Generic Device"),
    location: locationString, 
    isMobile: rawDeviceType === "MOBILE",
    language: req.headers["accept-language"]?.split(",")[0] || "en-US",
    geoDetails: locationDetails,
    screen: {
      width: req.body?.screenWidth || req.headers["x-screen-width"],
      height: req.body?.screenHeight || req.headers["x-screen-height"],
    }
  };
}