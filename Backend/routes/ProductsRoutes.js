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
import { fetchProductComparisons } from "../controllers/Products/ComparisionController.js";
import { getFilterOptions } from "../controllers/Products/GetAllProduct.js";
import { toggleLikeProduct, syncLikes, getProductsByIds } from "../controllers/Products/GetAllProduct.js";
import { getCategories } from "../controllers/Products/GetCategory.js";
const router = express.Router();

// CORRECT: POST route for getting products by IDs
router.post("/like/product", AuthUser, getProductsByIds);
router.get("/getcategories", getCategories);

router.route("/").get(getAllProducts).post(AuthUser, createProduct);
router.get("/compare", fetchProductComparisons);
router.delete("/rollback", rollbackProductDetails);
router.put("/:id/like", AuthUser, toggleLikeProduct);
router.get("/filters", getFilterOptions);
router.post("/likes/sync", AuthUser, syncLikes);
router
  .route("/:id")
  .get(getSingleProduct)
  .put(AuthUser, updateProduct)
  .delete(AuthUser, deleteProduct);
router.get("/get/signature", signUpload);
router.post("/:productId/reviews", AuthUser, addReview);

export default router;