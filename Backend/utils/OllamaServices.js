const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "phi3:mini";
const TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT) || 60000;

// Helper function to parse seller guidelines
function parseSellerGuidelines(guidelines) {
  if (!guidelines) return {};
  const map = {};
  const patterns = [/(\d+)\s*(?:units?|items?)\s*=\s*(\d+)%/gi];
  patterns.forEach((p) => {
    let match;
    while ((match = p.exec(guidelines))) {
      map[parseInt(match[1])] = parseInt(match[2]);
    }
  });
  return map;
}

// Helper function to get quantity discount
function getQuantityDiscount(quantity, discountMap) {
  const keys = Object.keys(discountMap)
    .map(Number)
    .sort((a, b) => b - a);
  for (const q of keys) {
    if (quantity >= q) {
      return discountMap[q];
    }
  }
  return 0;
}

async function postJSON(url, body, { signal } = {}) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Ollama request timed out");
    }
    throw error;
  }
}

function withTimeout(ms = TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timeoutId) };
}

async function generateAIResponse(prompt, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { signal, clear } = withTimeout();
    try {
      const data = await postJSON(
        `${OLLAMA_HOST}/api/generate`,
        {
          model: MODEL,
          prompt,
          stream: false,
        },
        { signal }
      );

      clear();
      return data.response || data.generated_text;
    } catch (err) {
      clear();
      console.error(`AI generation attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw new Error("AI service is unavailable.");
      await new Promise((res) => setTimeout(res, 2000 * attempt));
    }
  }
}

export async function generateNegotiationResponse(product, userMessage, conversationHistory = []) {
  // Calculate prices
  const currentPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const floor = product?.minAcceptablePrice || currentPrice;
  
  // Extract buyer offer and quantity
  const buyerOfferMatch = userMessage.match(/\$?\d+(\.\d{1,2})?/g);
const buyerOffer = buyerOfferMatch ? Math.max(...buyerOfferMatch.map(m => parseFloat(m.replace("$", "")))) : null;
 const quantityMatch = userMessage.match(/\b(\d+)\s*(?:units?|pcs?|pieces?)\b/i);
 const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
  
  // Calculate discounts and effective floor
  const discounts = parseSellerGuidelines(product.sellerGuidelines);
  const quantityDiscount = getQuantityDiscount(quantity, discounts);
  const effectiveFloor = Math.max(floor * (1 - quantityDiscount / 100), floor);

  // Store these variables for fallback use
  const fallbackVars = { currentPrice, floor, buyerOffer, quantity, discounts, quantityDiscount, effectiveFloor };

  try {
    // Prepare prompt with last 3 messages
    const historyPrompt = conversationHistory
      .slice(-3)
      .map((msg) => `${msg.from.toUpperCase()}: "${msg.text}"`)
      .join("\n");

    const prompt = `
You are an e-commerce negotiation assistant. Your goal is to negotiate on behalf of the seller.
You must adhere to the seller's rules.
Respond in JSON only with these fields:
- "reply" (string): Your response message
- "negotiateFinalPrice" (number): The final price you're offering
- "status" (string): Either "accepted" or "counter"
- "quantityConsidered" (number): The quantity considered

PRODUCT: ${product.name}
PRICE: ${currentPrice.toFixed(2)}
MIN_PRICE: ${effectiveFloor.toFixed(2)}
QUANTITY: ${quantity}
BUYER_OFFER: ${buyerOffer !== null ? buyerOffer.toFixed(2) : "None"}

RULES:
- Never go below MIN_PRICE.
- If buyer's offer >= MIN_PRICE, status must be "accepted"
- Otherwise, status must be "counter"
- negotiateFinalPrice should be >= MIN_PRICE but < current price

CONVERSATION_HISTORY:
${historyPrompt}

YOUR RESPONSE (JSON ONLY):`;

    const rawResponse = await generateAIResponse(prompt);
    
    // More robust JSON parsing
    let aiResponse;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      
      aiResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError.message);
      throw new Error("Invalid JSON response from AI");
    }
    
    // Validate and sanitize AI response
    if ((aiResponse.negotiateFinalPrice = parseFloat(aiResponse.negotiateFinalPrice)) || effectiveFloor) {
      aiResponse.negotiateFinalPrice = Math.max(buyerOffer || 0, effectiveFloor);
      aiResponse.status = aiResponse.negotiateFinalPrice >= effectiveFloor ? "accepted" : "counter";
      aiResponse.reply = `The best I can offer is $${aiResponse.negotiateFinalPrice.toFixed(2)}.`;
    }
    
    return aiResponse;

  } catch (err) {
    console.error("Error in generateNegotiationResponse:", err.message);
    
    // Use the stored variables for fallback
    const { currentPrice, floor, buyerOffer, quantity, discounts, quantityDiscount, effectiveFloor } = fallbackVars;
    
    // Fallback response logic
    const finalPrice = buyerOffer !== null
      ? Math.max(buyerOffer, effectiveFloor)
      : currentPrice * (1 - quantityDiscount / 100);

    const status = buyerOffer !== null && buyerOffer >= effectiveFloor ? "accepted" : "counter";

    return {
      reply: `Thank you for your interest. ${
        status === "accepted"
          ? `I accept your offer of $${finalPrice.toFixed(2)}!`
          : `The best I can offer for ${quantity} units is $${finalPrice.toFixed(2)}.`
      }`,
      negotiateFinalPrice: parseFloat(finalPrice.toFixed(2)),
      status,
      quantityConsidered: quantity,
    };
  }
}