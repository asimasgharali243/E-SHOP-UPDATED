import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactionId: {
    type: String,
    required: [true, "Transaction ID is required"],
    unique: true,
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount must be greater than or equal to 0"],
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    trim: true,
  },
  shippingDetails: {
    type: String,
    required: [true, "Shipping address is required"],
    trim: true,
  },
}, {
  timestamps: { createdAt: "orderedAt", updatedAt: "updatedAt" }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
