import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import HouseholdMark from "@/components/_common/household-mark";
import { advisorByName, type Household, type TagTone } from "@/data/households";
import type { Notification, NotificationKind } from "@/data/notifications";

type NotificationItemProps = {
  notification: Notification;
  household?: Household;
  unread: boolean;
  onSelect: () => void;
};

const KIND_LABELS: Record<NotificationKind, { label: string; tone: TagTone }> =
  {
    mention: { label: "Mention", tone: "blue" },
    departure: { label: "Account alert", tone: "red" },
    docusign: { label: "DocuSign", tone: "teal" },
    review: { label: "Review", tone: "amber" },
    task: { label: "Task", tone: "neutral" },
    nudge: { label: "Nudge", tone: "purple" },
  };

export default function NotificationItem({
  notification,
  household,
  unread,
  onSelect,
}: NotificationItemProps) {
  const actor = notification.actor ? advisorByName(notification.actor) : null;
  const kind = KIND_LABELS[notification.kind];
  const markName = household?.name ?? "?";

  return (
    <li className="relative">
      <Button
        variant="item"
        size="none"
        onClick={onSelect}
        data-unread={unread}
        className="p-3 data-[unread=true]:bg-white/2 data-[unread=true]:hover:bg-white/5"
      >
        <span className="relative mt-px shrink-0">
          {actor ? (
            <>
              <Avatar src={actor.avatar} alt="" className="size-8" />
              <HouseholdMark
                name={markName}
                className="ring-popover absolute -right-1 -bottom-1 size-4 rounded-[5px] ring-2"
                textClassName="text-[7px] leading-none"
              />
            </>
          ) : (
            <HouseholdMark name={markName} className="size-8 rounded-lg" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-2 pr-4">
          <span className="p-style text-soft block">
            {actor && (
              <span className="text-foreground font-medium">{actor.name} </span>
            )}
            {notification.message}
          </span>
          {notification.quote && (
            <span className="p-style border-line-strong text-soft block rounded-lg border bg-white/3 px-3 py-2">
              {notification.quote}
            </span>
          )}
          <span className="caption-style text-subtle flex flex-wrap items-center gap-1.5">
            <Tag tone={kind.tone} size="sm">
              {kind.label}
            </Tag>
            {notification.time}
            {household && (
              <>
                <span aria-hidden className="bg-subtle size-0.5 rounded-full" />
                {household.name}
              </>
            )}
          </span>
        </span>
        {unread && <span className="sr-only">Unread</span>}
      </Button>
      {unread && (
        <span
          aria-hidden
          className="bg-danger pointer-events-none absolute top-4 right-3 size-1.5 rounded-full"
        />
      )}
    </li>
  );
}
