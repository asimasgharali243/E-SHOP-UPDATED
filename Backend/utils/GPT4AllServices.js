// utils/GPT4AllNegotiation.js
import pkg from "gpt4all";
const { loadModel, downloadModel } = pkg;

const MODEL_NAME = process.env.GPT4ALL_MODEL || "DeepSeek-R1-Distill-Qwen-1.5B~2";
let gptModel = null;

// ----------------------
// Initialize GPT4All model once
// ----------------------
export async function initGPT4All() {
  if (!gptModel) {
    const modelPath = await downloadModel(MODEL_NAME);
    gptModel = await loadModel(modelPath);
    console.log(`[GPT4All] Model loaded: ${MODEL_NAME}`);
  }
  return gptModel;
}

// ----------------------
// Fallback response generator
// ----------------------
function fallbackResponse(product, vars) {
  const { currentPrice, floor, buyerOffer } = vars;
  let finalPrice = Math.max(buyerOffer || 0, floor, currentPrice * 0.95);
  const status = buyerOffer && finalPrice >= floor ? "accepted" : "counter";

  return {
    reply: `The best offer I can provide for ${product.name} is $${finalPrice.toFixed(2)}.`,
    negotiateFinalPrice: finalPrice,
    status,
    quantityConsidered: 1,
    isFallback: true,
  };
}

// ----------------------
// Extract buyer offer
// ----------------------
function extractOffer(message) {
  if (!message) return null;
  const matches = message.match(/\$?\d+(?:\.\d{1,2})?/g);
  if (!matches) return null;
  return Math.max(...matches.map(m => parseFloat(m.replace("$", ""))));
}

// ----------------------
// Generate AI negotiation response
// ----------------------
export async function generateNegotiationResponse(product, userMessage, conversationHistory = []) {
  const model = await initGPT4All();

  const currentPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const floor = product?.minAcceptablePrice ?? currentPrice;

  const buyerOffer = extractOffer(userMessage);
  const vars = { currentPrice, floor, buyerOffer };

  const lastHistory = (conversationHistory.slice(-4) || [])
    .map(msg => `${(msg?.from || "USER").toUpperCase()}: ${msg?.text || msg?.content || ""}`)
    .join("\n");

  const prompt = `
You are a seller negotiation assistant. Respond ONLY in JSON:
{
  "reply": "string",
  "negotiateFinalPrice": number,
  "status": "accepted" | "counter" | "rejected" | "pending",
  "quantityConsidered": number
}

RULES:
- MIN_PRICE ${floor} must NOT be crossed.
- If BUYER_OFFER >= MIN_PRICE → "accepted", else "counter".

PRODUCT: ${product.name}
PRICE: ${currentPrice}
MIN_PRICE: ${floor}
BUYER_OFFER: ${buyerOffer !== null ? buyerOffer : "None"}

HISTORY:
${lastHistory}

USER_MESSAGE: "${userMessage}"
`;

  try {
    const rawResponse = await model.prompt(prompt);

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallbackResponse(product, vars);

    const aiResp = JSON.parse(jsonMatch[0]);

    if (!aiResp.negotiateFinalPrice || aiResp.negotiateFinalPrice < floor) {
      return fallbackResponse(product, vars);
    }

    if (!aiResp.reply || typeof aiResp.reply !== "string") {
      aiResp.reply = `The best I can offer is $${aiResp.negotiateFinalPrice.toFixed(2)}.`;
    }

    if (!aiResp.status || !["accepted", "counter", "rejected", "pending"].includes(aiResp.status)) {
      aiResp.status = aiResp.negotiateFinalPrice >= floor ? "accepted" : "counter";
    }

    if (typeof aiResp.quantityConsidered !== "number") aiResp.quantityConsidered = 1;

    return aiResp;
  } catch (err) {
    console.error("[GPT4All] AI fallback triggered:", err.message);
    return fallbackResponse(product, vars);
  }
}
