import { generateToken, verifyToken } from "../utils/JWT.js";
import AuthWorkerPool from "../controllers/workers/createWorkerPools.js";
export const AuthUser = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // No Access or Refresh Token 
  if (!accessToken && !refreshToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No tokens provided." });
  }

  try {

    //  If Access Token Exists 
    if (accessToken) {
      const decodedAccess =await AuthWorkerPool.run("verifyToken", {
        token: accessToken,
        JWT_Secrete: process.env.JWT_SECRET_Customer,
      });

      if (!decodedAccess) {
        return res
          .status(403)
          .json({ message: "Invalid or expired access token." });
      }

      req.user = decodedAccess;
      return next();
    }

    // === Else: Try Refresh Token ===
    const decodedRefresh =await AuthWorkerPool.run("verifyToken", {
      token: refreshToken,
      JWT_Secrete: process.env.expires_customer_Refresh_token,
    });

    if (!decodedRefresh.success) {
      return res
        .status(403)
        .json({
          message: "Invalid or expired refresh token." || decodedRefresh.error,
        });
    }
    const newAccessToken =await AuthWorkerPool.run('generateToken', {
      userId: decodedRefresh.userId,
      JWT_Secrete_accessToken: process.env.JWT_SECRET_Customer,
      ExpiresIn_accessToken: process.env.expires_customer_token,
    });

    
    if (!newAccessToken.success) {
      return res
        .status(500)
        .json({ message: "Token generation failed." || newAccessToken.error });
    }

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.expires_customer_token),
      secure: process.env.NODE_ENV === "production",
    });
    
    req.user = decodedRefresh;
    return next();
  } catch (error) {
    console.error("Auth error:", error);
    return res
      .status(500)
      .json({ message: "Authentication failed." || error.message });
  }
};
