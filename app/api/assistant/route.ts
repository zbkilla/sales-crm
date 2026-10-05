import Anthropic from "@anthropic-ai/sdk";
import { SITE_NAME } from "@/lib/seo";

const MODEL = "claude-opus-5-5";
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 8000;
const MAX_BOOK_CHARS = 400_000;

const INSTRUCTIONS = `You are the book assistant inside ${SITE_NAME}, a CRM used by a registered investment advisor (RIA) firm. You help advisors and client service associates understand and act on their book of business.

The advisor's current book is provided below as JSON inside <book> tags. It lists every household (clients, prospects and past clients) with members, custodian and held-away accounts, AUM, review and touchpoint status, opportunities and recent meeting summaries, plus open tasks, active projects and upcoming meetings. Treat it as the single source of truth and the "today" field as the current date.

How to answer:
- Ground every figure, date and name in the book data. If the data does not contain the answer, say so plainly rather than estimating.
- AUM counts only custodian accounts; held-away (manual) accounts are excluded. Review and touchpoint statuses are already computed for you.
- When asked to draft client communication, write it ready to send, in a warm, professional advisor voice, and keep it compliant: no performance promises, guarantees or specific security recommendations.
- You cannot change records yet. If asked to log a review, create a task or move a stage, explain where in the app to do it (Reviews, Tasks, Opportunities, or the household detail panel).
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
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return jsonError(
      403,
      "forbidden",
      "Cross-origin requests are not allowed.",
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
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

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
