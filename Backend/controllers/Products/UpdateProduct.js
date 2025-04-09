import cloudinary from "cloudinary"
import product from "../../models/ProductsModel.js"
import mongoose from "mongoose";
export const updateProduct = async (req, res, next) => {
    try{
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      }


    let updatableproduct = await product.findById(req.params.id);
  
    if (!updatableproduct) {
      return res.status(404).json({message:"Product not found"});
    }
  
    // Images Start Here
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < updatableproduct.images.length; i++) {
        await cloudinary.v2.uploader.destroy(updatableproduct.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }
  
    updatableproduct= await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });
}catch(error){
console.log(error.message)
    res.status(500).json({message:"server error"})

}
  };
  