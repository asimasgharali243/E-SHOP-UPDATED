import cloudinary from "cloudinary";

// Example of uploading an image
 const  uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "products", // You can specify a folder for Cloudinary
      use_filename: true,
      unique_filename: false, // If you want to keep the original file name
    });

    return result;
  } catch (error) {
    throw new Error("Image upload failed: " + error.message);
  }
};

export default uploadImage;