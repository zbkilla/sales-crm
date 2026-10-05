import Tag from "@/components/_ui/tag";
import {
  FOLLOW_UP_TONES,
  TAG_TONES,
  TIER_TONES,
  TYPE_TONES,
  type FollowUpStatus,
  type Household,
} from "@/data/households";
import { followUpLabel, splitTags } from "@/lib/households";

type SegmentTagsProps = {
  household: Household;
  size?: "sm" | "md";
  limit?: boolean;
  withType?: boolean;
};

export function SegmentTag({
  household,
  size = "md",
}: Pick<SegmentTagsProps, "household" | "size">) {
  return household.type === "Client" && household.tier ? (
    <Tag tone={TIER_TONES[household.tier]} size={size}>
      Tier {household.tier}
    </Tag>
  ) : (
    <Tag tone={TYPE_TONES[household.type]} size={size}>
      {household.type}
    </Tag>
  );
}

export function SegmentTags({
  household,
  size = "md",
  limit = true,
  withType = true,
}: SegmentTagsProps) {
  const { visible, hidden } = limit
    ? splitTags(household.tags, 16)
    : { visible: household.tags, hidden: 0 };

  return (
    <>
      {withType && <SegmentTag household={household} size={size} />}
      {!withType && household.tags.length === 0 && (
        <span className="text-subtle">—</span>
      )}
      {visible.map((tag) => (
        <Tag key={tag} tone={TAG_TONES[tag]} size={size}>
          {tag}
        </Tag>
      ))}
      {hidden > 0 && (
        <Tag tone="neutral" size="sm">
          +{hidden}
        </Tag>
      )}
    </>
  );
}

type FollowUpTagProps = {
  status: FollowUpStatus;
  size?: "sm" | "md";
};

export function FollowUpTag({ status, size = "sm" }: FollowUpTagProps) {
  return (
    <Tag tone={FOLLOW_UP_TONES[status]} size={size}>
      {followUpLabel(status)}
    </Tag>
  );
}
