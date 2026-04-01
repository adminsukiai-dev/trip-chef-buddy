type Msg = { role: "user" | "assistant"; content: string };

export async function streamGrocerChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}) {
  const CHAT_URL = `${import.meta.env.VITE_GG_API_URL || "https://api2.gardengrocer.com/api"}/suki/chat`;

  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        onError("Too many requests — please wait a moment and try again.");
        return;
      }
      onError("Something went wrong — please try again.");
      return;
    }

    const data = await resp.json();
    const text = data.content || data.message || "I'm here to help! What can I assist you with?";

    // Simulate typing effect by sending chunks
    const words = text.split(" ");
    let accumulated = "";
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? "" : " ") + words[i];
      accumulated += chunk;
      onDelta(chunk);
      // Small delay for typing effect
      await new Promise(r => setTimeout(r, 20));
    }

    onDone(accumulated);
  } catch {
    onError("Network error — please check your connection.");
  }
}

/**
 * Extract product IDs from the AI response.
 * The AI includes them as: [PRODUCTS: 1,3,8,19]
 */
export function extractProductIds(text: string): string[] {
  const match = text.match(/\[PRODUCTS:\s*([^\]]+)\]/);
  if (!match) return [];
  return match[1].split(",").map(s => s.trim()).filter(Boolean);
}

/**
 * Strip the [PRODUCTS: ...] tag from displayed text.
 */
export function stripProductTag(text: string): string {
  return text.replace(/\[PRODUCTS:\s*[^\]]+\]\s*/g, "").trim();
}
