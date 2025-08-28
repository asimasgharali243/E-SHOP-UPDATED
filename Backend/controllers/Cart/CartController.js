import Cart from "../../models/CartModel.js";
import Product from "../../models/ProductsModel.js";
import mongoose from "mongoose";

const formatCartResponse = (cart) => ({
  items: cart.items.map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.price,
    image: item.product.featureImages?.[0]?.url || "", 
    quantity: item.quantity,
  })),
  version: cart.version,
});


export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate(
      "items.product",
      "name price featureImages" 
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
        version: 1,
      });
    }

    res.json(formatCartResponse(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    cart.version += 1;

    await cart.save();
    await cart.populate("items.product", "name price featureImages"); 

    res.json(formatCartResponse(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove cart item" });
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.version += 1;

    await cart.save();

    res.json({
      message: "Cart cleared",
      ...formatCartResponse(cart),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

export const addOrUpdateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, action = "set" } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [], version: 1 });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update existing item
      if (action === "increase") {
        cart.items[itemIndex].quantity += quantity;
      } else if (action === "decrease") {
        cart.items[itemIndex].quantity = Math.max(
          cart.items[itemIndex].quantity - quantity,
          1
        );
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      cart.items[itemIndex].price = product.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    cart.version += 1;
    await cart.save();
    await cart.populate("items.product", "name price featureImages"); // ✅ FIXED

    res.json(formatCartResponse(cart));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};


export const syncCart = async (req, res) => {
  try {
    const { items, version } = req.body;
    console.log("Syncing cart with items:", items);

    // Validate each product exists
    for (const item of items) {
      const productId = item.productId || item.product?._id;
      console.log("Checking product ID:", productId);

      if (!productId) continue;

      // Check if the ID is a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(productId)) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({
            message: `Product ${productId} not found`,
          });
        }
      } else {
        console.warn(
          `Non-ObjectId product found: ${productId}. This may be a legacy product.`
        );
      }
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      // Create a fresh cart from client items
      cart = await Cart.create({
        user: req.userId,
        items: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        version: version + 1,
      });
    } else {
      // If client version is newer → update
      if (version >= cart.version) {
        cart.items = items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        }));
        cart.version = version + 1;
      }
      await cart.save();
    }

    await cart.populate({
      path: "items.product",
      match: { _id: { $type: "objectId" } },
      select: "name price featureImages", 
    });

    res.json(formatCartResponse(cart));
  } catch (err) {
    console.error("Cart sync error:", err);
    res.status(500).json({ message: "Failed to sync cart" });
  }
};
