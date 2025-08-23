// controllers/Products/NegotiateController.js
import {
  startNegotiation as startNegotiationService,
  postMessage as postMessageService,
  toggleAI as toggleAIService,
  updateStatus as updateStatusService,
  getNegotiationsForProduct as getNegotiationsForProductService,
} from "../../utils/NegotiationServices.js";

// --- Start Negotiation ---
export async function startNegotiationController(req, res) {
  const { productId, initialMessage } = req.body;
  if (!productId || !initialMessage) {
    return res
      .status(400)
      .json({ message: "productId and initialMessage are required." });
  }

  try {
    const buyerId = req.userId;
    const negotiation = await startNegotiationService(
      productId,
      buyerId,
      initialMessage
    );
    req.app
      .get("io")
      .to(negotiation._id.toString())
      .emit("negotiationUpdate", negotiation);
    return res.json(negotiation);
  } catch (error) {
    console.error("[startNegotiation] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

// --- Post Message ---
export async function postMessageController(req, res) {
  const { negotiationId } = req.params;
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "message is required." });
  }

  try {
    const userId = req.userId.toString();
    const negotiation = await postMessageService(
      negotiationId,
      userId,
      message
    );
    req.app
      .get("io")
      .to(negotiation._id.toString())
      .emit("negotiationUpdate", negotiation);
    return res.json(negotiation);
  } catch (error) {
    console.error("[postMessage] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

// --- Toggle AI ---
export async function toggleAIController(req, res) {
  const { negotiationId } = req.params;

  try {
    const userId = req.userId.toString();
    const negotiation = await toggleAIService(negotiationId, userId);
    req.app
      .get("io")
      .to(negotiation._id.toString())
      .emit("negotiationUpdate", negotiation);
    return res.json({
      useAI: negotiation.useAI,
      message: `AI ${negotiation.useAI ? "enabled" : "disabled"}.`,
    });
  } catch (error) {
    console.error("[toggleAI] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

// --- Update Status (accept/reject) ---
export async function updateStatusController(req, res) {
  const { negotiationId } = req.params;
  const { status, finalPrice } = req.body;

  try {
    const userId = req.userId;
    const negotiation = await updateStatusService(
      negotiationId,
      userId,
      status,
      finalPrice
    );
    req.app
      .get("io")
      .to(negotiation._id.toString())
      .emit("negotiationUpdate", negotiation);
    return res.json(negotiation);
  } catch (error) {
    console.error("[updateStatus] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

// --- Get Negotiations by Product ---
export async function getNegotiationsForProductController(req, res) {
  const { productId } = req.params;

  try {
    const userId = req.userId.toString();
    const negotiations = await getNegotiationsForProductService(
      productId,
      userId
    );
    return res.json(negotiations);
  } catch (error) {
    console.error("[getNegotiationsForProduct] error:", error);
    return res.status(400).json({ message: error.message });
  }
}
