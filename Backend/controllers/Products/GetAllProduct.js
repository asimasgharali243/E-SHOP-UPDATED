// controllers/Products/ProductSearchController.js
import Product from '../../models/ProductsModel.js';
import mongoose from 'mongoose';
import User from "../../models/UserModel.js";
export const getAllProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      colors,
      sizes,
      discount,
      negotiationEnabled,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = {};

    // Text search
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Category filter
    if (category) {
      query.category = Array.isArray(category) ? { $in: category } : category;
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = Array.isArray(subcategory) ? { $in: subcategory } : subcategory;
    }

    // Brand filter
    if (brand) {
      query.brand = Array.isArray(brand) ? { $in: brand } : brand;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Color filter
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : [colors];
      query.colors = { $in: colorArray };
    }

    // Size filter
    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
      query.sizes = { $in: sizeArray };
    }

    // Discount filter
    if (discount === 'true') {
      query.discount = { $gt: 0 };
    }

    // Negotiation filter
    if (negotiationEnabled) {
      query.negotiationEnabled = negotiationEnabled === 'true';
    }

    // Sort options
    const sortOptions = {
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      'newest': { createdAt: -1 },
      'popular': { ratings: -1 },
      'name-asc': { name: 1 },
      'name-desc': { name: -1 }
    };

    const sortBy = sortOptions[sort] || { createdAt: -1 };

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .populate('reviews', 'rating comment')
      .populate('userId', 'firstName lastName')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count
    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        resultPerPage: limitNum
      }
    });

  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    console.log("Fetching filter options...");
    const [
      categories,
      subcategories,
      brands,
      colors,
      sizes,
      priceRange
    ] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('subcategory'),
      Product.distinct('brand').then(brands => brands.filter(b => b)),
      Product.distinct('colors').then(colors => colors.flat().filter(c => c)),
      Product.distinct('sizes').then(sizes => sizes.flat().filter(s => s)),
      Product.aggregate([
        { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      filters: {
        categories,
        subcategories,
        brands,
        colors,
        sizes,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 }
      }
    });

  } catch (error) {
    console.error('Filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    });
  }
};




export const toggleLikeProduct = async (req, res) => {
  try {
    console.log("Toggling like for product...");
    const productId = req.params.id;
    const userId = req.userId; 

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const index = product.likes.indexOf(userId);

    if (index === -1) {
      product.likes.push(userId); // Like
    } else {
      product.likes.splice(index, 1); // Unlike
    }

    await product.save();

    // 🔥 Get all products liked by this user
    const likedProductsFromDB = await Product.find({ likes: userId }).select("_id");
    const likedProducts = likedProductsFromDB.map(p => p._id.toString());

    // Increment likes version
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { likesVersion: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      likedProducts,
      version: user.likesVersion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const syncLikes = async (req, res) => {
  try {
    console.log("Sync likes request body:", req.body);
    const userId = req.userId;
    const { likedProducts=[], version=0 } = req.body;

    // Get user's current likes version
    const user = await User.findById(userId);
    const currentServerVersion = user.likesVersion || 0;


    // If client is up to date, just return current likes
    if (version === currentServerVersion) {
      // Find all products that this user has liked
      const likedProductsFromDB = await Product.find({
        likes: userId
      }).select('_id');
      
      const serverLikedProducts = likedProductsFromDB.map(product => product._id.toString());
      
      return res.json({
        likedProducts: serverLikedProducts,
        version: currentServerVersion
      });
    }

    // Client is outdated, need to sync with server
    if (version < currentServerVersion) {
      // Get server's current liked products
      const likedProductsFromDB = await Product.find({
        likes: userId
      }).select('_id');
      
      const serverLikedProducts = likedProductsFromDB.map(product => product._id.toString());
     console.log("Server liked products:", serverLikedProducts); 
      // Update client with server state (server wins in conflicts)
      return res.json({
        likedProducts: serverLikedProducts,
        version: currentServerVersion
      });
    }

    // Client version is newer than server
    if (version > currentServerVersion) {
      // Remove user from all product likes first
      await Product.updateMany(
        { likes: userId },
        { $pull: { likes: userId } }
      );
      
      // Add user to the liked products from client
      if (likedProducts && likedProducts.length > 0) {
        await Product.updateMany(
          { _id: { $in: likedProducts } },
          { $addToSet: { likes: userId } }
        );
      }
      console.log("Client liked products:", likedProducts); 
      // Increment server version to match client's version
      
      // Update user's version and sync timestamp
      await User.findByIdAndUpdate(userId, {
        likesVersion: version,
        lastLikesSync: new Date()
      });
      
      res.json({
        likedProducts: likedProducts,
        version: version
      });
    }
    
  } catch (error) {
    console.error("Sync likes error:", error);
    res.status(500).json({ message: error.message });
  }
};



// POST /products/ids
export const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body; // expecting { ids: ["id1", "id2", ...] }
    console.log("Received IDs:", ids);

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }

    // Validate IDs
    const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "Invalid IDs: " + invalidIds.join(", ") });
    }

    const products = await Product.find({ _id: { $in: ids } })
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "firstName lastName email profileImage" },
      });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};