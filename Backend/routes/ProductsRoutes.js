import express, { Router } from 'express';
import {createProduct} from "../controllers/Products/CreateProduct.js"
import {deleteProduct} from "../controllers/Products/DeleteSingleProduct.js"
import {getAllProducts} from "../controllers/Products/GetAllProduct.js"
import {getSingleProduct} from "../controllers/Products/GetSingleProduct.js"
import {updateProduct} from "../controllers/Products/UpdateProduct.js"

const ProductRouter=express.Router();

ProductRouter.route('/products').get(getAllProducts);
ProductRouter.route('/products/:id').get(getSingleProduct).delete(deleteProduct).put(updateProduct)
ProductRouter.route('/products/create').post(createProduct)


export default ProductRouter;