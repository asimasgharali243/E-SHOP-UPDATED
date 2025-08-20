import mongoose from "mongoose";
import Product from "../../models/ProductsModel.js";
import Review from "../../models/ReviewModel.js";

export const addReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("Transaction started");
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;
    console.log("User ID:", userId, productId, rating, comment);
    //  Verify product exists
    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //  Ensure user cannot review same product twice
    const existingReview = await Review.findOne({ userId, productId }).session(session);
    if (existingReview) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    //  Create new review inside transaction
    const [review] = await Review.create(
      [{ userId, productId, rating, comment }],
      { session }
    );

    //  Recalculate stats using aggregation (DB side, not JS)
    const stats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]).session(session);

    const avgRating = stats[0]?.avg || rating;
    const numOfReviews = stats[0]?.count || 1;

    //  Update product atomically
    await Product.findByIdAndUpdate(
      productId,
      {
        $push: { reviews: review._id },
        $set: {
          ratings: avgRating.toFixed(1),
          numOfReviews
        }
      },
      { session }
    );

    //  Commit transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};



// "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\db" --replSet rs0
