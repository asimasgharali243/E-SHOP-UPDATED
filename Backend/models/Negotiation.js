import mongoose from "mongoose";

const negotiationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        from: {
          type: String,
          enum: ["buyer", "bot", "seller"],
          required: true,
        },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    negotiatedPrice: { type: Number },
    status: {
      type: String,
      enum: ["active", "accepted", "rejected", "expired"],
      default: "active",
    },
    useAI: { type: Boolean, default: true },
  },
  { timestamps: true }
);

negotiationSchema.index({ productId: 1, buyerId: 1, status: 1, createdAt: -1 });

const Negotiation = mongoose.model("Negotiation", negotiationSchema);
export default Negotiation;