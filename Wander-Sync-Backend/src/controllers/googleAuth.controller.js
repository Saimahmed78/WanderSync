import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../services/password.service.js";
import { generateToken } from "../services/token.service.js";
// Import Your Existing Services
import { recordActivity } from "../services/activity.service.js";
import { collectTelemetry } from "../utils/collectTelemetry.js"; // Adjust path as needed
import { getOrCreateDeviceId } from "../utils/getDeviceId.js";

// Helper to Generate Random Passwords for Google Users
const generateRandomPassword = () => {
  return uuidv4() + "-" + uuidv4();
};

const googleLogin = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  res.redirect(`${rootUrl}?${qs.toString()}`);
};

const googleCallback = async (req, res) => {
  const code = req.query.code;

  try {
    /* ---------------- STEP 1 & 2: TOKEN & PROFILE ---------------- */

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    try {
      const tokenParams = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      });

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenParams,
        signal: controller.signal,
      });

      if (!tokenResponse.ok) {
        throw new Error("Google token exchange failed");
      }

      const { access_token, refresh_token } = await tokenResponse.json();
    } finally {
      clearTimeout(timeout);
    }

    const profileController = new AbortController();
    const profileTimeout = setTimeout(() => profileController.abort(), 45_000);

    try {
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
          signal: profileController.signal,
        },
      );

      const profile = await userResponse.json();
    } finally {
      clearTimeout(profileTimeout);
    }

    console.log("Fetched Google user profile:", profile);
    /* ---------------- STEP 3: USER ---------------- */
    // FIX 2: Correct relation name to 'security' (singular)
    let user = await prisma.User.findUnique({
      where: { email: profile.email },
      include: { security: true },
    });
    console.log("Existing user lookup result:", user);

    let isNewUser = false;

    if (!user) {
      console.log("User Not found");
      isNewUser = true;
      user = await prisma.User.create({
        data: {
          email: profile.email,
          password: await hashPassword(generateRandomPassword()),
          name: profile.name,
          avatarUrl: profile.picture,
          username: `user_${uuidv4().slice(0, 8)}`,

          security: {
            create: {
              emailVerified: true, // Trusted Google Email
              totalLogins: 1,
              lastLoginAt: new Date(),
            },
          },
        },
      });
    } else {
      // Handle deactivated accounts
      await prisma.User.update({
        where: { id: user.id },
        data: {
          name: profile.name,
          avatarUrl: profile.picture,
          accountStatus: "ACTIVE",
          security: {
            update: {
              where: { userId: user.id },
              data: {
                totalLogins: { increment: 1 },
                lastLoginAt: new Date(),
              },
            },
          },
        },
      });
    }
    console.log("Authenticated Google user:", user.email);
    /* ---------------- STEP 4: OAUTH ---------------- */
    // ... (This part was fine) ...
    const oAuthProvider = await prisma.OAuthProvider.upsert({
      where: {
        providerName_providerUserId: {
          providerName: "GOOGLE",
          providerUserId: profile.id,
        },
      },
      update: {
        providerUserId: profile.id,
        accessToken: access_token,
        refreshToken: refresh_token,
      },
      create: {
        providerName: "GOOGLE",
        providerUserId: profile.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        userId: user.id,
      },
    });

    /* ---------------- STEP 5: SESSION & TOKENS ---------------- */
    // FIX 3: Get Device ID *before* using it
    const deviceId = getOrCreateDeviceId(req);
    const t = collectTelemetry(req);

    // FIX 4: Use standardized token service
    const accessToken = generateToken("access", user);
    const { refreshToken: refreshTokenJWT, hashedRefreshToken } = generateToken(
      "refresh",
      user,
    );

    const session = await prisma.Session.create({
      data: {
        userId: user.id,
        deviceId: deviceId,
        refreshToken: hashedRefreshToken, // Store HASH, not raw token
        browserName: t.browser_name,
        osName: t.os_name,
        deviceType: t.device_type.toUpperCase(),
        ipAddress: t.ip_address,
        userAgent: t.user_agent,
        location: t.location,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      },
    });
    console.log("Created session for Google user:", session.id);
    console.log("Created session for Google user:", session);

    // FIX 5: Single Activity Log Call
    await recordActivity({
      req,
      user,
      event: "LOGIN",
      deviceId,
      metadata: { auth_method: "google", is_new_user: isNewUser },
    });

    /* ---------------- STEP 6: COOKIES ---------------- */
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokenJWT, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
};

export { googleLogin, googleCallback };
