
// utils/AutoNegotiationService.js

const CONFIG = {
  DEFAULT_QUANTITY: 1,
  MIN_DISCOUNT_THRESHOLD: 2,
  COUNTER_OFFER_PERCENTAGE: 0.95,
  MIN_PROFIT_MARGIN: 0.1
};

// ----------------------
// Extract buyer offer and quantity
// ----------------------
function extractOffer(message) {
  if (!message) return null;
  const priceRegex = /\$?\d+(?:\.\d{1,2})?\b/g;
  const matches = message.match(priceRegex);
  if (!matches) return null;
  return Math.max(...matches.map(m => parseFloat(m.replace(/\$/g, ''))));
}

function extractQuantity(message) {
  if (!message) return CONFIG.DEFAULT_QUANTITY;
  const quantityRegex = /(\d+)\s*(?:units?|x|pcs|pieces?|qty|quantity)/i;
  const simpleNumberRegex = /\b(\d+)\b(?!.*\$\d)/;

  let match = message.match(quantityRegex);
  if (match) return parseInt(match[1]);
  match = message.match(simpleNumberRegex);
  return match ? Math.max(1, parseInt(match[1])) : CONFIG.DEFAULT_QUANTITY;
}

// ----------------------
// Parse sellerGuidelines
// Example: "3 units → 5%; 5 units → 10%"
// ----------------------
function parseSellerGuidelines(guidelines) {
  if (!guidelines) return [];
  const rules = [];
  const parts = guidelines.split(/[;,\n]/);
  for (const part of parts) {
    const match = part.trim().match(/(\d+)\s*(?:units?|\+)?\s*[→:-]\s*(\d+)%/i);
    if (match) rules.push({ units: parseInt(match[1]), discount: parseInt(match[2]) });
  }
  return rules.sort((a, b) => a.units - b.units);
}

// ----------------------
// Calculate discount based on quantity
// ----------------------
function calculateDiscount(product, quantity) {
  if (!product.sellerGuidelines || quantity < CONFIG.MIN_DISCOUNT_THRESHOLD) return 0;
  const rules = parseSellerGuidelines(product.sellerGuidelines);
  let bestDiscount = 0;
  for (const rule of rules) {
    if (quantity >= rule.units && rule.discount > bestDiscount) {
      bestDiscount = rule.discount;
    }
  }
  return bestDiscount;
}

// ----------------------
// Calculate minimum price based on cost and profit margin
// ----------------------
function calculateMinimumPrice(product, quantity) {
  const baseCost = product.costPrice || product.price * 0.6;
  return Math.max(baseCost * (1 + CONFIG.MIN_PROFIT_MARGIN) * quantity, product.minAcceptablePrice || 0);
}

// ----------------------
// Unit word helper
// ----------------------
function getUnitWord(quantity) {
  return quantity === 1 ? 'unit' : 'units';
}

// ----------------------
// Automatic negotiation
// ----------------------
export function generateNegotiationResponse(product, userMessage, conversationHistory = []) {
  const quantity = extractQuantity(userMessage);
  const buyerOffer = extractOffer(userMessage);

  const discountPercent = calculateDiscount(product, quantity);
  const basePrice = product.price * quantity;
  const currentPrice = basePrice * (1 - discountPercent / 100);
  const floor = calculateMinimumPrice(product, quantity);

  let finalPrice, status;

  if (buyerOffer === null) {
    finalPrice = Math.max(currentPrice * CONFIG.COUNTER_OFFER_PERCENTAGE, floor);
    status = "counter";
  } else if (buyerOffer >= floor) {
    finalPrice = Math.min(buyerOffer, currentPrice);
    status = "accepted";
  } else {
    finalPrice = Math.max(buyerOffer * CONFIG.COUNTER_OFFER_PERCENTAGE, floor);
    status = "counter";
    if (finalPrice <= buyerOffer) finalPrice = floor;
  }

  const reply = `The best offer I can provide for ${quantity} ${getUnitWord(quantity)} of ${product.name} is $${finalPrice.toFixed(2)}.` +
                (discountPercent > 0 ? ` Discount applied: ${discountPercent}%.` : '');

  return {
    reply,
    negotiateFinalPrice: finalPrice,
    status,
    quantityConsidered: quantity,
    discountApplied: discountPercent,
    isFallback: true,
  };
}


// // utils/GPT4AllNegotiation.js
// import pkg from "gpt4all";
// import path from "path";
// const { loadModel } = pkg;

