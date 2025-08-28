import express from "express";
import { AuthUser } from "../middlewares/Authmiddleware.js";
import { getCart, addOrUpdateCartItem, removeCartItem, clearCart, syncCart } from "../controllers/Cart/CartController.js";

const router = express.Router();
router.use(AuthUser);

router.get("/", getCart);
router.delete("/clear", clearCart);
router.post("/sync", syncCart);

router.route("/item/:productId")
  .post(addOrUpdateCartItem)
  .put(addOrUpdateCartItem)
  .delete(removeCartItem);

export default router;
