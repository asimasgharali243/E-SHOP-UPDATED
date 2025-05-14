import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//  Utility for Authentication Functions

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
      if (err)
        return reject(new Error(`Token generation failed: ${err.message}`));
      resolve(token);
    });
  });
};

const verifyJwt = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err)
        return reject(new Error(`Token verification failed: ${err.message}`));
      resolve(decoded);
    });
  });
};

//  Main Worker working start

export default async function ({ type, data }) {
  try {
    switch (type) {
      case "hash": {
        const hashedPassword = await hashPassword(data.password);
        return { success: true, hashedPassword };
      }

      case "hashAndToken": {
        const [hashedPassword, accessToken, refreshToken] = await Promise.all([
          hashPassword(data.password),
          generateToken(
            data.userId,
            data.JWT_Secrete_accessToken,
            data.ExpiresIn_accessToken
          ),
          generateToken(
            data.userId,
            data.JWT_Secrete_refreshToken,
            data.ExpiresIn_refreshToken
          ),
        ]);
        return { success: true, hashedPassword, accessToken, refreshToken };
      }

      case "compareAndToken": {
        const isMatch = await compareHash(data.password, data.hashedPassword);
        if (!isMatch) {
          return {
            success: false,
            error: " Incorrect password or Email provided.",
          };
        }

        const [accessToken, refreshToken] = await Promise.all([
          generateToken(
            data.userId,
            data.JWT_Secrete_accessToken,
            data.ExpiresIn_accessToken
          ),
          generateToken(
            data.userId,
            data.JWT_Secrete_refreshToken,
            data.ExpiresIn_refreshToken
          ),
        ]);

        return { success: true, accessToken, refreshToken };
      }

      case "compareOtp": {
        if(!data.resetOtpExpires){
          return { success: false, error: "OTP has expired" };
         }
        const isMatch = await compareHash(data.otp, data.otpHashed);
         
         if (!isMatch) {
          if (data.resetOtpExpires && data.resetOtpExpires < Date.now()) {
            return { success: false, error: "OTP has expired" };
          }
          return { success: false, error: "Invalid OTP" };
        }
        else{
          return { success: true };
        }
      }

      case "verifyToken": {
        const decoded = await verifyJwt(data.token, data.JWT_Secrete);
        return { success: true, data: decoded };
      }

      case 'generateOtpAndHash': {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        return { success: true, otp, hashedOtp };
      }
      

      default:
        return { success: false, error: `Unknown operation type: '${type}'` };
    }
  } catch (err) {
    return { success: false, error: `Worker execution failed: ${err.message}` };
  }
}
