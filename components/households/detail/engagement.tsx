import type { ComponentType, ReactNode, SVGProps } from "react";
import { FollowUpTag } from "@/components/_common/household-tags";
import Sparkline from "@/components/_common/sparkline";
import type { Household } from "@/data/households";
import {
  formatDate,
  nextReviewDue,
  nextTouchpointDue,
  reviewCadence,
  reviewStatus,
  touchpointDays,
  touchpointStatus,
} from "@/lib/households";
import CursorClickIcon from "@/public/assets/images/households/detail/cursor-click.svg";
import MailIcon from "@/public/assets/images/households/detail/mail-03.svg";
import CalendarIcon from "@/public/assets/images/households/detail/calendar.svg";
import PhoneCallIcon from "@/public/assets/images/households/detail/phone-call.svg";

type EngagementProps = {
  household: Household;
  scale: number;
};

type Stat = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
};

type Row = {
  label: string;
  value: ReactNode;
};

function DueValue({
  due,
  status,
}: {
  due: string | null;
  status: ReturnType<typeof reviewStatus>;
}) {
  if (!due) return <>—</>;
  return (
    <span className="flex items-center gap-2">
      <span className="tabular-nums">{formatDate(due)}</span>
      {status && <FollowUpTag status={status} />}
    </span>
  );
}

function engagementRows(household: Household): Row[] {
  const cadenceDays = touchpointDays(household);
  const touchpointRows: Row[] = cadenceDays
    ? [
        { label: "Touchpoint cadence", value: `Every ${cadenceDays} days` },
        {
          label: "Next touchpoint due",
          value: (
            <DueValue
              due={nextTouchpointDue(household)}
              status={touchpointStatus(household)}
            />
          ),
        },
      ]
    : [];

  if (household.type === "Client") {
    return [
      { label: "Review cadence", value: reviewCadence(household) },
      {
        label: "Last review",
        value: household.lastReview
          ? formatDate(household.lastReview)
          : "None logged",
      },
      {
        label: "Next review due",
        value: (
          <DueValue
            due={nextReviewDue(household)}
            status={reviewStatus(household)}
          />
        ),
      },
      ...touchpointRows,
    ];
  }

  if (household.type === "Prospect") return touchpointRows;

  return [
    {
      label: "Client since",
      value: household.clientSince ? formatDate(household.clientSince) : "—",
    },
    {
      label: "Past client since",
      value: household.pastClientSince
        ? formatDate(household.pastClientSince)
        : "—",
    },
    {
      label: "Last review",
      value: household.lastReview ? formatDate(household.lastReview) : "—",
    },
  ];
}

export default function Engagement({ household, scale }: EngagementProps) {
  const mix = household.touchpointMix;
  const stats: Stat[] = [
    { icon: CalendarIcon, label: "Meetings", value: mix.meetings },
    { icon: MailIcon, label: "Emails", value: mix.emails },
    { icon: PhoneCallIcon, label: "Calls", value: mix.calls },
    { icon: CursorClickIcon, label: "Notes", value: mix.notes },
  ].map((stat) => ({ ...stat, value: Math.round(stat.value * scale) }));
  const total = stats.reduce((sum, stat) => sum + stat.value, 0);
  const rows = engagementRows(household);

  return (
    <div className="flex flex-col gap-4">
      <dl className="caption-style grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="col-span-full grid grid-cols-subgrid">
            <dt className="text-soft">{row.label}</dt>
            <dd className="text-foreground flex justify-end">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-[3px]">
          <span className="block text-[24px] leading-none tabular-nums">
            {total}
          </span>
          <Sparkline values={household.touchpointTrend} className="h-[22px]" />
        </div>
        <span className="caption-style text-soft block">
          Touchpoints logged · last on {formatDate(household.lastTouchpoint.date)}{" "}
          ({household.lastTouchpoint.label})
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-line-strong flex flex-col gap-3 rounded-lg border p-[11px]"
          >
            <span className="caption-style text-soft flex items-center gap-1">
              <stat.icon aria-hidden className="size-3 shrink-0" />
              {stat.label}
            </span>
            <span className="lead-style block tabular-nums">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
