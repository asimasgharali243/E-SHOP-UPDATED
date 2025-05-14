import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [6, 'First name must be at least 6 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [6, 'Last name must be at least 6 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true,'user name already exist '],
    trim: true,
    minlength: [6, 'Last name must be at least 6 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true,'user already exist'],
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address',
    ],
    maxlength:[50,'Email connot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    maxlenght: [50, 'Password cannot exceed 50 characters'],
  },
  resetOtp: {
    type: String,
    trim: true,
  },
  resetOtpExpires: {
    type: Date,
    default: null,
    expires:parseInt(process.env.OTP_EXPIRE_TIME),
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
// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next(); // Proceed only if password is modified

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next(); 
//   } catch (error) {
//     next(new Error('Error hashing password')); 
//   }
// });



// Method to match entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('passwords does not match'); // Handle comparison error
  }
};

const User = mongoose.model('User', UserSchema);
export default User;
