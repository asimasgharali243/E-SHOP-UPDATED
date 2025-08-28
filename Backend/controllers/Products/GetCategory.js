import Product from "../../models/ProductsModel.js";

export const getCategories = async (req, res) => {
  try {
    console.log("Fetching categories...");
    const categories = await Product.aggregate([
      {
        $group: {
          _id: { category: "$category", subcategory: "$subcategory" },
          image: { $first: { $arrayElemAt: ["$featureImages.url", 0] } }
        }
      },
      {
        $group: {
          _id: "$_id.category",
          subcategories: {
            $push: {
              name: "$_id.subcategory",
              key: { $concat: ["$_id.subcategory", "_key"] },
              image: "$image"
            }
          }
        }
      },
      {
        $project: {
          name: "$_id",
          key: { $toLower: "$_id" },
          subcategories: 1,
          _id: 0
        }
      }
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
