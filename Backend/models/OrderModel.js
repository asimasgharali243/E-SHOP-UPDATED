// models/Order.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, 
    image: { type: String }, 
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }, 
    currency: { type: String, default: "usd" }, 
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [itemSchema],
      required: true,
      validate: (v) => v.length > 0,
    },
    totalAmount: { type: Number, required: true, min: 0 }, // server-computed
    currency: { type: String, default: "usd" },

    // Business flow
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "canceled",
        "refunded",
        "shipped",
        "delivered",
      ],
      default: "pending",
    },

    // Payment/Stripe
    paymentMethod: { type: String, default: "stripe_checkout" },
    transactionID: { type: String },
    stripeSessionId: { type: String },
    paymentIntentId: { type: String },
    paymentStatus: { type: String },
    latestChargeId: { type: String },

    // Address captured before Stripe (or from webhook if using automatic collection)
    shippingAddress: shippingAddressSchema,

    // Optional metadata
    notes: { type: String },
  },
  { timestamps: true }
);

// Compute total on create/update if items changed
orderSchema.pre("validate", function (next) {
  if (this.isModified("items")) {
    const total = this.items.reduce(
      (sum, it) => sum + it.unitPrice * it.quantity,
      0
    );
    this.totalAmount = Math.round((total + Number.EPSILON) * 100) / 100;
    if (this.items.length > 0) this.currency = this.items[0].currency || "usd";
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
