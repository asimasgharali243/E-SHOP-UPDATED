import ApiFeatures from "../../utils/apifeatures.js";
import product from "../../models/ProductsModel.js";

export const getAllProducts = async (req, res, next) => {
  const resultPerPage = 8;

  try {
    const productsCount = await product.countDocuments();

    // Initialize ApiFeatures with the base query
    const apiFeature = new ApiFeatures(product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage); // Apply all features

    // Execute the query
    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount: products.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error", err: error });
  }
};
