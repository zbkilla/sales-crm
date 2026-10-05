import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProfileSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function ProfileSection({
  title,
  description,
  action,
  children,
  className,
}: ProfileSectionProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "border-line-strong flex min-w-0 flex-col gap-4 rounded-xl border p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="eyebrow-style font-normal">{title}</h2>
          {description && (
            <p className="caption-style text-subtle">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
