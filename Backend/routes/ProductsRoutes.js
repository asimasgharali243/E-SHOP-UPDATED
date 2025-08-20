import express from 'express';
import { createProduct } from "../controllers/Products/CreateProduct.js"
import { deleteProduct } from "../controllers/Products/DeleteSingleProduct.js"
import { getAllProducts } from "../controllers/Products/GetAllProduct.js"
import { getSingleProduct } from "../controllers/Products/GetSingleProduct.js"
import { updateProduct } from "../controllers/Products/UpdateProduct.js"
import { signUpload } from '../controllers/Products/SignUpload.js';
import { rollbackProductDetails } from '../controllers/Products/RollbackProductDetails.js';
import { addReview } from '../controllers/Products/AddProductReviews.js';
import { AuthUser } from '../middlewares/Authmiddleware.js';

const ProductRouter = express.Router();

ProductRouter.route('/').get(getAllProducts);
ProductRouter.route('/:id').get(getSingleProduct).delete(deleteProduct).put(updateProduct);
ProductRouter.route('/create/product').post(AuthUser, createProduct);
ProductRouter.route('/get-signature/product/').get(signUpload);
ProductRouter.route('/roll/back').delete(rollbackProductDetails);
ProductRouter.route('/:productId/reviews').post(AuthUser, addReview);

export default ProductRouter;