import express from "express";
import { AuthUser } from "../middlewares/Authmiddleware.js";
import { rateLimit } from "../middlewares/RateLimits.js";
import {
  startNegotiationController,
  postMessageController,
  toggleAIController,
  updateStatusController,
  getNegotiationsForProductController,
} from "../controllers/Products/NegotiateController.js";

const router = express.Router();

// Start a negotiation
router.post("/start", AuthUser, rateLimit(), startNegotiationController);

// Post a message
router.post("/:negotiationId/message", AuthUser, rateLimit(), postMessageController);

// Toggle AI in negotiation
router.patch("/:negotiationId/toggle-ai", AuthUser, toggleAIController);

// Update negotiation status
router.patch("/:negotiationId/status", AuthUser, updateStatusController);

// Get all negotiations for a product
router.get("/product/:productId", AuthUser, getNegotiationsForProductController);

export default router;
