import { householdInitials } from "@/lib/households";
import { cn } from "@/lib/utils";

type HouseholdMarkProps = {
  name: string;
  className?: string;
  textClassName?: string;
};

export default function HouseholdMark({
  name,
  className,
  textClassName,
}: HouseholdMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-muted flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md shadow-[0px_0px_0px_1px_#232323]",
        className,
      )}
    >
      <span
        className={cn(
          "caption-style text-soft font-medium tracking-[0.02em]",
          textClassName,
        )}
      >
        {householdInitials(name)}
      </span>
    </span>
  );
}
