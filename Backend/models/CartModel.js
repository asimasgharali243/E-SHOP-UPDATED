import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true // createdAt, updatedAt will be auto-generated
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
