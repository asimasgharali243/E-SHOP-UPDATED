import express from "express";
import { AuthUser } from "../middlewares/Authmiddleware.js";
import { createProduct } from "../controllers/Products/CreateProduct.js";
import { deleteProduct } from "../controllers/Products/DeleteSingleProduct.js";
import { getAllProducts } from "../controllers/Products/GetAllProduct.js";
import { getSingleProduct } from "../controllers/Products/GetSingleProduct.js";
import { updateProduct } from "../controllers/Products/UpdateProduct.js";
import { signUpload } from "../controllers/Products/SignUpload.js";
import { rollbackProductDetails } from "../controllers/Products/RollbackProductDetails.js";
import { addReview } from "../controllers/Products/AddProductReviews.js";

const router = express.Router();

router.route("/")
  .get(getAllProducts) // GET /api/products
  .post(AuthUser, createProduct); // POST /api/products

router.route("/:id")
  .get(getSingleProduct) // GET /api/products/:id
  .put(AuthUser, updateProduct) // PUT /api/products/:id
  .delete(AuthUser, deleteProduct); // DELETE /api/products/:id

router.get("/get/signature", signUpload); // GET /api/products/get-signature?count=3
router.delete("/rollback", rollbackProductDetails); // DELETE /api/products/rollback

router.post("/:productId/reviews", AuthUser, addReview); // POST /api/products/:id/reviews

export default router;
