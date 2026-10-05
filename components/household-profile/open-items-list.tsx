import Tag from "@/components/_ui/tag";
import type { OpenItem, OpenItemSeverity } from "@/lib/open-items";

const SEVERITY: Record<
  OpenItemSeverity,
  { label: string; tone: "red" | "amber" | "neutral" }
> = {
  critical: { label: "Critical", tone: "red" },
  attention: { label: "Attention", tone: "amber" },
  info: { label: "Info", tone: "neutral" },
};

type OpenItemsListProps = {
  items: OpenItem[];
};

export default function OpenItemsList({ items }: OpenItemsListProps) {
  if (items.length === 0) {
    return (
      <p className="caption-style text-subtle">
        Nothing flagged. Records are current and complete.
      </p>
    );
  }

  return (
    <ul className="divide-line-strong grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 divide-y">
      {items.map((item) => (
        <li
          key={item.id}
          className="col-span-2 grid grid-cols-subgrid items-start py-2.5 first:pt-0 last:pb-0"
        >
          <Tag
            tone={SEVERITY[item.severity].tone}
            size="sm"
            className="mt-px justify-self-start"
          >
            {SEVERITY[item.severity].label}
          </Tag>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span>{item.title}</span>
            <span className="caption-style text-subtle">{item.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
