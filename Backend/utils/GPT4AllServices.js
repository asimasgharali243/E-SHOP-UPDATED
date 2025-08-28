// utils/GPT4AllNegotiation.js
import pkg from "gpt4all";
const { loadModel, downloadModel } = pkg; // latest API uses functions

const MODEL_NAME = process.env.GPT4ALL_MODEL || "phi-3-mini-instruct";
let model = null;

// Initialize GPT4All model
async function initModel() {
  if (!model) {
    // download model if not present
    const modelPath = await downloadModel(MODEL_NAME);
    model = await loadModel(modelPath);
  }
  return model;
}

// Fallback response if AI fails
function fallback(product, userMessage, vars) {
  const { currentPrice, floor, buyerOffer } = vars;
  const finalPrice = Math.max(buyerOffer || 0, floor, currentPrice * 0.95);
  return {
    reply: `The best offer I can provide for ${product.name} is $${finalPrice.toFixed(2)}.`,
    negotiateFinalPrice: finalPrice,
    status: buyerOffer && finalPrice >= floor ? "accepted" : "counter",
    quantityConsidered: 1,
  };
}

// Generate AI negotiation response
export async function generateNegotiationResponse(product, userMessage, conversationHistory = []) {
  const currentPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const floor = product?.minAcceptablePrice ?? currentPrice;

  const buyerOffer = Math.max(
    ...(userMessage.match(/\$?\d+(?:\.\d{1,2})?/g)?.map(m => parseFloat(m.replace("$", ""))) || [0])
  ) || null;

  const vars = { currentPrice, floor, buyerOffer };

  const lastHistory = (conversationHistory.slice(-4) || [])
    .map(msg => `${(msg?.from || "USER").toUpperCase()}: ${msg?.text || msg?.content || ""}`)
    .join("\n");

  const prompt = `
You are a seller negotiation assistant. Reply in JSON only:
- reply (string)
- negotiateFinalPrice (number)
- status ("accepted", "counter", "rejected", "pending")

PRODUCT: ${product.name}
PRICE: ${currentPrice.toFixed(2)}
MIN_PRICE: ${floor.toFixed(2)}
BUYER_OFFER: ${buyerOffer !== null ? buyerOffer.toFixed(2) : "None"}
RULES: MIN_PRICE must not be crossed. If BUYER_OFFER >= MIN_PRICE → accepted, else counter.

HISTORY:
${lastHistory}

USER_MESSAGE: "${userMessage}"
`;

  try {
    const gpt = await initModel();
    const raw = await gpt.prompt(prompt); // use loaded model's prompt method
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return fallback(product, userMessage, vars);

    const aiResp = JSON.parse(jsonMatch[0]);

    if (!aiResp.negotiateFinalPrice || aiResp.negotiateFinalPrice < floor) {
      return fallback(product, userMessage, vars);
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
    console.error("AI fallback:", err.message);
    return fallback(product, userMessage, vars);
  }
}
