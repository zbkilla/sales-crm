"use client";

import { useMemo } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import { ScrollArea } from "@/components/_ui/scroll-area";
import Tag from "@/components/_ui/tag";
import HouseholdMark from "@/components/_common/household-mark";
import PageHeader from "@/components/_common/page-header";
import { MEETING_TONES, advisorByName } from "@/data/households";
import type { ScheduledMeeting } from "@/data/meetings";
import { formatDate } from "@/lib/households";
import {
  useHouseholdsStore,
  type MeetingsTab,
} from "@/stores/households-store";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayLabel(iso: string) {
  const weekday = WEEKDAYS[new Date(`${iso}T00:00:00Z`).getUTCDay()];
  return `${weekday}, ${formatDate(iso)}`;
}

function timeLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function endTime(meeting: ScheduledMeeting) {
  const [hours, minutes] = meeting.time.split(":").map(Number);
  const total = hours * 60 + minutes + meeting.durationMinutes;
  return timeLabel(
    `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`,
  );
}

export default function Meetings() {
  const upcoming = useHouseholdsStore((state) => state.upcomingMeetings);
  const households = useHouseholdsStore((state) => state.households);
  const tab = useHouseholdsStore((state) => state.meetingsTab);
  const setTab = useHouseholdsStore((state) => state.setMeetingsTab);
  const completeMeeting = useHouseholdsStore((state) => state.completeMeeting);
  const openDetail = useHouseholdsStore((state) => state.openDetail);

  const days = useMemo(() => {
    const sorted = [...upcoming].sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
    );
    const dates = [...new Set(sorted.map((meeting) => meeting.date))];
    return dates.map((date) => ({
      date,
      meetings: sorted.filter((meeting) => meeting.date === date),
    }));
  }, [upcoming]);

  const past = useMemo(
    () =>
      households
        .flatMap((household) =>
          household.meetings.map((meeting) => ({ household, meeting })),
        )
        .sort((a, b) => b.meeting.date.localeCompare(a.meeting.date)),
    [households],
  );

  function householdName(id: string) {
    return households.find((household) => household.id === id)?.name ?? "";
  }

  return (
    <section id="meetings" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader
        title="Meetings"
        tabs={[
          { value: "upcoming", label: "Upcoming", count: upcoming.length },
          { value: "past", label: "Past", count: past.length },
        ]}
        activeTab={tab}
        onTabChange={(value) => setTab(value as MeetingsTab)}
      />

      <div className="border-border min-h-0 flex-1">
        <ScrollArea className="h-full">
          {tab === "upcoming" ? (
            <div className="flex flex-col gap-6 p-4">
              {days.map(({ date, meetings }) => (
                <section
                  key={date}
                  aria-label={dayLabel(date)}
                  className="flex flex-col gap-2"
                >
                  <h2 className="eyebrow-style flex items-center gap-2 font-normal">
                    {dayLabel(date)}
                    <CountBadge>{meetings.length}</CountBadge>
                  </h2>
                  <ul className="grid gap-2 lg:grid-cols-2">
                    {meetings.map((meeting) => {
                      const advisor = advisorByName(meeting.advisor);
                      const name = householdName(meeting.householdId);
                      return (
                        <li key={meeting.id}>
                          <article
                            aria-label={meeting.title}
                            className="bg-card flex h-full flex-col gap-3 rounded-lg p-4 shadow-[0px_4px_4px_0px_rgba(42,42,42,0.32),0px_0px_0px_1px_#0e0e0e,inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.08)]"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="flex flex-col gap-1">
                                <h3>{meeting.title}</h3>
                                <span className="caption-style text-soft tabular-nums">
                                  {timeLabel(meeting.time)} – {endTime(meeting)}{" "}
                                  · {meeting.location}
                                </span>
                              </div>
                              <Tag tone={MEETING_TONES[meeting.type]} size="sm">
                                {meeting.type}
                              </Tag>
                            </div>
                            <div className="caption-style flex flex-wrap items-center gap-3">
                              <Button
                                variant="ghost"
                                size="none"
                                onClick={() => openDetail(meeting.householdId)}
                                className="text-foreground -mx-1 gap-1.5 rounded-md px-1 py-0.5 font-normal"
                              >
                                <HouseholdMark
                                  name={name}
                                  className="size-4 rounded"
                                  textClassName="text-[7px] leading-none"
                                />
                                {name}
                              </Button>
                              <span className="text-soft flex items-center gap-1.5">
                                <Avatar
                                  src={advisor.avatar}
                                  alt=""
                                  className="size-4"
                                />
                                {advisor.name}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <span className="eyebrow-style text-subtle font-normal">
                                Prep brief
                              </span>
                              <p className="border-line-strong text-soft rounded-lg border bg-white/3 px-3 py-2">
                                {meeting.prep}
                              </p>
                            </div>
                            <div className="mt-auto flex justify-end gap-2">
                              <Button
                                variant="subtle"
                                size="sm"
                                onClick={() => openDetail(meeting.householdId)}
                              >
                                Open household
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => completeMeeting(meeting.id)}
                              >
                                Mark held
                              </Button>
                            </div>
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
              {days.length === 0 && (
                <p className="caption-style text-muted-foreground py-12 text-center">
                  No upcoming meetings scheduled.
                </p>
              )}
            </div>
          ) : (
            <ul className="divide-line-strong border-border flex flex-col divide-y border-t">
              {past.map(({ household, meeting }) => {
                const advisor = advisorByName(meeting.advisor);
                return (
                  <li
                    key={`${household.id}-${meeting.id}`}
                    className="flex flex-col gap-2 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-medium">{meeting.title}</span>
                      <Tag tone={MEETING_TONES[meeting.type]} size="sm">
                        {meeting.type}
                      </Tag>
                      <span className="caption-style text-soft tabular-nums">
                        {formatDate(meeting.date)}
                      </span>
                      <Button
                        variant="ghost"
                        size="none"
                        onClick={() => openDetail(household.id)}
                        className="caption-style text-foreground gap-1.5 rounded-md px-1 py-0.5 font-normal"
                      >
                        <HouseholdMark
                          name={household.name}
                          className="size-4 rounded"
                          textClassName="text-[7px] leading-none"
                        />
                        {household.name}
                      </Button>
                      <span className="caption-style text-soft flex items-center gap-1.5">
                        <Avatar
                          src={advisor.avatar}
                          alt=""
                          className="size-4"
                        />
                        {advisor.name}
                      </span>
                    </div>
                    <p className="text-soft">{meeting.summary}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </div>
    </section>
  );
}
