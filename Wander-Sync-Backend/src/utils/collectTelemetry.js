// middleware/collectTelemetry.js
import requestIp from "request-ip";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

/**
 * Collects detailed client information from the request object.
 * Extracts IP, Geolocation, User-Agent data, and Device specs.
 */
export function collectTelemetry(req) {
  // --- 1. IP DETECTION ---
  // Detects the client's IP address. request-ip handles most headers automatically.
  const ip =
    requestIp.getClientIp(req) ||
    req.ip ||
    req.connection?.remoteAddress ||
    null;

  // --- 2. PROXY & X-FORWARDED-FOR HANDLING ---
  // If the app is behind a proxy (like Nginx, Heroku, or Cloudflare), 
  // the real IP is usually the first address in the 'x-forwarded-for' list.
  const rawXff = req.headers["x-forwarded-for"];
  let xff;
  if (rawXff) {
    xff = String(rawXff).split(",").map((s) => s.trim())[0];
  }
  const clientIp = xff && xff !== "unknown" ? xff : ip;

  // --- 3. USER-AGENT (UA) PARSING ---
  // Uses ua-parser-js to turn the messy 'user-agent' string into an object.
  const uaRaw = req.headers["user-agent"] || "";
  const parser = new UAParser(uaRaw);
  const ua = parser.getResult();
  
  // --- 4. GEOLOCATION & LOCALHOST HANDLING ---
  // Check if the IP is a local loopback (v4 or v6).
  const isLocalhost = clientIp === '::1' || clientIp === '127.0.0.1' || clientIp === '::ffff:127.0.0.1';
  console.log("Is Local Host", isLocalhost)
  // geoip.lookup returns null for local IPs as they aren't on the public internet.
  const geo = geoip.lookup(clientIp);
  console.log("Geo Location Info",geo)
  let locationString;
  if (isLocalhost) {
    locationString = "LocalHost (Development)";
  } else if (geo) {
    // Format a readable string: "City, Country"
    locationString = `${geo.city || "Unknown City"}, ${geo.country}`;
  } else {
    locationString = "Unknown Location";
  }
  console.log("Location String",locationString)
  // Detailed location object (for internal use)
  const locationDetails = geo ? {
    country: geo.country,
    region: geo.region,
    city: geo.city,
    lat: geo.ll?.[0],
    lon: geo.ll?.[1],
    provider: "geoip-lite",
  } : null;
  console.log("Location Details",locationDetails)
  // --- 5. LANGUAGE DETECTION ---
  // Grabs the preferred browser language (e.g., 'en-US').
  const language = req.headers["accept-language"]?.split(",")?.[0] || null;

  // --- 6. DEVICE TYPE NORMALIZATION ---
  // If the parser finds no device type, it's almost certainly a desktop.
  // We force uppercase to match your Mongoose enum.
  const rawDeviceType = ua.device?.type ? ua.device.type.toUpperCase() : "DESKTOP";

  // --- 7. FINAL TELEMETRY OBJECT ---
  const telemeteryObject = {
    // The "truth" for debugging
    uaRaw: uaRaw,
    
    // IP Information
    ipAddress: clientIp,
    ipVersion: clientIp && clientIp.includes(":") ? "v6" : "v4",
    
    // User Friendly Strings (Perfect for your Mongoose Session Model)
    browserName: ua.browser?.name || "Unknown Browser",
    osName: ua.os?.name || "Unknown OS",
    deviceType: rawDeviceType,
    deviceModel: ua.device?.model || (isLocalhost ? "Development Machine" : "Generic Device"),
    location: locationString, // <--- This is the string you need!
    
    // Nested Data for deep analytics
    uaDetails: {
      browser: ua.browser,
      os: ua.os,
      device: {
        ...ua.device,
        type: rawDeviceType // Ensure the normalized type is used
      }
    },
    
    isMobile: rawDeviceType === "MOBILE",
    language,
    geoDetails: locationDetails,
    
    // Screen dimensions (requires frontend cooperation)
    screen: {
      width: req.body?.screenWidth || req.headers["x-screen-width"],
      height: req.body?.screenHeight || req.headers["x-screen-height"],
    }
  };
  
  return telemeteryObject;
}