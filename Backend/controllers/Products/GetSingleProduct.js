import product from "../../models/ProductsModel.js";
import mongoose from "mongoose";

export const getSingleProduct = async (req, res, next) => {
  try {
    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

const singleProduct = await product.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "userId",  // Now matches the schema
          select: "firstName lastName email profileImage"
        }
      });
    if (!singleProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({
      success: true,
      product: singleProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
