import product from "../../models/ProductsModel.js";
import mongoose from "mongoose";

export const getSingleProduct = async (req, res, next) => {
  try {
    console.log("Fetching single product with ID:", req.params.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // 1. Fetch main product with reviews & user details
    const singleProduct = await product.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "userId",
          select: "firstName lastName email profileImage",
        },
      });

    if (!singleProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    const relatedProducts = await product.find({
      category: singleProduct.category, 
      _id: { $ne: singleProduct._id }, 
    }).limit(12); 

    // 3. Send response
    res.status(200).json({
      success: true,
      product: singleProduct,
      relatedProducts, // included related products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
