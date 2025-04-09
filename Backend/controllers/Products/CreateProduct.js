import cloudinary from "cloudinary";
import product from "../../models/ProductsModel.js"
import  uploadImage  from "../../utils/uploadImage.js";
export const createProduct = async (req, res) => {
    let images = [];
  
    try {
        console.log("hi")
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
  
      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await uploadImage(images[i]);
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
      req.body.user = req.user.id;
  
      const product = await product.create(req.body);
  
      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating product: " + error.message,
      });
    }
  };
  