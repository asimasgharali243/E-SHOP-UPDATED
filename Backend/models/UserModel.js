import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'firstName is required'], // Custom error message for name field
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required'], // Custom error message for name field
  },
  userName: {
    type: String,
    required: [true, 'userName is required'], // Custom error message for name field
  },
  email: {
    type: String,
    required: [true, 'Email is required'], // Custom error message for email field
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email'], // Email validation regex
  },
  password: {
    type: String,
    required: [true, 'Password is required'], // Custom error message for password field
  },
  resetOtp: { type: String }, 
  resetOtpExpires: { type: Date },
  profilePic: { type: String },
  role: {
    type: String,
    enum: ['admin', 'seller', 'customer'], // Allowed roles
    default: 'customer', // Default role is 'customer'
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Proceed only if password is modified

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save the user
  } catch (error) {
    next(new Error('Error hashing password')); // Pass error to the next middleware
  }
});

// Method to match entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords'); // Handle comparison error
  }
};

const User = mongoose.model('User', UserSchema);
export default User;
