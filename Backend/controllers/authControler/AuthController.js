import User from '../../models/UserModel.js';
import AuthWorkerPool from '../workers/createWorkerPools.js';
import { AppError } from '../../middlewares/errorHandler.js';
import asyncHandler from '../../middlewares/AsyncHandler.js';
import sendResponse from '../../utils/sendResponse.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  // Validation
  if (!firstName || !lastName || !userName || !email || !password) {
    throw new AppError('All fields are required', 400);
  }

  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existingUser) {
    throw new AppError(
      existingUser.email === email ? 'Email already in use' : 'Username already taken',
      409
    );
  }

  // Hash password and generate tokens
  const { success, hashedPassword, accessToken, refreshToken, error } =
    await AuthWorkerPool.run({
      type: 'hashAndToken',
      data: {
        password,
        userId: email,
        JWT_Secret_accessToken: process.env.JWT_SECRET_CUSTOMER,
        JWT_Secret_refreshToken: process.env.JWT_REFRESH_SECRET_CUSTOMER,
        ExpiresIn_accessToken: process.env.JWT_ACCESS_EXPIRATION,
        ExpiresIn_refreshToken: process.env.JWT_REFRESH_EXPIRATION,
      },
    });

  if (!success) {
    throw new AppError(error || 'Registration failed', 500);
  }

  // Create user
  const user = new User({ 
    firstName, 
    lastName, 
    userName, 
    email, 
    password: hashedPassword 
  });
  await user.save();

  // Set cookies
  res.cookie('myAccessToken', accessToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRE),
  });

  res.cookie('myRefreshToken', refreshToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    httpOnly: true,
    maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRE),
  });

  return sendResponse(res, 201, 'Registration successful', {
    user: { userId: user._id.toString() }
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const { success, accessToken, refreshToken, error } =
    await AuthWorkerPool.run({
      type: 'compareAndToken',
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

  if (!success) {
    throw new AppError(error || 'Invalid credentials', 401);
  }

  // Set cookies
  res.cookie('myAccessToken', accessToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRE),
  });

  res.cookie('myRefreshToken', refreshToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRE),
  });

  return sendResponse(res, 200, 'Login successful', {
    user: { userId: user._id.toString() }
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('myAccessToken');
  res.clearCookie('myRefreshToken');
  return sendResponse(res, 200, 'Logout successful');
});