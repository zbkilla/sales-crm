import Anthropic from "@anthropic-ai/sdk";
import { AcpSetupError, streamViaAcp } from "@/lib/assistant/acp-provider";
import { SITE_NAME } from "@/lib/seo";

const MODEL = "claude-opus-5-5";
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 8000;
const MAX_BOOK_CHARS = 400_000;
const MAX_BODY_BYTES = 512_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const PER_CLIENT_MAX_REQUESTS = 20;
const GLOBAL_MAX_REQUESTS = 60;
const MAX_TRACKED_CLIENTS = 2000;
const GLOBAL_KEY = "__global__";

const requestLog = new Map<string, number[]>();

function recentRequests(key: string, now: number) {
  return (requestLog.get(key) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );
}

function pruneRequestLog(now: number) {
  for (const [key, times] of requestLog) {
    if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
      requestLog.delete(key);
    }
  }
}

function rateLimited(clientKey: string | null) {
  const now = Date.now();
  const global = recentRequests(GLOBAL_KEY, now);
  if (global.length >= GLOBAL_MAX_REQUESTS) return true;

  if (clientKey) {
    if (!requestLog.has(clientKey) && requestLog.size >= MAX_TRACKED_CLIENTS) {
      pruneRequestLog(now);
      if (requestLog.size >= MAX_TRACKED_CLIENTS) return true;
    }
    const client = recentRequests(clientKey, now);
    if (client.length >= PER_CLIENT_MAX_REQUESTS) {
      requestLog.set(clientKey, client);
      return true;
    }
    requestLog.set(clientKey, [...client, now]);
  }

  requestLog.set(GLOBAL_KEY, [...global, now]);
  return false;
}

function trustedClientKey(request: Request) {
  if (process.env.TRUST_PROXY !== "true") return null;
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

async function readLimitedBody(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

type AssistantProvider = "acp" | "api";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

function isLoopbackHost(host: string | null) {
  if (!host) return false;
  const name = host.startsWith("[")
    ? host.slice(0, host.indexOf("]") + 1)
    : host.split(":")[0];
  return LOOPBACK_HOSTS.has(name.toLowerCase());
}

function assistantProvider(): AssistantProvider {
  const configured = process.env.ASSISTANT_PROVIDER?.trim().toLowerCase();
  if (configured === "acp" || configured === "api") return configured;
  return process.env.ANTHROPIC_API_KEY ? "api" : "acp";
}

function transcriptPrompt(messages: ChatMessage[]) {
  if (messages.length === 1) return messages[0].content;
  const history = messages
    .slice(0, -1)
    .map(
      (message) =>
        `${message.role === "user" ? "Advisor" : "Assistant"}: ${message.content}`,
    )
    .join("\n\n");
  return `Conversation so far:\n\n${history}\n\nAdvisor's new message:\n${messages[messages.length - 1].content}`;
}

function assistantEnabled() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ASSISTANT_ENABLED === "true"
  );
}

