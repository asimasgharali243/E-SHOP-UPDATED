import express from 'express';
import { AuthUser } from '../middlewares/Authmiddleware.js';
import { rateLimit } from "../middlewares/RateLimits.js";
import {
    startNegotiationController,
    postMessageController,
    toggleAIController,
    updateStatusController,
    getNegotiationsForProductController
} from "../controllers/Products/NegotiateController.js";

const NegotiationRouter = express.Router();

// Start a negotiation
NegotiationRouter.route('/start')
    .post(AuthUser, rateLimit(), startNegotiationController);

// Post a message in a negotiation
NegotiationRouter.route('/:negotiationId/message')
    .post(AuthUser, rateLimit(), postMessageController);

// Toggle AI in a negotiation
NegotiationRouter.route('/:negotiationId/toggle-ai')
    .patch(AuthUser, toggleAIController);

// Update negotiation status
NegotiationRouter.route('/:negotiationId/status')
    .patch(AuthUser, updateStatusController);

// Get negotiations for a product
NegotiationRouter.route('/product/:productId')
    .get(AuthUser, getNegotiationsForProductController);

export default NegotiationRouter;