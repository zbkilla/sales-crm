import Button from "@/components/_ui/button";
import HouseholdMark from "@/components/_common/household-mark";
import { FollowUpTag } from "@/components/_common/household-tags";
import type { Household } from "@/data/households";
import {
  assetsValue,
  followUpStatus,
  formatMoney,
  memberCount,
} from "@/lib/households";

type ProfileHouseholdProps = {
  household: Household;
  onOpen: () => void;
};

export default function ProfileHousehold({
  household,
  onOpen,
}: ProfileHouseholdProps) {
  const status = followUpStatus(household);
  const value = assetsValue(household);
  const segment =
    household.type === "Client" && household.tier
      ? `Tier ${household.tier}`
      : household.type;

  return (
    <li>
      <Button
        variant="item"
        size="md"
        onClick={onOpen}
        aria-label={`Open ${household.name} details`}
        className="items-center px-2 py-2"
      >
        <HouseholdMark name={household.name} className="size-8 rounded-lg" />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate">{household.name}</span>
          <span className="caption-style text-subtle truncate">
            {segment} · {memberCount(household)} members
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5 tabular-nums">
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            {formatMoney(value)}
          </span>
          {status && <FollowUpTag status={status} />}
        </span>
      </Button>
    </li>
  );
}
