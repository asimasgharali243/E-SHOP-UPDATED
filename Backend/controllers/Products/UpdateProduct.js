import Product from "../../models/ProductsModel.js";
import mongoose from "mongoose";
import { imagekitInstance } from "../../index.js"; // your initialized ImageKit instance

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let images = req.body.featureImages || [];

    // Delete removed images safely
    const newFileIds = images.map((img) => img.fileId);
    const imagesToDelete = existingProduct.featureImages?.filter(
      (img) => !newFileIds.includes(img.fileId)
    );

    for (const img of imagesToDelete || []) {
      if (img.fileId) {
        try {
          await imagekitInstance.deleteFile(img.fileId);
        } catch (err) {
          console.warn("Failed to delete image:", err.message);
        }
      }
    }

    // Upload new images
    const newImageLinks = [];
    for (const img of images) {
      if (img.file) {
        const upload = await imagekitInstance.upload({
          file: img.file,
          fileName: `product_${Date.now()}`,
          folder: "/products/",
        });
        newImageLinks.push({
          url: upload.url,
          fileId: upload.fileId,
        });
      } else {
        newImageLinks.push(img);
      }
    }

    req.body.featureImages = newImageLinks;

    // Assign updated fields and save (validators work correctly)
    Object.assign(existingProduct, req.body);
    const updatedProduct = await existingProduct.save();

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};
