import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  resetOtp: {
    type: String,
  },
  resetOtpExpires: {
    type: Date,
  },
  profileImage: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
      trim: true,
    },
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  address: {
    type: String,
    trim: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  role: {
    type: String,
    enum: ['admin', 'seller', 'customer'],
    default: 'customer',
  },
}, {
  timestamps: true,
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