const INSTRUCTIONS = `You are the book assistant inside ${SITE_NAME}, a CRM used by a registered investment advisor (RIA) firm. You help advisors and client service associates understand and act on their book of business.

The advisor's current book is provided below as JSON inside <book> tags. It lists every household (clients, prospects and past clients) with members, custodian and held-away accounts, AUM, an eMoney-style balance sheet (net worth, assets by category, liabilities, out-of-estate entities), insurance, goals, estate documents, open items, review and touchpoint status, opportunities and recent meeting summaries, plus open tasks, open service requests (standardized workflows such as account opening, money movement, ACATs, rollovers and beneficiary changes, with status, current step and SLA) and upcoming meetings. Treat it as the single source of truth and the "today" field as the current date.

How to answer:
- Ground every figure, date and name in the book data. If the data does not contain the answer, say so plainly rather than estimating.
- AUM counts only custodian accounts; held-away (manual) accounts are excluded. Review and touchpoint statuses are already computed for you.
- When asked to draft client communication, write it ready to send, in a warm, professional advisor voice, and keep it compliant: no performance promises, guarantees or specific security recommendations.
- You cannot change records yet. If asked to log a review, create a task or move a stage, explain where in the app to do it (Reviews, Tasks, Service requests, Opportunities, or the household page).
- Format for a narrow chat panel: plain text, short paragraphs, and simple "- " bullet lists. Do not use markdown headings, tables, bold or code blocks.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.length > 0 &&
    content.length <= MAX_MESSAGE_CHARS
  );
}

function jsonError(status: number, error: string, message: string) {
  return Response.json({ error, message }, { status });
}

function errorResponse(error: unknown) {
  if (error instanceof Anthropic.AuthenticationError) {
    return jsonError(
      503,
      "not_configured",
      "The Anthropic API key was rejected. Update ANTHROPIC_API_KEY in .env.local and restart the dev server.",
    );
  }
  if (error instanceof Anthropic.PermissionDeniedError) {
    return jsonError(
      503,
      "not_configured",
      "The Anthropic API key does not have access to this model.",
    );
  }
  if (error instanceof Anthropic.RateLimitError) {
    return jsonError(
      429,
      "rate_limited",
      "The assistant is busy. Try again in a moment.",
    );
  }
  if (error instanceof Anthropic.APIError) {
    console.error("Assistant API error", error.status, error.message);
    return jsonError(
      502,
      "upstream_error",
      "The assistant could not reach Claude. Try again.",
    );
  }
  console.error("Assistant setup error", error);
  return jsonError(
    503,
    "not_configured",
    "The assistant is not configured. Set ANTHROPIC_API_KEY in .env.local and restart the dev server.",
  );
}

export async function POST(request: Request) {
  if (!assistantEnabled()) {
    return jsonError(
      503,
      "disabled",
      "The assistant is disabled in production. Set ASSISTANT_ENABLED=true only behind authentication.",
    );
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  let sameOrigin = false;
  try {
    sameOrigin = Boolean(origin && host && new URL(origin).host === host);
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) {
    return jsonError(403, "forbidden", "Requests must come from this app.");
  }

  if (rateLimited(trustedClientKey(request))) {
    return jsonError(
      429,
      "rate_limited",
      "Too many assistant requests. Try again in a few minutes.",
    );
  }

  const rawBody = await readLimitedBody(request);
  if (rawBody === null) {
    return jsonError(413, "body_too_large", "The request is too large.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonError(400, "invalid_json", "Request body must be JSON.");
  }

  const { messages, book } = (payload ?? {}) as {
    messages?: unknown;
    book?: unknown;
  };
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    !messages.every(isChatMessage) ||
    messages[0].role !== "user" ||
    messages[messages.length - 1].role !== "user"
  ) {
    return jsonError(
      400,
      "invalid_messages",
      "Messages must alternate and end with a user turn.",
    );
  }
  const bookJson = JSON.stringify(book ?? null);
  if (bookJson.length > MAX_BOOK_CHARS) {
    return jsonError(
      413,
      "book_too_large",
      "The book snapshot is too large to send.",
    );
  }

  const provider = assistantProvider();
  let body: ReadableStream<Uint8Array>;
  if (provider === "acp") {
    if (!isLoopbackHost(host)) {
      return jsonError(
        403,
        "forbidden",
        "The Claude subscription provider only answers requests to localhost.",
      );
    }
    if (process.env.NODE_ENV === "production") {
      return jsonError(
        503,
        "disabled",
        "The Claude subscription provider is for local use only. Configure ANTHROPIC_API_KEY for deployed environments.",
      );
    }
    try {
      body = await streamViaAcp({
        systemPrompt: `${INSTRUCTIONS}\n\n<book>\n${bookJson}\n</book>`,
        prompt: transcriptPrompt(messages),
        model: process.env.ASSISTANT_ACP_MODEL?.trim() || "opus",
      });
    } catch (error) {
      if (error instanceof AcpSetupError) {
        return jsonError(503, error.code, error.message);
      }
      console.error("Assistant ACP error", error);
      return jsonError(
        502,
        "upstream_error",
        "The assistant could not start. Try again.",
      );
    }
  } else {
    const result = await streamViaApi(bookJson, messages);
    if (result instanceof Response) return result;
    body = result;
  }

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-assistant-provider": provider,
    },
  });
}

async function streamViaApi(
  bookJson: string,
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array> | Response> {
  let stream: ReturnType<Anthropic["beta"]["messages"]["stream"]>;
  let iterator: AsyncIterator<Anthropic.Beta.Messages.BetaRawMessageStreamEvent>;
  let first: IteratorResult<Anthropic.Beta.Messages.BetaRawMessageStreamEvent>;
  try {
    const client = new Anthropic();
    stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: [
        { type: "text", text: INSTRUCTIONS },
        {
          type: "text",
          text: `<book>\n${bookJson}\n</book>`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });
    iterator = stream[Symbol.asyncIterator]();
    first = await iterator.next();
  } catch (error) {
    return errorResponse(error);
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (
        event: Anthropic.Beta.Messages.BetaRawMessageStreamEvent,
      ) => {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      };
      try {
        if (!first.done) emit(first.value);
        for (;;) {
          const next = await iterator.next();
          if (next.done) break;
          emit(next.value);
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\nThe assistant declined to answer this request.",
            ),
          );
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(
            encoder.encode("\n\n(Response cut off at the length limit.)"),
          );
        }
      } catch (error) {
        console.error("Assistant stream error", error);
        controller.enqueue(
          encoder.encode("\n\n(The response was interrupted. Try again.)"),
        );
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return body;
}
