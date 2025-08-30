import User from '../../models/UserModel.js';
import bcrypt from 'bcrypt';
import { imagekitInstance } from '../../index.js';
// Get user profile - FIXED to handle both query param and auth token
export const getUserProfile = async (req, res) => {
  try {
    // Get userid from query parameter OR from authenticated user
    // const userid = req.query.userid || req.user?const userid = req.query.userid || req.userId;
const userid = req.query.userid || req.userId;

    console.log('User ID:', userid);
    if (!userid) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }

    const user = await User.findById(userid)
      .select('-password -resetOtp -resetOtpExpires');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update user profile - FIXED
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, phone, dob, gender, address } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // Check if username or email already exists (excluding current user)
    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
      _id: { $ne: req.userId }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: existingUser.userName === userName 
          ? 'Username already taken' 
          : 'Email already registered' 
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, userName, email, phone, dob, gender, address },
      { new: true, runValidators: true }
    ).select('-password -resetOtp -resetOtpExpires');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Change password - FIXED
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const user = await User.findById(req.userId);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Upgrade to seller account - FIXED
export const upgradeToSeller = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const user = await User.findById(req.userId);
    
    if (user.role === 'seller') {
      return res.status(400).json({ 
        success: false,
        message: 'Account is already a seller' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { role: 'seller' },
      { new: true }
    ).select('-password -resetOtp -resetOtpExpires');
    
    res.json({ 
      success: true,
      message: 'Account upgraded to seller successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// controllers/userController.js - Update the upload function
export const uploadProfileImage = async (req, res) => {
  try {
    const { image, fileName } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Upload to ImageKit
    const result = await imagekitInstance.upload({
      file: image,          // Base64 string
      fileName: `profile_${req.userId}_${Date.now()}_${fileName}`,
      folder: "/profiles",
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        profileImage: { public_id: result.fileId, url: result.url },
      },
      { new: true }
    ).select("-password -resetOtp -resetOtpExpires");

    res.json({ success: true, message: "Profile image updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

