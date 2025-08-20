import Negotiation from "../models/Negotiation.js";
import Product from "../models/ProductsModel.js";
import { generateNegotiationResponse } from "./OllamaServices.js";

export async function startNegotiation(productId, buyerId, initialMessage) {
    try {
        const product = await Product.findById(productId);
        if (!product || !product.negotiationEnabled) {
            throw new Error("Negotiation not allowed for this product");
        }

        let negotiation = await Negotiation.findOne({ 
            productId, 
            buyerId, 
            status: "active" 
        });

        if (!negotiation) {
            negotiation = new Negotiation({
                productId,
                buyerId,
                sellerId: product.userId ? product.userId.toString() : null,
                messages: [],
                useAI: !!product.negotiationEnabled,
            });
        }

        negotiation.messages.push({ 
            from: "buyer", 
            text: initialMessage, 
            timestamp: new Date() 
        });

        if (negotiation.useAI) {
            console.log("Generating AI response for new negotiation...");
            const product = await Product.findById(productId);
            
            // GET STRUCTURED AI RESPONSE
            const aiResponse = await generateNegotiationResponse(
                product,
                initialMessage,
                negotiation.messages
            );

            negotiation.messages.push({ 
                from: "bot", 
                text: aiResponse.reply, 
                timestamp: new Date() 
            });

            // TRACK NEGOTIATED PRICE (NOT FINAL UNTIL ACCEPTED)
            negotiation.negotiatedPrice = aiResponse.negotiateFinalPrice;
            console.log("Tracked initial negotiated price:", aiResponse.negotiateFinalPrice);
        }

        await negotiation.save();
        return negotiation;
    } catch (error) {
        console.error("Error in startNegotiation:", error);
        throw error;
    }
}

export async function postMessage(negotiationId, userId, message) {
    try {
        // Validate negotiationId
        if (!negotiationId || negotiationId === "undefined" || !/^[0-9a-fA-F]{24}$/.test(negotiationId)) {
            throw new Error("Invalid negotiation ID");
        }

        const negotiation = await Negotiation.findById(negotiationId);
        if (!negotiation || negotiation.status !== "active") {
            throw new Error("Negotiation not found or not active");
        }

        const buyerId = negotiation.buyerId ? negotiation.buyerId.toString() : null;
        const sellerId = negotiation.sellerId ? negotiation.sellerId.toString() : null;

        if (userId !== buyerId && userId !== sellerId) {
            throw new Error("Not authorized for this negotiation");
        }

        const from = userId === buyerId ? "buyer" : "seller";
        negotiation.messages.push({ 
            from, 
            text: message, 
            timestamp: new Date() 
        });

        if (from === "buyer" && negotiation.useAI) {
            console.log("Generating AI response to buyer message...");
            const product = await Product.findById(negotiation.productId);
            
            // GET STRUCTURED AI RESPONSE
            const aiResponse = await generateNegotiationResponse(
                product,
                message,
                negotiation.messages
            );

            // ADD AI MESSAGE
            negotiation.messages.push({ 
                from: "bot", 
                text: aiResponse.reply, 
                timestamp: new Date() 
            });

            // ✅ TRACK NEGOTIATED PRICE (BUT DON'T AUTO-ACCEPT)
            negotiation.negotiatedPrice = aiResponse.negotiateFinalPrice;
            console.log("Tracked negotiated price:", aiResponse.negotiateFinalPrice);
            
            // Extract buyer's offer from message for validation
            const priceMatches = message.match(/\$?(\d+(?:\.\d{2})?)/g);
            let buyerOffer = null;
            if (priceMatches) {
                const offers = priceMatches.map(m => parseFloat(m.replace(/\$/g, '')));
                buyerOffer = Math.max(...offers);
            }
            
            // Auto-accept only if AI suggests accepting buyer's exact offer
            if (buyerOffer !== null && aiResponse.negotiateFinalPrice === buyerOffer) {
                console.log("Auto-accepting buyer's offer:", buyerOffer);
                negotiation.status = "accepted";
            }
        }

        await negotiation.save();
        return negotiation;
    } catch (error) {
        console.error("Error in postMessage:", error);
        throw error;
    }
}

export async function toggleAI(negotiationId, userId) {
    // Validate negotiationId
    if (!negotiationId || negotiationId === "undefined" || !/^[0-9a-fA-F]{24}$/.test(negotiationId)) {
        throw new Error("Invalid negotiation ID");
    }

    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation) {
        throw new Error("Negotiation not found");
    }

    if (userId !== (negotiation.sellerId ? negotiation.sellerId.toString() : null)) {
        throw new Error("Only seller can toggle AI");
    }

    negotiation.useAI = !negotiation.useAI;
    await negotiation.save();

    return negotiation;
}

export async function updateStatus(negotiationId, userId, status, finalPrice) {
    // Validate negotiationId
    if (!negotiationId || negotiationId === "undefined" || !/^[0-9a-fA-F]{24}$/.test(negotiationId)) {
        throw new Error("Invalid negotiation ID");
    }

    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation) {
        throw new Error("Negotiation not found");
    }
    
    if (userId !== (negotiation.sellerId ? negotiation.sellerId.toString() : null)) {
        throw new Error("Only seller can update status");
    }

    if (!["accepted", "rejected", "expired"].includes(status)) {
        throw new Error("Invalid status");
    }

    if (status === "accepted") {
        const product = await Product.findById(negotiation.productId);
        const floor = product.minAcceptablePrice || Math.round(product.price * 0.7 * 100) / 100;

        if (typeof finalPrice !== "number") {
            throw new Error("finalPrice number required when accepting");
        }

        if (finalPrice < floor || finalPrice > product.price) {
            throw new Error(`finalPrice must be between $${floor} and $${product.price}`);
        }

        negotiation.negotiatedPrice = finalPrice;
    }

    negotiation.status = status;
    await negotiation.save();

    return negotiation;
}

export async function getNegotiationsForProduct(productId, userId) {
    return await Negotiation.find({
        productId,
        $or: [{ buyerId: userId }, { sellerId: userId }],
    }).sort({ createdAt: -1 });
}