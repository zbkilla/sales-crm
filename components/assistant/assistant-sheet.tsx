"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Button from "@/components/_ui/button";
import { Kbd } from "@/components/_ui/command";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import { buildBookSnapshot } from "@/lib/book-snapshot";
import { cn } from "@/lib/utils";
import { useHouseholdsStore } from "@/stores/households-store";
import MessageQuestionIcon from "@/public/assets/images/households/sidebar/message-question.svg";
import XIcon from "@/public/assets/images/households/detail/x.svg";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
};

const SUGGESTIONS = [
  "Which clients are overdue for a review, and what should I prioritize this week?",
  "Brief me on the Reyes household before their review on Oct 15.",
  "Who has RMD or retirement planning needs in the next year?",
  "Draft a warm check-in email to Victor and Helen Morales to book their review.",
];

export default function AssistantSheet() {
  const open = useHouseholdsStore((state) => state.assistantOpen);
  const setOpen = useHouseholdsStore((state) => state.setAssistantOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key.toLowerCase() !== "j") return;
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return;
      }
      event.preventDefault();
      const { assistantOpen, setAssistantOpen } = useHouseholdsStore.getState();
      setAssistantOpen(!assistantOpen);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function updateLast(update: (message: ChatMessage) => ChatMessage) {
    setMessages((current) => [
      ...current.slice(0, -1),
      update(current[current.length - 1]),
    ]);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;

    const history = [
      ...messages.filter((message) => !message.error),
      { role: "user" as const, content },
    ];
    setMessages([
      ...messages,
      { role: "user", content },
      { role: "assistant", content: "" },
    ]);
    setDraft("");
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const { households, tasks, projects, upcomingMeetings } =
      useHouseholdsStore.getState();

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content: body }) => ({
            role,
            content: body,
          })),
          book: buildBookSnapshot({
            households,
            tasks,
            projects,
            upcomingMeetings,
          }),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const detail = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        updateLast((message) => ({
          ...message,
          content: detail?.message ?? "The assistant is unavailable right now.",
          error: true,
        }));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        updateLast((message) => ({
          ...message,
          content: message.content + chunk,
        }));
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        updateLast((message) => ({
          ...message,
          content: message.content || "The assistant could not be reached.",
          error: !message.content,
        }));
      }
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void send(draft);
    }
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setPending(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="sm:w-[480px] sm:max-w-[480px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <MessageQuestionIcon aria-hidden className="text-icon size-3.5" />
            <SheetTitle>Book chat</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Ask questions about your households, reviews, pipeline, tasks and
            meetings
          </SheetDescription>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearChat}>
                New chat
              </Button>
            )}
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="-mr-1"
                aria-label="Close book chat"
              >
                <XIcon aria-hidden className="text-foreground size-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-4 p-5" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2>Ask about your book</h2>
                  <p className="text-soft">
                    Answers come from the live households, reviews, pipeline,
                    tasks and meetings in this workspace.
                  </p>
                </div>
                <ul className="flex flex-col gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <li key={suggestion}>
                      <Button
                        variant="item"
                        size="md"
                        onClick={() => void send(suggestion)}
                        className="border-line-strong border px-3 py-2.5"
                      >
                        {suggestion}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <p
                    className={cn(
                      "max-w-[90%] rounded-xl px-3.5 py-2.5 whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-muted text-foreground"
                        : "text-foreground",
                      message.error &&
                        "border-danger/40 text-danger border bg-transparent",
                    )}
                  >
                    {message.content ||
                      (pending && index === messages.length - 1 ? (
                        <span className="text-subtle">Reading your book…</span>
                      ) : null)}
                  </p>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="border-line-strong flex flex-col gap-2 border-t p-4"
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            maxLength={8000}
            placeholder="Ask about a household, reviews, pipeline or tasks…"
            aria-label="Message the book assistant"
            className="border-line-strong bg-secondary text-foreground placeholder:text-subtle focus-visible:border-ring ease-power3-out w-full resize-none rounded-lg border px-3 py-2.5 text-[14px] transition-[border-color] duration-150 outline-none"
          />
          <div className="caption-style text-subtle flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd> send · <Kbd>⇧</Kbd>
              <Kbd>↵</Kbd> new line
            </span>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={pending || !draft.trim()}
            >
              {pending ? "Thinking…" : "Send"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
