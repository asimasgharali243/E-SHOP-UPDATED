// import { Rembg } from "@xixiyahaha/rembg-node";
// import sharp from "sharp";
import asyncHandler from "../../middlewares/AsyncHandler.js";

// const rembg = new Rembg({ logging: false }); // only initialize once (global/shared)

export const removeBackground = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files uploaded' });
  }

  const results = await Promise.allSettled(
    req.files.map(async (file) => {
      const inputSharp = sharp(file.buffer);
      const outputSharp = await rembg.remove(inputSharp);

      const buffer = await outputSharp
        .trim() // Optional: removes transparent padding
        .webp({ quality: 95 }) // or .png()
        .toBuffer();

      return {
        filename: file.originalname.replace(/\.\w+$/, '.webp'),
        image: `data:image/webp;base64,${buffer.toString('base64')}`,
      };
    })
  );

  const images = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  const errors = results
    .filter(r => r.status === 'rejected')
    .map((r, i) => ({
      filename: req.files[i]?.originalname,
      error: r.reason?.message || 'Processing failed',
    }));

  res.status(200).json({
    success: true,
    processedCount: images.length,
    failedCount: errors.length,
    images,
    errors,
  });
});
