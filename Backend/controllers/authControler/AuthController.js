import User from '../../models/UserModel.js';
import { generateToken } from '../../utils/JWT.js';
import { registerValidation, loginValidation } from '../../utils/authvalidation.js';

 // Import the generateToken utility function

export const registerUser = async (req, res) => {
  
 const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  

    // Create a new user instance
    const user = new User({firstName, lastName, userName, email, password });

    // Hash the password before saving the user
    await user.save();

    // Generate JWT token using the utility function
    const token = generateToken(user._id);

    // Respond with success message and the token
    res.cookie('token', token, {
        httpOnly: true,        // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'none', // Allow cross-origin requests
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    res.status(201).json({ message:{firstName,lastName, userName, email ,profilePic:user.profilePic} });
  } catch (error) {
    // Handle server error
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};



export const loginUser = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if the entered password matches the stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token using the utility function
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true, // Prevents access via client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'none', // Required for cross-origin requests
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    res.status(200).json({ message: {firstName:user.firstName,lastName:user.lastName, userName:user.userName, email:user.email, profilePic:user.profilePic} });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};
