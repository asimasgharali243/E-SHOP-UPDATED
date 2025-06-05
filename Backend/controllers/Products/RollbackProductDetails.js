// routes/product.js
import { imagekitInstance } from "../../index.js";
export const rollbackProductDetails = async (req, res) => {
  const {  fileIds } = req.body;

  try {
    // 1. Delete uploaded images from ImageKit
    for (let fileId of fileIds) {
      await imagekitInstance.deleteFile(fileId);
    }

    // 2. Delete the product from MongoDB

    res.status(200).json({ message: "Rollback successful" });
  } catch (err) {
    console.error("Rollback error:", err);
    res.status(500).json({ message: "Rollback failed", error: err.message });
  }
};
