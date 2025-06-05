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

export default async function ({ type, data }) {
  try {
    switch (type) {
      case "hash":
        return { 
          success: true, 
          hashedPassword: await hashPassword(data.password) 
        };

      case "hashAndToken": {
        const [hashedPassword, accessToken, refreshToken] = await Promise.all([
          hashPassword(data.password),
          generateToken(data.userId, data.JWT_Secret_accessToken, data.ExpiresIn_accessToken),
          generateToken(data.userId, data.JWT_Secret_refreshToken, data.ExpiresIn_refreshToken),
        ]);
        return { success: true, hashedPassword, accessToken, refreshToken };
      }

      case "compareAndToken": {
        const isMatch = await compareHash(data.password, data.hashedPassword);
        if (!isMatch) return { success: false, error: "Incorrect credentials" };
console.log(data)
        const [accessToken, refreshToken] = await Promise.all([
          generateToken(data.userId, data.JWT_Secret_accessToken, data.ExpiresIn_accessToken),
          generateToken(data.userId, data.JWT_Secret_refreshToken, data.ExpiresIn_refreshToken),
        ]);
        return { success: true, accessToken, refreshToken };
      }

      case "verifyToken": {
        console.log(data.token, "/n"+data.JWT_Secret);
        const decoded = await verifyJwt(data.token, data.JWT_Secret);
        return { success: true, data: decoded };
      }
      case 'generateOtpAndHash': {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        return { success: true, otp, hashedOtp };
      }
      
case 'generateToken': {
          const token = await generateToken(data.userId, data.secret, data.expiresIn);
          return { success: true,token };
      }
      

      default:
        return { success: false, error: `Unknown operation type: '${type}'` };
    }
  } catch (err) {
    return { success: false, error: `Worker execution failed: ${err.message}` };
  }
}
