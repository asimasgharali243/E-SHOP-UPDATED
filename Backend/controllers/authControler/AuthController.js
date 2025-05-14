import User from '../../models/UserModel.js'
import  AuthWorkerPool  from '../workers/createWorkerPools.js';

export const registerUser = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  if (!firstName || !lastName || !userName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? 'Email already in use'
            : 'Username already taken',
      });
    }

    // Run hashing and token generation in the worker thread
    const { success, hashedPassword, accessToken, refreshToken } =
      await AuthWorkerPool.run({
        type: 'hashAndToken',
        data: {
          password,
          userId: email, // Temporarily using email until user._id is available
          JWT_Secrete_accessToken: process.env.JWT_SECRET_Customer,
          JWT_Secrete_refreshToken: process.env.refresh_token_JWT_Customer,
          ExpiresIn_accessToken: process.env.expires_customer_token,
          ExpiresIn_refreshToken: process.env.expires_customer_Refresh_token,
        }
      });

    if (!success) {
      return res.status(500).json({ message: error || 'Hashing/token error' });
    }

    // Create new user with hashed password
    const user = new User({ firstName, lastName, userName, email, password: hashedPassword });
    await user.save();

    res.cookie('token', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      httpOnly: true,
      maxAge: parseInt(process.env.expires_customer_Access_cookies),
    });

    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      httpOnly: true,
      maxAge: parseInt(process.env.expires_customer_Refresh_cookies),
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
    userId: user._id.toString(),
        },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { success, accessToken, refreshToken } =
      await AuthWorkerPool.run({
        type: 'compareAndToken',
        data: {
          password,
          hashedPassword: user.password,
          userId: user._id.toString(),
          JWT_Secrete_accessToken: process.env.JWT_SECRET_Customer,
          JWT_Secrete_refreshToken: process.env.refresh_token_JWT_Customer,
          ExpiresIn_accessToken: process.env.expires_customer_token,
          ExpiresIn_refreshToken: process.env.expires_customer_Refresh_token,
        },
      });

    if (!success) {
      return res.status(401).json({ message: error || 'Invalid email or password' });
    }

    res.cookie('accessToken', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      httpOnly: true,
      maxAge: parseInt(process.env.expires_customer_Access_cookies),
    });

    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      httpOnly: true,
      maxAge: parseInt(process.env.expires_customer_Refresh_cookies),
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user._id.toString(),
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ message: 'Server error during logout' });
  }
};