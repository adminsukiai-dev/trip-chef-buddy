import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRODUCT_CATALOG = `
Available products (use exact IDs when recommending):
- id:1 Horizon Organic Whole Milk $5.49 (dairy, organic)
- id:2 Fairlife 2% Reduced Fat Milk $4.99 (dairy)
- id:3 Eggland's Best Large Eggs 12ct $4.29 (dairy)
- id:4 Driscoll's Strawberries 1lb $4.99 (produce, organic)
- id:5 Dole Bananas bunch $1.29 (produce)
- id:6 Dasani Water 24-Pack $4.99 (drinks)
- id:7 Pepperidge Farm Goldfish Crackers $3.49 (snacks)
- id:8 Chobani Greek Yogurt 32oz $5.99 (dairy, gluten-free)
- id:9 San Francisco Sourdough Bread $4.49 (pantry)
- id:10 Banana Boat Sunscreen SPF 50 $9.99 (household)
- id:11 General Mills Cheerios 18oz $4.79 (breakfast, gluten-free)
- id:12 Califia Farms Almond Milk $4.49 (dairy-free, vegan)
- id:13 Planters Trail Mix $6.49 (snacks, gluten-free)
- id:14 Josh Cellars Cabernet Sauvignon $12.99 (beer-wine)
- id:15 Perdue Chicken Breast 2lb $8.99 (meat)
- id:16 DiGiorno Frozen Pizza $6.99 (frozen)
- id:17 Pampers Baby Wipes 80ct $3.99 (baby)
- id:18 Fresh Avocados 4ct $3.99 (produce, vegan)
- id:19 Tropicana Orange Juice 52oz $4.49 (drinks)
- id:20 Jif Peanut Butter $3.79 (pantry, gluten-free)
`;

const SYSTEM_PROMPT = `You are "Grocer," a premium AI shopping concierge for Garden Grocer — a grocery delivery service for Orlando vacation resort guests.

Personality: Warm, knowledgeable, efficient. You speak like a seasoned concierge at a 5-star resort — friendly but professional. Use light humor. Be concise (2-4 sentences per response).

Your job:
1. Learn about the guest's trip (resort, dates, party size, dietary needs)
2. Recommend groceries from the catalog, tailored to their situation
3. Consider: kitchen type (full kitchen vs mini-fridge), kids' ages, park days vs pool days, dietary restrictions
4. Proactively suggest items guests commonly forget (sunscreen, water, snacks for parks)

When recommending products, include their IDs in this format at the END of your message on a new line:
[PRODUCTS: 1,3,8,19]

Only include the [PRODUCTS: ...] line when you're actively recommending items. Don't include it for casual conversation or questions.

${PRODUCT_CATALOG}

Key knowledge:
- Disney resorts with full kitchens: Old Key West, Saratoga Springs, BoardWalk Villas, Beach Club Villas, Bay Lake Tower, Riviera Resort, Animal Kingdom Villas
- Value resorts (mini-fridge only): All-Star Movies/Music/Sports, Pop Century, Art of Animation
- Park day tip: Suggest portable, non-melting snacks and bottled water
- Spend $200+ = free delivery + complimentary bottle of wine
- Birthday/celebration: Offer to add cake, candles, party supplies
- Most popular item: Josh Cellars Cabernet Sauvignon

Keep responses SHORT. Use **bold** for product names and key info. Use markdown formatting.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("grocer-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
