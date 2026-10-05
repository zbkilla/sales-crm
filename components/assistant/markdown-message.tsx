"use client";

import type { ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "@/components/_ui/button";
import { cn } from "@/lib/utils";
import { useHouseholdsStore } from "@/stores/households-store";

const REQUEST_LINK = /(^|[^\w[#-])SR-(\d{4})(?![\w\]])/g;
const REQUEST_HREF = "#service-request-";

function linkServiceRequests(markdown: string) {
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`)/)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part.replace(
            REQUEST_LINK,
            (_, lead: string, number: string) =>
              `${lead}[SR-${number}](${REQUEST_HREF}${number})`,
          ),
    )
    .join("");
}

function domProps<T extends object>(props: T): Omit<T, "node"> {
  const rest = { ...props } as T & { node?: unknown };
  delete rest.node;
  return rest;
}

function Heading({ className, ...props }: ComponentProps<"h4">) {
  return (
    <h4
      className={cn("text-foreground mt-4 mb-1.5 first:mt-0", className)}
      {...domProps(props)}
    />
  );
}

function RequestLink({ number }: { number: string }) {
  const openRequest = useHouseholdsStore((state) => state.openRequest);
  const request = useHouseholdsStore((state) =>
    state.serviceRequests.find((item) => String(item.number) === number),
  );
  if (!request) return <span>SR-{number}</span>;
  return (
    <Button
      variant="link"
      size="none"
      onClick={() => openRequest(request.id)}
      className="text-foreground decoration-subtle inline font-medium"
    >
      SR-{number}
    </Button>
  );
}

const SAFE_PROTOCOL = /^(https?:|mailto:)/i;

function safeUrl(url: string) {
  if (url.startsWith(REQUEST_HREF)) return url;
  return SAFE_PROTOCOL.test(url.trim()) ? url : "";
}

const COMPONENTS: Components = {
  img: ({ alt }) => (alt ? <span className="text-soft">[{alt}]</span> : null),
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  h5: Heading,
  h6: Heading,
  p: (props) => (
    <p
      className="my-2 leading-[1.5] first:mt-0 last:mb-0"
      {...domProps(props)}
    />
  ),
  ul: (props) => (
    <ul
      className="marker:text-subtle my-2 flex list-disc flex-col gap-1 pl-5 first:mt-0 last:mb-0"
      {...domProps(props)}
    />
  ),
  ol: (props) => (
    <ol
      className="marker:text-subtle my-2 flex list-decimal flex-col gap-1 pl-5 first:mt-0 last:mb-0"
      {...domProps(props)}
    />
  ),
  li: (props) => (
    <li
      className="text-[14px] leading-[1.5] [&>ol]:my-1 [&>ul]:my-1"
      {...domProps(props)}
    />
  ),
  strong: (props) => (
    <strong className="text-foreground font-semibold" {...domProps(props)} />
  ),
  em: (props) => <em className="italic" {...domProps(props)} />,
  a: ({ href, children, ...props }) => {
    if (href?.startsWith(REQUEST_HREF)) {
      return <RequestLink number={href.slice(REQUEST_HREF.length)} />;
    }
    if (!href) return <span>{children}</span>;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground decoration-subtle hover:decoration-foreground underline underline-offset-2"
        {...domProps(props)}
      >
        {children}
      </a>
    );
  },
  blockquote: (props) => (
    <blockquote
      className="border-line-strong text-soft my-2 border-l-2 pl-3"
      {...domProps(props)}
    />
  ),
  hr: () => <hr className="border-line-strong my-4" />,
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded bg-white/8 px-1 py-px font-mono text-[13px]",
        className,
      )}
      {...domProps(props)}
    />
  ),
  pre: (props) => (
    <pre
      className="border-line-strong my-2 overflow-x-auto rounded-lg border bg-black/30 p-3 font-mono text-[13px] leading-[1.5] [&_code]:bg-transparent [&_code]:p-0"
      {...domProps(props)}
    />
  ),
  table: (props) => (
    <div className="border-line-strong my-2 overflow-x-auto rounded-lg border">
      <table
        className="w-full border-collapse text-[13px]"
        {...domProps(props)}
      />
    </div>
  ),
  thead: (props) => (
    <thead className="text-subtle bg-white/3" {...domProps(props)} />
  ),
  th: (props) => (
    <th
      className="px-2.5 py-2 text-left font-normal whitespace-nowrap"
      {...domProps(props)}
    />
  ),
  td: (props) => (
    <td
      className="border-line-strong border-t px-2.5 py-2 align-top tabular-nums"
      {...domProps(props)}
    />
  ),
};

type MarkdownMessageProps = {
  content: string;
};

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="text-foreground min-w-0 text-[14px] [overflow-wrap:anywhere]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={COMPONENTS}
        urlTransform={safeUrl}
      >
        {linkServiceRequests(content)}
      </ReactMarkdown>
    </div>
  );
}
