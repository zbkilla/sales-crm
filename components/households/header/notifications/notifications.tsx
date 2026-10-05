"use client";

import { useRef, useState } from "react";
import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/_ui/popover";
import { ScrollArea } from "@/components/_ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/_ui/tabs";
import NotificationItem from "./notification-item";
import { NOTIFICATIONS } from "@/data/notifications";
import { useHouseholdsStore } from "@/stores/households-store";
import BellIcon from "@/public/assets/images/households/header/bell.svg";

type Filter = "all" | "unread" | "nudges";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const navigated = useRef(false);
  const households = useHouseholdsStore((state) => state.households);
  const unreadIds = useHouseholdsStore((state) => state.unreadNotificationIds);
  const markRead = useHouseholdsStore((state) => state.markNotificationRead);
  const markAllRead = useHouseholdsStore(
    (state) => state.markAllNotificationsRead,
  );
  const openDetail = useHouseholdsStore((state) => state.openDetail);

  const unreadCount = unreadIds.length;
  const visible = NOTIFICATIONS.filter((item) => {
    if (filter === "unread") return unreadIds.includes(item.id);
    if (filter === "nudges") return item.kind === "nudge";
    return true;
  });

  function handleSelect(id: string, householdId: string) {
    markRead(id);
    if (!households.some((household) => household.id === householdId)) return;
    navigated.current = true;
    setOpen(false);
    openDetail(householdId);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
          className="data-[state=open]:bg-muted relative"
        >
          <BellIcon aria-hidden className="size-3.5" />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="bg-danger ring-secondary absolute top-[7px] right-[7px] size-1.5 rounded-full ring-2"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(400px,calc(100vw-2rem))]"
        onCloseAutoFocus={(event) => {
          if (navigated.current) event.preventDefault();
          navigated.current = false;
        }}
      >
        <div className="flex h-14 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <h2>Notifications</h2>
            {unreadCount > 0 && <CountBadge>{unreadCount}</CountBadge>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0}
            onClick={markAllRead}
            className="-mr-1.5"
          >
            Mark all as read
          </Button>
        </div>

        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
        >
          <TabsList className="border-line-strong border-b px-4">
            <TabsTrigger value="all" className="py-3">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="py-3">
              Unread
            </TabsTrigger>
            <TabsTrigger value="nudges" className="py-3">
              Nudges
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {visible.length > 0 ? (
          <ScrollArea viewportClassName="max-h-[min(420px,60dvh)]">
            <ul className="flex flex-col gap-0.5 p-1.5">
              {visible.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  household={households.find(
                    (household) => household.id === notification.householdId,
                  )}
                  unread={unreadIds.includes(notification.id)}
                  onSelect={() =>
                    handleSelect(notification.id, notification.householdId)
                  }
                />
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <span className="bg-muted flex size-10 items-center justify-center rounded-full shadow-[0px_0px_0px_1px_#232323]">
              <BellIcon aria-hidden className="text-soft size-4" />
            </span>
            <span className="lead-style mt-1 block font-medium">
              You’re all caught up
            </span>
            <span className="caption-style text-subtle block">
              Mentions, account alerts and client nudges will show up here.
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
