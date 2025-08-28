import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (plainText) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
};

const compareHash = async (plainText, hashedText) => {
  return await bcrypt.compare(plainText, hashedText);
};

const generateToken = (userId, secret, expiresIn) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, secret, { expiresIn }, (err, token) => {
      if (err) reject(new Error(`Token generation failed: ${err.message}`));
      resolve(token);
    });
  });
};

const verifyJwt = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject(new Error("TokenExpiredError: Token expired"));
        } else {
          reject(new Error("JsonWebTokenError: Invalid token"));
        }
      } else {
        resolve(decoded);
      }
    });
  });
};

export default async function (input) {
  try {
    // Validate input structure
    if (!input || typeof input !== "object" || !input.type) {
      return { success: false, error: "Invalid worker input format" };
    }

    const { type, data } = input;

    // Validate data exists for operations that need it
    if (type !== "hash" && (!data || typeof data !== "object")) {
      return { success: false, error: "Missing or invalid data parameter" };
    }

    switch (type) {
      case "hash":
        if (!data.password) {
          return { success: false, error: "Password is required" };
        }
        return {
          success: true,
          hashedPassword: await hashPassword(data.password),
        };

      case "hashAndToken": {
        if (!data.password || !data.userId) {
          return { success: false, error: "Missing required fields" };
        }
        const [hashedPassword, accessToken, refreshToken] = await Promise.all([
          hashPassword(data.password),
          generateToken(
            data.userId,
            data.JWT_Secret_accessToken,
            data.ExpiresIn_accessToken
          ),
          generateToken(
            data.userId,
            data.JWT_Secret_refreshToken,
            data.ExpiresIn_refreshToken
          ),
        ]);
        return { success: true, hashedPassword, accessToken, refreshToken };
      }

      case "compareAndToken": {
        if (!data.password || !data.hashedPassword || !data.userId) {
          return { success: false, error: "Missing required fields" };
        }
        const isMatch = await compareHash(data.password, data.hashedPassword);
        if (!isMatch) return { success: false, error: "Incorrect credentials" };

        const [accessToken, refreshToken] = await Promise.all([
          generateToken(
            data.userId,
            data.JWT_Secret_accessToken,
            data.ExpiresIn_accessToken
          ),
          generateToken(
            data.userId,
            data.JWT_Secret_refreshToken,
            data.ExpiresIn_refreshToken
          ),
        ]);
        return { success: true, accessToken, refreshToken };
      }

      case "verifyToken": {
        if (!data.token || !data.JWT_Secret) {
          console.log("Token is require",data.token," Secret key is required",data.JWT_Secret)
          return { success: false, error: "Token and secret are required" };
        }
        const decoded = await verifyJwt(data.token, data.JWT_Secret);
        return { success: true, data: decoded };
      }

      case "generateOtpAndHash": {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        return { success: true, otp, hashedOtp };
      }

      case "generateToken": {
        if ((!data.userId && !data?.payload?.email) || !data.secret || !data.expiresIn) {
          return { success: false, error: "Missing required fields" };
        }
        const token = await generateToken(
          data?.userId || data?.payload?.email,
          data.secret,
          data.expiresIn
        );
        return { success: true, token };
      }

      case "generateTokenPair": {
        if (
          !data.userId ||
          !data.JWT_Secret_accessToken ||
          !data.JWT_Secret_refreshToken
        ) {
          return { success: false, error: "Missing required fields" };
        }
        const [accessToken, refreshToken] = await Promise.all([
          generateToken(
            data.userId,
            data.JWT_Secret_accessToken,
            data.ExpiresIn_accessToken
          ),
          generateToken(
            data.userId,
            data.JWT_Secret_refreshToken,
            data.ExpiresIn_refreshToken
          ),
        ]);
        return { success: true, accessToken, refreshToken };
      }
      case "compareOtp": {
        if (!data.otp || !data.otpHashed || !data.resetOtpExpires) {
          return {
            success: false,
            error: "OTP, hashed OTP, and expiry are required",
          };
        }

        // Check if OTP expired
        if (Date.now() > data.resetOtpExpires) {
          return { success: false, error: "OTP expired" };
        }

        // Compare OTP with hashedOtp
        const isMatch = await bcrypt.compare(data.otp, data.otpHashed);
        if (!isMatch) {
          return { success: false, error: "Invalid OTP" };
        }

        return { success: true, message: "OTP verified successfully" };
      }

      default:
        return { success: false, error: `Unknown operation type: '${type}'` };
    }
  } catch (err) {
    console.error("Worker Error:", err);
    return { success: false, error: `Worker execution failed: ${err.message}` };
  }
}
