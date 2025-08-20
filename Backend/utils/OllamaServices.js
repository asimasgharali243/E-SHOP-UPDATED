const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "phi3:mini";

console.log("Using Ollama model:", MODEL, OLLAMA_HOST);

async function testOllamaConnection() {
  try {
    console.log("Testing Ollama connection...");
    const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Ollama connection successful! Available models:", data.models.map(m => m.name));
    return true;
  } catch (error) {
    console.error("❌ Ollama connection FAILED:", error.message);
    return false;
  }
}

testOllamaConnection();

async function postJSON(url, body, { signal } = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama ${res.status} ${res.statusText} ${text}`);
  }
  
  return res.json();
}

function withTimeout(ms = 120000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

export async function generateResponse(prompt, model = MODEL, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { signal, clear } = withTimeout(120000);
    
    try {
      console.log(`Attempt ${attempt} to generate response with ${model}...`);
      
      const url = `${OLLAMA_HOST}/api/generate`;
      const data = await postJSON(
        url,
        { model, prompt, stream: false },
        { signal }
      );
      
      console.log(`✅ Successfully generated response on attempt ${attempt}`);
      
      if (data?.response) return data.response;
      if (data?.generated_text) return data.generated_text;
      
      return JSON.stringify(data);
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      
      if (attempt === retries) {
        console.error("All attempts failed for model:", model);
        return JSON.stringify({
          reply: "I'm having trouble generating a response. Please try again.",
          negotiateFinalPrice: null
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
    } finally {
      clear();
    }
  }
}

export async function generateNegotiationResponse(product, userMessage, negotiationHistory = []) {
  // Calculate pricing
  let currentPrice = Number(product.price) || 0;
  if (product.discount && product.discount > 0) {
    currentPrice = Math.round((currentPrice * (1 - product.discount / 100)) * 100) / 100;
  }

  let floor = product.minAcceptablePrice !== undefined && product.minAcceptablePrice !== null 
    ? Number(product.minAcceptablePrice)
    : Math.round(currentPrice * 0.7 * 100) / 100;
  
  floor = product.discount ? Math.min(floor, currentPrice) : floor;
  console.log("Pricing thresholds - Current:", currentPrice, "Floor:", floor);

  // Extract buyer's offer
  const priceMatches = userMessage.match(/\$?(\d+(?:\.\d{2})?)/g);
  let buyerOffer = null;
  
  if (priceMatches) {
    const offers = priceMatches.map(m => parseFloat(m.replace(/\$/g, '')));
    buyerOffer = Math.max(...offers);
    console.log("Detected buyer offer:", buyerOffer);
  }

  // Determine final price logic
  let finalPrice = null;
  
  if (buyerOffer !== null) {
    if (buyerOffer >= floor) {
      finalPrice = buyerOffer;
    } else {
      finalPrice = Math.max(floor, Math.round(currentPrice * 0.85));
    }
  } else {
    finalPrice = Math.max(floor, Math.round(currentPrice * 0.85));
  }

  // STRICT PROMPT WITH JSON FORMAT REQUIREMENT
  const prompt = `
ROLE: E-commerce negotiation assistant
PRODUCT: ${product.name}
CURRENT PRICE: $${currentPrice.toFixed(2)}
MINIMUM PRICE: $${floor.toFixed(2)}
${buyerOffer !== null ? `BUYER OFFER: $${buyerOffer.toFixed(2)}` : 'NO OFFER DETECTED'}

STRICT RULES:
1. NEVER go below $${floor.toFixed(2)}
2. RESPONSE MUST BE VALID JSON ONLY - NO OTHER TEXT
3. If buyer offer >= minimum, set negotiateFinalPrice to their offer
4. If buyer offer too low, set negotiateFinalPrice to counter offer (>= minimum)
5. negotiateFinalPrice is ONLY for tracking - not final until both agree

REQUIRED JSON FORMAT:
{
  "reply": "Your response message here",
  "negotiateFinalPrice": ${finalPrice.toFixed(2)}
}

BUYER: "${userMessage}"

YOUR JSON RESPONSE (ONLY JSON, NO OTHER TEXT):
`;

  console.log("Negotiation prompt sent to AI");

  try {
    let response = await generateResponse(prompt, MODEL);
    console.log("Raw AI response:", response);

    // PARSE JSON RESPONSE
    let aiResponse;
    try {
      // Extract JSON from response (in case AI adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Fallback to structured response
      aiResponse = {
        reply: `Thank you for your interest. The best I can offer is $${finalPrice.toFixed(2)}.`,
        negotiateFinalPrice: finalPrice
      };
    }

    // VALIDATE RESPONSE
    if (typeof aiResponse !== 'object' || !aiResponse.reply || aiResponse.negotiateFinalPrice === undefined) {
      console.error("Invalid AI response structure:", aiResponse);
      aiResponse = {
        reply: `I can offer $${finalPrice.toFixed(2)} for ${product.name}.`,
        negotiateFinalPrice: finalPrice
      };
    }

    // ENSURE PRICE IS WITHIN BOUNDS
    const suggestedPrice = Number(aiResponse.negotiateFinalPrice);
    if (isNaN(suggestedPrice) || suggestedPrice < floor) {
      console.warn(`AI suggested invalid price: ${suggestedPrice}. Using calculated price: ${finalPrice}`);
      aiResponse.negotiateFinalPrice = finalPrice;
      
      // Update reply to match corrected price
      if (buyerOffer !== null && buyerOffer >= floor) {
        aiResponse.reply = `I accept your offer of $${finalPrice.toFixed(2)}! Let's proceed.`;
      } else {
        aiResponse.reply = `Thank you for your interest. The best I can offer is $${finalPrice.toFixed(2)}.`;
      }
    }

    console.log("Processed AI response:", aiResponse);
    return aiResponse;

  } catch (error) {
    console.error("generateNegotiationResponse error:", error);
    
    // Fallback response
    return {
      reply: `Thank you for your interest. The best I can offer is $${finalPrice.toFixed(2)}.`,
      negotiateFinalPrice: finalPrice
    };
  }
}