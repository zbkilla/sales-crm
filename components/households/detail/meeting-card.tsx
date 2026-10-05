import Avatar from "@/components/_ui/avatar";
import Tag from "@/components/_ui/tag";
import { MEETING_TONES, advisorByName, type Meeting } from "@/data/households";
import { formatDate } from "@/lib/households";
import ClockIcon from "@/public/assets/images/households/detail/clock.svg";

type MeetingCardProps = {
  meeting: Meeting;
};

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const advisor = advisorByName(meeting.advisor);

  return (
    <article className="bg-card ease-power3-out flex flex-col gap-4 rounded-lg p-4 shadow-[0px_4px_4px_0px_rgba(42,42,42,0.32),0px_0px_0px_1px_#0e0e0e,inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] transition-colors duration-150 hover:bg-[#252525]">
      <div className="flex flex-col gap-2">
        <h3>{meeting.title}</h3>
        <p className="text-soft">{meeting.summary}</p>
      </div>
      <div className="caption-style flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Avatar src={advisor.avatar} alt="" className="size-3" />
            {advisor.name}
          </span>
          <span className="text-soft flex items-center gap-1">
            <ClockIcon aria-hidden className="size-3" />
            {formatDate(meeting.date)}
          </span>
        </div>
        <Tag tone={MEETING_TONES[meeting.type]} size="sm">
          {meeting.type}
        </Tag>
      </div>
    </article>
  );
}
