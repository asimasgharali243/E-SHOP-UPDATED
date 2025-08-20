import {
  startNegotiation,
  postMessage,
  toggleAI,
  updateStatus,
  getNegotiationsForProduct
} from "../../utils/NegotiationServices.js";

export async function startNegotiationController(req, res) {
  try {
    const buyerId = req.userId;
    const { productId, initialMessage } = req.body;
    console.log("Starting negotiation:", { productId, initialMessage });
    
    if (!productId || !initialMessage) {
      return res.status(400).json({ 
        message: "productId and initialMessage are required" 
      });
    }

    const negotiation = await startNegotiation(
      productId, 
      buyerId, 
      initialMessage
    );

    return res.json({
      negotiationId: negotiation._id,
      messages: negotiation.messages,
      useAI: negotiation.useAI,
      status: negotiation.status,
      negotiatedPrice: negotiation.negotiatedPrice
    });
  } catch (error) {
    console.error("[startNegotiation] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

export async function postMessageController(req, res) {
  try {
    const userId = req.userId.toString();
    const { negotiationId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const negotiation = await postMessage(
      negotiationId, 
      userId, 
      message
    );

    return res.json({
      negotiationId: negotiation._id,
      messages: negotiation.messages,
      useAI: negotiation.useAI,
      negotiatedPrice: negotiation.negotiatedPrice,
      status: negotiation.status
    });
  } catch (error) {
    console.error("[postMessage] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

export async function toggleAIController(req, res) {
  try {
    const userId = req.userId.toString();
    const { negotiationId } = req.params;

    const negotiation = await toggleAI(
      negotiationId, 
      userId
    );

    return res.json({ 
      useAI: negotiation.useAI, 
      message: `AI ${negotiation.useAI ? "enabled" : "disabled"}` 
    });
  } catch (error) {
    console.error("[toggleAI] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

export async function updateStatusController(req, res) {
  try {
    const userId = req.userId.toString();
    const { negotiationId } = req.params;
    const { status, finalPrice } = req.body;

    const negotiation = await updateStatus(
      negotiationId, 
      userId, 
      status, 
      finalPrice
    );

    return res.json({ 
      negotiationId: negotiation._id, 
      status: negotiation.status, 
      negotiatedPrice: negotiation.negotiatedPrice 
    });
  } catch (error) {
    console.error("[updateStatus] error:", error);
    return res.status(400).json({ message: error.message });
  }
}

export async function getNegotiationsForProductController(req, res) {
  try {
    const userId = req.userId.toString();
    const { productId } = req.params;

    const negotiations = await getNegotiationsForProduct(
      productId, 
      userId
    );

    return res.json(negotiations);
  } catch (error) {
    console.error("[getNegotiationsForProduct] error:", error);
    return res.status(400).json({ message: error.message });
  }
}