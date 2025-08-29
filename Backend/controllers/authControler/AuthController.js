import User from "../../models/UserModel.js";
import asyncHandler from "../../middlewares/AsyncHandler.js"; // Assuming this is your error handling utility
import { AppError } from "../../middlewares/errorHandler.js"; // Assuming this is your custom error class
import AuthWorkerPool from "../workers/createWorkerPools.js"; // Your worker pool for auth tasks
import sendResponse from "../../utils/sendResponse.js"; // Your utility for sending responses
import { Mailer } from "../../utils/Mailer.js"; // The nodemailer transporter

export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;
console.log(firstName,lastName,userName,email,password);
  // Validation
  if (!firstName || !lastName || !userName || !email || !password) {
    throw new AppError("All fields are required", 400);
  }
  console.log("all field avaiable");
  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existingUser) {
    console.log("user exist", existingUser);
    if (!existingUser.isVerified) {
      // Generate a verification token for the email link
      const verificationTokenResult = await AuthWorkerPool.run({
        type: "generateToken",
        data: {
          payload: { email },
          secret: process.env.EMAIL_VERIFICATION_SECRET,
          expiresIn: "24h",
        },
      });

      console.log("verification token generated");
      if (!verificationTokenResult.success) {
        console.log("verification token generation failed");
        throw new AppError(
          verificationTokenResult.error ||
            "Verification token generation failed",
          500
        );
      }
      const verificationLink = `${process.env.EMAIL_VERIFICATION_URL}/verify-email?token=${verificationTokenResult.token}`;

      // Send the verification email
      await Mailer.sendMail({
        from: `E-Shop" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "Please Verify Your Email Address",
        html: `
      <h2>Hello ${firstName},</h2>
      <p>Thank you for registering. Please click the link below to verify your email address and complete your registration:</p>
      <a href="${verificationLink}">Verify My Email</a>
      <br>
      <p>The link will expire at ${
        new Date().getTime() + 24 * 60 * 60 * 1000
      } .</p>
    `,
      });

      throw new AppError(
        "Email not verified. Please check your email for the verification link.",
        400
      );
    }
    throw new AppError(
      existingUser.email === email
        ? "Email already in use"
        : "Username already taken",
      409
    );
  }
  console.log("user not exist");
  // Hash password
  const hashedPasswordResult = await AuthWorkerPool.run({
    type: "hash",
    data: { password },
  });
  console.log("password hashed");

  if (!hashedPasswordResult.success) {
    throw new AppError(
      hashedPasswordResult.error || "Password hashing failed",
      500
    );
  }
  console.log("password hashed success");
  // Generate a verification token for the email link
  const verificationTokenResult = await AuthWorkerPool.run({
    type: "generateToken",
    data: {
      payload: { email },
      secret: process.env.EMAIL_VERIFICATION_SECRET,
      expiresIn: "24h",
    },
  });

  console.log("verification token generated");
  if (!verificationTokenResult.success) {
    console.log("verification token generation failed");
    throw new AppError(
      verificationTokenResult.error || "Verification token generation failed",
      500
    );
  }
  console.log(firstName, lastName, userName, email, password);
  // Create user with isVerified set to false
  const user = new User({
    firstName,
    lastName,
    userName,
    email,
    password: hashedPasswordResult.hashedPassword,
    isVerified: false,
  });
  console.log("user created");
  await user.save();

  // Create the verification link
  const verificationLink = `${process.env.EMAIL_VERIFICATION_URL}/verify-email?token=${verificationTokenResult.token}`;

  // Send the verification email
  await Mailer.sendMail({
    from: `E-Shop" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Please Verify Your Email Address",
    html: `
      <h2>Hello ${firstName},</h2>
      <p>Thank you for registering. Please click the link below to verify your email address and complete your registration:</p>
      <a href="${verificationLink}">Verify My Email</a>
      <br>
      <p>The link will expire at ${
        new Date().getTime() + 24 * 60 * 60 * 1000
      } .</p>
    `,
  });

  return sendResponse(
    res,
    201,
    "Registration successful. Please check your email for a verification link.",
    {
      user: { userId: user._id.toString(),userName:user.userName },
    }
  );
});
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
console.log(email, password);
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }
console.log(user);
  const tokenResult = await AuthWorkerPool.run({
    type: "compareAndToken",
    data: {
      password,
      hashedPassword: user.password,
      userId: user._id.toString(),
      JWT_Secret_accessToken: process.env.JWT_SECRET_CUSTOMER,
      JWT_Secret_refreshToken: process.env.JWT_REFRESH_SECRET_CUSTOMER,
      ExpiresIn_accessToken: process.env.JWT_ACCESS_EXPIRATION,
      ExpiresIn_refreshToken: process.env.JWT_REFRESH_EXPIRATION,
    },
  });
console.log(tokenResult);
  if (!tokenResult.success) {
    throw new AppError(tokenResult.error || "Invalid credentials", 401);
  }

  // Set cookies
  res.cookie("myAccessToken", tokenResult.accessToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRE),
  });

  res.cookie("myRefreshToken", tokenResult.refreshToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRE),
  });

  return sendResponse(res, 200, "Login successful", {
    userId: user._id.toString(),userName:user.userName,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("myAccessToken");
  res.clearCookie("myRefreshToken");
  return sendResponse(res, 200, "Logout successful");
});

// In a new file, for example, `verifyUserController.js`
export const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.query;
  console.log("token received:", token);
  // Validate the token
  const decodedTokenResult = await AuthWorkerPool.run({
    type: "verifyToken",
    data: {
      token,
      JWT_Secret: process.env.EMAIL_VERIFICATION_SECRET,
    },
  });

  if (!decodedTokenResult.success) {
    throw new AppError(
      `Invalid or expired verification link.${decodedTokenResult.error}`,
      400
    );
  }
  console.log("token verified:", decodedTokenResult);
  const user = await User.findOne({ email: decodedTokenResult.data.userId });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // Check if the user is already verified
  if (user.isVerified) {
    return sendResponse(
      res,
      200,
      "Email already verified. You can now log in.",
      {}
    );
  }

  // Update user as verified
  user.isVerified = true;
  await user.save();

  // Now, generate and set the final JWT tokens
  const tokenResult = await AuthWorkerPool.run({
    type: "generateTokenPair",
    data: {
      userId: user._id.toString(),
      JWT_Secret_accessToken: process.env.JWT_SECRET_CUSTOMER,
      JWT_Secret_refreshToken: process.env.JWT_REFRESH_SECRET_CUSTOMER,
      ExpiresIn_accessToken: process.env.JWT_ACCESS_EXPIRATION,
      ExpiresIn_refreshToken: process.env.JWT_REFRESH_EXPIRATION,
    },
  });

  if (!tokenResult.success) {
    throw new AppError(tokenResult.error || "Token generation failed", 500);
  }

  // Set cookies
  res.cookie("myAccessToken", tokenResult.accessToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRE),
  });

  res.cookie("myRefreshToken", tokenResult.refreshToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    httpOnly: true,
    maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRE),
  });

  return sendResponse(
    res,
    200,
    "Email verification successful! Registration is now complete.",
    {
      user: { userId: user._id.toString() },
    }
  );
});
