import cloudinary from "cloudinary";
import product from "../../models/ProductsModel.js"
import mongoose from "mongoose";
export const deleteProduct = async (req, res, next) => {
    try{

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      }
      console.log(req.params.id);
    const deletableProduct = await product.findById(req.params.id);
  
    if (!deletableProduct) {
      return res.status(404).json({message:"Product not found"});
    }
  
    // Deleting Images From Cloudinary
    for (let i = 0; i < deletableProduct.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  
    await deletableProduct.remove();
  
    res.status(200).json({
      success: true,
      message: "Product Delete Successfully",
    });
  }catch(error){
    console.log(error.message)
     res.status(500).json({message:"internal server Error"})

  }}
  
  ;
  