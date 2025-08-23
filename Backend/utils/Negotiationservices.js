import Negotiation from "../models/Negotiation.js";
import Product from "../models/ProductsModel.js";
import { generateNegotiationResponse } from "./OllamaServices.js";

async function handleAIResponse(negotiation, product, userMessage, messages) {
  try {
    console.log("Generating AI response...");
    const aiResponse = await generateNegotiationResponse(
      product,
      userMessage,
      messages
    );

    negotiation.messages.push({
      from: "bot",
      text: aiResponse.reply,
      timestamp: new Date(),
    });
    negotiation.negotiatedPrice = aiResponse.negotiateFinalPrice;

    if (aiResponse.status === "accepted") {
      negotiation.status = "accepted";
    }
  } catch (error) {
    console.error("AI response generation failed:", error);
    // Add a fallback message if AI fails
    negotiation.messages.push({
      from: "bot",
      text: "I'm currently having trouble processing your request. Please try again or contact support.",
      timestamp: new Date(),
    });
  }
}

export async function startNegotiation(productId, buyerId, initialMessage) {
  try {
    const product = await Product.findById(productId);
    if (!product || !product.negotiationEnabled) {
      throw new Error("Negotiation not allowed for this product.");
    }

    let negotiation = await Negotiation.findOne({
      productId,
      buyerId,
      status: "active",
    });

    if (!negotiation) {
      negotiation = new Negotiation({
        productId,
        buyerId,
        sellerId: product.userId ,
        messages: [],
        useAI: !!product.negotiationEnabled,
      });
    }

    negotiation.messages.push({
      from: "buyer",
      text: initialMessage,
      timestamp: new Date(),
    });

    if (negotiation.useAI) {
      await handleAIResponse(
        negotiation,
        product,
        initialMessage,
        negotiation.messages
      );
    }

    await negotiation.save();
    return negotiation;
  } catch (error) {
    console.error("Error in startNegotiation:", error.message);
    throw error;
  }
}

export async function postMessage(negotiationId, userId, message) {
  try {
    if (!negotiationId || !/^[0-9a-fA-F]{24}$/.test(negotiationId)) {
      throw new Error("Invalid negotiation ID.");
    }

    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation || negotiation.status !== "active") {
      throw new Error("Negotiation not found or not active.");
    }

    const buyerId = negotiation.buyerId ? negotiation.buyerId.toString() : null;
    const sellerId = negotiation.sellerId
      ? negotiation.sellerId.toString()
      : null;

    if (userId !== buyerId && userId !== sellerId) {
      throw new Error("Not authorized for this negotiation.");
    }

    const from = userId === buyerId ? "buyer" : "seller";
    negotiation.messages.push({
      from,
      text: message,
      timestamp: new Date(),
    });

    if (from === "buyer" && negotiation.useAI) {
      const product = await Product.findById(negotiation.productId);
      if (!product) {
        throw new Error("Product not found for negotiation.");
      }
      await handleAIResponse(
        negotiation,
        product,
        message,
        negotiation.messages
      );
    }

    await negotiation.save();
    return negotiation;
  } catch (error) {
    console.error("Error in postMessage:", error.message);
    throw error;
  }
}

export async function toggleAI(negotiationId, userId) {
  try {
    if (!negotiationId || !/^[0-9a-fA-F]{24}$/.test(negotiationId)) {
      throw new Error("Invalid negotiation ID.");
    }

    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation) {
      throw new Error("Negotiation not found.");
    }

    if (
      userId !== (negotiation.sellerId ? negotiation.sellerId.toString() : null)
    ) {
      throw new Error("Only the seller can toggle AI.");
    }

    negotiation.useAI = !negotiation.useAI;
    await negotiation.save();

    return negotiation;
  } catch (error) {
    console.error("Error in toggleAI:", error.message);
    throw error;
  }
}

export async function updateStatus(negotiationId, userId, status, finalPrice) {
  try {
    if (!negotiationId || !/^[0-9a-fA-F]{24}$/.test(negotiationId)) {
      throw new Error("Invalid negotiation ID.");
    }

    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation) {
      throw new Error("Negotiation not found.");
    }

    if (
      userId !== (negotiation.sellerId )
    ) {
      throw new Error("Only the seller can update status.");
    }

    if (!["accepted", "rejected", "expired"].includes(status)) {
      throw new Error("Invalid status provided.");
    }

    if (status === "accepted") {
      if (typeof finalPrice !== "number") {
        throw new Error("Final price (number) is required when accepting.");
      }

      const product = await Product.findById(negotiation.productId);
      const floor =
        product.minAcceptablePrice ??
        Math.round(product.price * 0.7 * 100) / 100;

      if (finalPrice < floor || finalPrice > product.price) {
        throw new Error(
          `Final price must be between $${floor.toFixed(2)} and $${product.price.toFixed(2)}.`
        );
      }
      negotiation.negotiatedPrice = finalPrice;
    }

    negotiation.status = status;
    await negotiation.save();
    return negotiation;
  } catch (error) {
    console.error("Error in updateStatus:", error.message);
    throw error;
  }
}

export async function getNegotiationsForProduct(productId, userId) {
  try {
    return await Negotiation.find({
      productId,
      $or: [{ buyerId: userId }, { sellerId: userId }],
    }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error in getNegotiationsForProduct:", error.message);
    throw error;
  }
}