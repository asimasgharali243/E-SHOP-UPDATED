import Product from "../../models/ProductsModel.js";
import mongoose from "mongoose";
import { imagekitInstance } from "../../index.js";

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const deletableProduct = await Product.findById(productId);

    if (!deletableProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete all feature images from ImageKit
    const imageDeletionPromises = deletableProduct.featureImages.map(async (img) => {
      if (img.fileId) {
        try {
          await imagekitInstance.deleteFile(img.fileId);
          console.log(`Deleted image: ${img.fileId}`);
        } catch (err) {
          console.error(`Failed to delete image ${img.fileId}:`, err.message);
        }
      }
    });

    await Promise.all(imageDeletionPromises);

    // Delete product from DB
    await deletableProduct.remove();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
