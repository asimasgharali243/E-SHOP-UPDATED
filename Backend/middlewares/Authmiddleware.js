import asyncHandler from "../middlewares/AsyncHandler.js";
import { AppError } from "./errorHandler.js";
import AuthWorkerPool from "../controllers/workers/createWorkerPools.js";

export const AuthUser = asyncHandler(async (req, res, next) => {
  const { myAccessToken, myRefreshToken } = req.cookies;
  // console.log("Auth Middleware: Tokens from cookies", { myAccessToken, myRefreshToken });
  // Check if tokens exist
  if (!myAccessToken && !myRefreshToken) {
    throw new AppError('Access denied. No tokens provided', 401);
  }

  // Verify access token first
  if (myAccessToken) {
    try {
      const decodedAccess = await AuthWorkerPool.run({
        type: "verifyToken",
        data: {
          token: myAccessToken,
          JWT_Secret: process.env.JWT_SECRET_CUSTOMER,
        }
      });

      if (decodedAccess.success) {
        req.userId = decodedAccess.data.userId;
        return next();
      }
    } catch (err) {
      // Only proceed to refresh token if access token is expired
      if (err.message.includes("TokenExpiredError")) {
        console.log("Access token expired");
      } else {
        // For any other error with access token
        throw new AppError('Invalid access token', 403);
      }
    }
  }

  // If access token is missing or expired, try refresh token
  if (myRefreshToken) {
    try {
      const decodedRefresh = await AuthWorkerPool.run({
        type: "verifyToken", 
        data: {
          token: myRefreshToken,
          JWT_Secret: process.env.JWT_REFRESH_SECRET_CUSTOMER,
        }
      });

      if (!decodedRefresh.success) {
        throw new AppError('Invalid refresh token', 403);
      }

      // Generate new access token
      const newAccessTokenResult = await AuthWorkerPool.run({
        type: "generateToken",
        data: {
          userId: decodedRefresh.data.userId,
          secret: process.env.JWT_SECRET_CUSTOMER,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        }
      });

      if (!newAccessTokenResult.success) {
        throw new AppError('Token generation failed', 500);
      }

      // Set the new access token in cookies
      res.cookie("myAccessToken", newAccessTokenResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRE),
      });
      console.log("New access token generated and set in cookies", decodedRefresh.data.userId);
      req.userId = decodedRefresh.data.userId;
      return next();
    } catch (err) {
      if (err.message.includes("TokenExpiredError")) {
        throw new AppError('Session expired. Please login again', 403);
      }
      throw new AppError('Invalid refresh token', 403);
    }
  }

  // If we get here, authentication failed
  throw new AppError('Authentication failed', 403);
});