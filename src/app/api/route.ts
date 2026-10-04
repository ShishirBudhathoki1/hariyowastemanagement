import { NextResponse } from "next/server";

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1200;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

const SYSTEM_PROMPT = `You are Hariyo's friendly AI chat assistant. Have natural, concise conversations and answer general questions helpfully. For Hariyo-specific questions, use only these facts: Hariyo Waste serves businesses in Itahari with segregated waste collection; bookings are confirmed by the team within one business day; collected waste can be followed using its Batch ID; organic waste is made into compost; compost availability, price, and delivery are confirmed by the team, and this website does not collect payment. Operating hours are Sunday to Friday, 9 AM to 6 PM. Do not invent prices, collection coverage, policies, or order status. If you do not know a Hariyo-specific answer, say so and direct the person to the Contact page. Keep replies brief and conversational.`;

function rateLimited(clientId: string) {
  const now = Date.now();
  for (const [key, value] of requestCounts) {
    if (value.resetAt <= now) requestCounts.delete(key);
  }
  const entry = requestCounts.get(clientId);
  if (!entry || entry.resetAt <= now) {
    requestCounts.set(clientId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: Request) {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const baseUrl = process.env.AI_BASE_URL;
  if (!apiKey || !model || !baseUrl) {
    return NextResponse.json(
      { error: "AI chat is not configured yet. Add AI_BASE_URL, AI_MODEL, and AI_API_KEY to the server environment." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16000) {
    return NextResponse.json({ error: "That conversation is too long. Please start a new message." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid chat request." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Please send a shorter conversation." }, { status: 400 });
  }

  const validMessages = messages.every((message) =>
    message &&
    typeof message === "object" &&
    ["user", "assistant"].includes((message as { role?: string }).role || "") &&
    typeof (message as { content?: unknown }).content === "string" &&
    (message as { content: string }).content.trim().length > 0 &&
    (message as { content: string }).content.length <= MAX_MESSAGE_LENGTH,
  );
  if (!validMessages || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Invalid chat message." }, { status: 400 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientId = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(clientId)) {
    return NextResponse.json({ error: "You have sent several messages. Please wait a few minutes and try again." }, { status: 429 });
  }

  let endpoint: URL;
  try {
    endpoint = new URL(`${baseUrl.replace(/\/+$/, "")}/chat/completions`);
    if (endpoint.protocol !== "https:" && endpoint.hostname !== "localhost" && endpoint.hostname !== "127.0.0.1") {
      throw new Error("AI_BASE_URL must use HTTPS.");
    }
  } catch {
    return NextResponse.json({ error: "AI provider configuration is invalid." }, { status: 500 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const providerResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((message: { role: "user" | "assistant"; content: string }) => ({
            role: message.role,
            content: message.content.trim(),
          })),
        ],
        stream: false,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!providerResponse.ok) {
      const error = providerResponse.status === 401 || providerResponse.status === 403
        ? "The AI provider rejected the API key. Check the key in .env."
        : providerResponse.status === 404
          ? "The AI endpoint or model was not found. Check AI_BASE_URL and AI_MODEL."
          : `The AI provider returned HTTP ${providerResponse.status}. Check the provider settings and try again.`;
      return NextResponse.json({ error }, { status: 502 });
    }

    const result = await providerResponse.json();
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json({ error: "The AI service returned an empty reply. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ reply: reply.trim() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not reach the AI service. Please try again shortly." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}