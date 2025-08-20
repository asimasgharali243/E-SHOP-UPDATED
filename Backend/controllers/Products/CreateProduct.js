import Product from '../../models/ProductsModel.js';
import asyncHandler from '../../middlewares/AsyncHandler.js';
import { AppError } from '../../middlewares/errorHandler.js';
import sendResponse from '../../utils/sendResponse.js';

export const createProduct = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const userId = req.userId;
// console.log(userId)
  // Validate input
  if (!data || !userId) {
    throw new AppError('Invalid input or unauthorized', 400);
  }
// console.log(data)
  // Validate required fields
// Validate required fields
const requiredFields = [
  'name',
  'price',
  'category',
  'subcategory',
  'stock',
  'slug',
  'shortDescription',
  'detailsDescription'
];

const missingFields = requiredFields.filter(
  field => !data[field] || data[field].toString().trim() === ""
);

if (missingFields.length > 0) {
  throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
}

  
  if (missingFields.length > 0) {
    throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
  }

  // Create product
  const product = new Product({
    ...data,
    userId: userId,
  });

  // Save with error handling
  try {
    await product.save();
    
    // Remove sensitive data before sending response
    const productResponse = product.toObject();
    delete productResponse.__v;
    
    sendResponse(res, 201, {
      status: 'success',
      data: {
        product: productResponse
      }
    });
  } catch (err) {
    // Handle duplicate key errors (like duplicate slug)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      throw new AppError(`${field} already exists`, 400);
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      throw new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
    }
    
    throw err; // Let the error handler middleware deal with it
  }
});

export default createProduct;