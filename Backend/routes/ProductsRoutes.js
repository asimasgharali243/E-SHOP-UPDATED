import express, { Router } from 'express';
import {createProduct} from "../controllers/Products/CreateProduct.js"
import {deleteProduct} from "../controllers/Products/DeleteSingleProduct.js"
import {getAllProducts} from "../controllers/Products/GetAllProduct.js"
import {getSingleProduct} from "../controllers/Products/GetSingleProduct.js"
import {updateProduct} from "../controllers/Products/UpdateProduct.js"
import { signUpload } from '../controllers/Products/SignUpload.js';
import { rollbackProductDetails } from '../controllers/Products/RollbackProductDetails.js';
import { removeBackground } from '../controllers/Products/RemoveBackground.js';
import { AuthUser } from '../middlewares/Authmiddleware.js';
const ProductRouter=express.Router();
console.log(signUpload)
ProductRouter.route('/products').get(getAllProducts);
ProductRouter.route('/products/:id').get(getSingleProduct).delete(deleteProduct).put(updateProduct)
ProductRouter.route('/products/create').post(AuthUser,createProduct)
ProductRouter.route('/get-signature').get(signUpload)
ProductRouter.route('/products/rollback').delete(rollbackProductDetails)
ProductRouter.route('/remove-background').post(AuthUser,removeBackground)
export default ProductRouter;