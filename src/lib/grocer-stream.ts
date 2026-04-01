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

  let resp: Response;
  try {
    resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });
  } catch {
    onError("Network error — please check your connection.");
    return;
  }

  if (!resp.ok) {
    if (resp.status === 429) {
      onError("Too many requests — please wait a moment and try again.");
      return;
    }
    if (resp.status === 402) {
      onError("AI credits exhausted. Please add funds in workspace settings.");
      return;
    }
    onError("Something went wrong — please try again.");
    return;
  }

  if (!resp.body) {
    onError("Empty response from AI.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let fullText = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) {
          fullText += content;
          onDelta(content);
        }
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) {
          fullText += content;
          onDelta(content);
        }
      } catch { /* partial leftover */ }
    }
  }

  onDone(fullText);
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
