import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

export function isMockMode() {
  const k = process.env.ANTHROPIC_API_KEY;
  return !k || k === "your_key_here";
}

// Asks Claude and parses a strict JSON reply
export async function askJSON<T>(system: string, user: string): Promise<T> {
  const client = new Anthropic();
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as T;
}
