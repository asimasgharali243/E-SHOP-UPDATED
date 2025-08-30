import asyncHandler from "../middlewares/AsyncHandler.js";
import { AppError } from "./errorHandler.js";
import AuthWorkerPool from "../controllers/workers/createWorkerPools.js";

export const AuthUser = asyncHandler(async (req, res, next) => {
  // Extract tokens from cookies
  let accessToken = req.cookies.myAccessToken;
  let refreshToken = req.cookies.myRefreshToken;

  // Override accessToken if present in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    accessToken = authHeader.substring(7);
  }

  console.log("Auth Middleware Tokens:", { accessToken: !!accessToken, refreshToken: !!refreshToken });

  // No tokens at all
  if (!accessToken && !refreshToken) {
    throw new AppError("Access denied. No tokens provided", 401);
  }

  // Verify access token first
  if (accessToken) {
    try {
      const decoded = await AuthWorkerPool.run({
        type: "verifyToken",
        data: { token: accessToken, JWT_Secret: process.env.JWT_SECRET_CUSTOMER }
      });

      if (decoded.success) {
        req.userId = decoded.data.userId;
        console.log("User authenticated via access token:", req.userId);
        return next();
      }
    } catch (err) {
      if (!err.message.includes("TokenExpiredError")) {
        console.log("Invalid access token:", err.message);
        throw new AppError("Invalid access token", 403);
      }
      console.log("Access token expired, checking refresh token...");
    }
  }

  // Access token missing or expired, check refresh token
  if (refreshToken) {
    try {
      const decodedRefresh = await AuthWorkerPool.run({
        type: "verifyToken",
        data: { token: refreshToken, JWT_Secret: process.env.JWT_REFRESH_SECRET_CUSTOMER }
      });

      if (!decodedRefresh.success) throw new AppError("Invalid refresh token", 403);

      // Generate new access token
      const newAccessTokenResult = await AuthWorkerPool.run({
        type: "generateToken",
        data: {
          userId: decodedRefresh.data.userId,
          secret: process.env.JWT_SECRET_CUSTOMER,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION
        }
      });

      if (!newAccessTokenResult.success) throw new AppError("Token generation failed", 500);

      // Set new access token in cookie and header
      res.cookie("myAccessToken", newAccessTokenResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRE)
      });
      res.setHeader("x-access-token", newAccessTokenResult.token);
      res.setHeader("Authorization", `Bearer ${newAccessTokenResult.token}`);

      req.userId = decodedRefresh.data.userId;
      console.log("New access token generated for user:", req.userId);
      return next();
    } catch (err) {
      if (err.message.includes("TokenExpiredError")) {
        throw new AppError("Session expired. Please login again", 403);
      }
      console.log("Refresh token error:", err.message);
      throw new AppError("Invalid refresh token", 403);
    }
  }

  throw new AppError("Authentication failed", 403);
});

// Optional: Header-only access token middleware
export const AuthUserHeaderOnly = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Access denied. No token provided in header", 401);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = await AuthWorkerPool.run({
      type: "verifyToken",
      data: { token, JWT_Secret: process.env.JWT_SECRET_CUSTOMER }
    });

    if (decoded.success) {
      req.userId = decoded.data.userId;
      console.log("User authenticated via header token:", req.userId);
      return next();
    } else {
      throw new AppError("Invalid token", 403);
    }
  } catch (err) {
    if (err.message.includes("TokenExpiredError")) {
      throw new AppError("Token expired", 403);
    }
    throw new AppError("Invalid token", 403);
  }
});
