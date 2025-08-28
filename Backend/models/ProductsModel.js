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
    detailsDescription: {
        type: String,
        required: [true, "Please enter a full description"],
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    featureImages: [{
        fileId: { type: String, required: true },
        url: { type: String, required: true },
        thumbnailUrl: { type: String }
    }],
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
    colors: {
        type: [String],
        set: (v) => (typeof v === "string" ? v.split(",").map((s) => s.trim()) : v),
        maxlength: [10, "Colors cannot exceed 10 items"],
    },
    sizes: {
        type: [String],
        set: (v) => (typeof v === "string" ? v.split(",").map((s) => s.trim()) : v),
        maxlength: [10, "Sizes cannot exceed 10 items"],
    },
    brand: {
        type: String,
        trim: true,
        maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    category: {
        type: String,
        required: [true, "Please enter product category"],
        trim: true,
        enum: {
            values: [
                "Electronics",
                "Men's Fashion",
                "Women's Fashion",
                "Home & Kitchen",
                "Toys & Games",
                "Health & Beauty",
                "Sports",
                "Jewelry",
            ],
            message: "Invalid category value",
        },
    },
    subcategory: {
        type: String,
        required: [true, "Please enter product subcategory"],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, "Please enter product slug"],
        trim: true,
        unique: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    numOfReviews: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    negotiationEnabled: {
        type: Boolean,
        default: false,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    minAcceptablePrice: {
        type: Number,
        min: [0, "Minimum acceptable price must be greater than or equal to 0"],
        validate: {
            validator: function (value) {
                return value <= this.price;
            },
            message: "Minimum acceptable price cannot exceed the product price",
        },
    },
    sellerGuidelines: {
        type: String,
        trim: true,
        maxlength: [1000, "Seller guidelines cannot exceed 500 characters"],
    },
}, {
    timestamps: true,
});



// Add text index for search functionality
productSchema.index({
    name: "text",
    shortDescription: "text",
    detailsDescription: "text",
    brand: "text",
    category: "text"
});

export default mongoose.model("Product", productSchema);