// const MODEL_NAME = "DeepSeek-R1-Distill-Qwen-1.5B-Q4_0.gguf";
// let gptModel = null;

// export async function initGPT4All() {
//   if (!gptModel) {
//     // 👇 use the actual folder where the .gguf file is
//     const modelPath = "C:/Users/World/AppData/Local/nomic.ai/GPT4All";
//     const fullPath = path.join(modelPath, MODEL_NAME);

//     console.log(`[GPT4All] Loading local model from: ${fullPath}`);
//     gptModel = await loadModel(fullPath);
//     console.log(`[GPT4All] Model loaded successfully`);
//   }
//   return gptModel;
// }


// // ----------------------
// // Fallback response generator
// // ----------------------
// function fallbackResponse(product, vars) {
//   const { currentPrice, floor, buyerOffer } = vars;
//   let finalPrice = Math.max(buyerOffer || 0, floor, currentPrice * 0.95);
//   const status = buyerOffer && finalPrice >= floor ? "accepted" : "counter";

//   return {
//     reply: `The best offer I can provide for ${product.name} is $${finalPrice.toFixed(
//       2
//     )}.`,
//     negotiateFinalPrice: finalPrice,
//     status,
//     quantityConsidered: 1,
//     isFallback: true,
//   };
// }

// // ----------------------
// // Extract buyer offer
// // ----------------------
// function extractOffer(message) {
//   if (!message) return null;
//   const matches = message.match(/\$?\d+(?:\.\d{1,2})?/g);
//   if (!matches) return null;
//   return Math.max(...matches.map((m) => parseFloat(m.replace("$", ""))));
// }

// // ----------------------
// // Generate AI negotiation response
// // ----------------------
// export async function generateNegotiationResponse(
//   product,
//   userMessage,
//   conversationHistory = []
// ) {
//   const model = await initGPT4All();

//   const currentPrice = product.discount
//     ? product.price * (1 - product.discount / 100)
//     : product.price;

//   const floor = product?.minAcceptablePrice ?? currentPrice;

//   const buyerOffer = extractOffer(userMessage);
//   const vars = { currentPrice, floor, buyerOffer };

//   const lastHistory = (conversationHistory.slice(-4) || [])
//     .map(
//       (msg) =>
//         `${(msg?.from || "USER").toUpperCase()}: ${
//           msg?.text || msg?.content || ""
//         }`
//     )
//     .join("\n");

//   const prompt = `
// You are a seller negotiation assistant. Respond ONLY in JSON:
// {
//   "reply": "string",
//   "negotiateFinalPrice": number,
//   "status": "accepted" | "counter" | "rejected" | "pending",
//   "quantityConsidered": number
// }

// RULES:
// - MIN_PRICE ${floor} must NOT be crossed.
// - If BUYER_OFFER >= MIN_PRICE → "accepted", else "counter".

// PRODUCT: ${product.name}
// PRICE: ${currentPrice}
// MIN_PRICE: ${floor}
// BUYER_OFFER: ${buyerOffer !== null ? buyerOffer : "None"}

// HISTORY:
// ${lastHistory}

// USER_MESSAGE: "${userMessage}"
// `;

//   try {
//     const rawResponse = await model.prompt(prompt);

//     const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) return fallbackResponse(product, vars);

//     const aiResp = JSON.parse(jsonMatch[0]);

//     // sanity checks and defaults
//     if (
//       !aiResp.negotiateFinalPrice ||
//       aiResp.negotiateFinalPrice < floor ||
//       aiResp.negotiateFinalPrice > currentPrice
//     ) {
//       return fallbackResponse(product, vars);
//     }

//     if (!aiResp.reply || typeof aiResp.reply !== "string") {
//       aiResp.reply = `The best I can offer is $${aiResp.negotiateFinalPrice.toFixed(
//         2
//       )}.`;
//     }

//     if (
//       !aiResp.status ||
//       !["accepted", "counter", "rejected", "pending"].includes(aiResp.status)
//     ) {
//       aiResp.status =
//         aiResp.negotiateFinalPrice >= floor ? "accepted" : "counter";
//     }

//     if (typeof aiResp.quantityConsidered !== "number") {
//       aiResp.quantityConsidered = 1;
//     }

//     return aiResp;
//   } catch (err) {
//     console.error("AI parsing failed:", err);
//     return fallbackResponse(product, vars);
//   }
// }
