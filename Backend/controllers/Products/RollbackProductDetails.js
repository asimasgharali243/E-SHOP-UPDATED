// routes/product.js
import { imagekitInstance } from "../../index.js";
import pLimit from "p-limit";

// Limit concurrent deletions to prevent ImageKit rate limiting
const limit = pLimit(5);

export const rollbackProductDetails = async (req, res) => {
  try {
    const {images} = req.body;
    console.log("Rollback request received with images:", images);
    // Validate request body
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided for rollback",
      });
    }

    // Extract only valid fileIds
    const fileIds = images.map((img) => img?.fileId).filter(Boolean);
console.log("Extracted fileIds for rollback:", fileIds);              
    if (fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fileIds found in provided images",
      });
    }

    console.log(`Starting rollback for ${fileIds.length} images...`);

    // Run deletions in parallel with concurrency control
    const results = await Promise.allSettled(
      fileIds.map((fileId) =>
        limit(async () => {
          try {
            await imagekitInstance.deleteFile(fileId);
            return { success: true, fileId };
          } catch (error) {
            return { success: false, fileId, error: error.message };
          }
        })
      )
    );

    // Normalize results
    const summary = results.map((r) => r.value);
    const successes = summary.filter((r) => r.success);
    const failures = summary.filter((r) => !r.success);

    console.log(
      `Rollback completed. Success: ${successes.length}, Failed: ${failures.length}`
    );

    return res.status(200).json({
      success: failures.length === 0,
      message:
        failures.length > 0
          ? "Rollback completed with some failures"
          : "Rollback completed successfully",
      stats: {
        total: fileIds.length,
        successful: successes.length,
        failed: failures.length,
      },
      failures: failures.length ? failures : undefined,
    });
  } catch (err) {
    console.error("Critical rollback error:", err);
    return res.status(500).json({
      success: false,
      message: "Rollback failed due to server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
};
