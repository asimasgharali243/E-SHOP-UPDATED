import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"],
  },
  manufacturer: {
    type: String,
    trim: true,
    maxlength: [100, "Manufacturer name cannot exceed 100 characters"],
  },
  shortDescription: {
    type: String,
    required: [true, "Please enter a short description"],
    trim: true,
    maxlength: [300, "Short description cannot exceed 300 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter a full description"],
    trim: true,
    maxlength: [1500, "Description cannot exceed 1500 characters"],
  },
  featureImages: [
    {
      public_id: {
        type: String,
        required: [true, "Public ID is required for Cloudinary image"],
      },
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
    },
  ],
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    min: [0, "Price must be greater than or equal to 0"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount must be greater than or equal to 0"],
    validate: {
      validator: function (value) {
        return value <= this.price;
      },
      message: "Discount cannot be greater than the price",
    },
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    min: [0, "Stock must be greater than or equal to 0"],
    max: [9999, "Stock cannot exceed 4 digits"],
    default: 1,
  },
  color: [
    {
      type: String,
      trim: true,
    },
  ],
  size: [
    {
      type: String,
      trim: true,
    },
  ],
  brand: {
    type: String,
    trim: true,
    maxlength: [50, "Brand name cannot exceed 50 characters"],
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
    trim: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Product = mongoose.model("Product", productSchema);
export default Product;
