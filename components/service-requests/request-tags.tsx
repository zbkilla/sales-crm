import Tag from "@/components/_ui/tag";
import type { TagTone } from "@/data/households";
import type { StepRole } from "@/data/request-templates";
import type { RequestStatus } from "@/data/service-requests";

const STATUS_TONES: Record<RequestStatus, TagTone> = {
  Intake: "neutral",
  "In progress": "blue",
  "Waiting – Client": "amber",
  "Waiting – Custodian": "purple",
  "NIGO / Rework": "red",
  Verification: "teal",
  Done: "green",
  Cancelled: "neutral",
};

const ROLE_TONES: Record<StepRole, TagTone> = {
  CSA: "blue",
  Advisor: "green",
  Principal: "purple",
  Client: "amber",
  Planner: "teal",
  External: "neutral",
};

export function RequestStatusTag({
  status,
  size = "sm",
}: {
  status: RequestStatus;
  size?: "sm" | "md";
}) {
  return (
    <Tag tone={STATUS_TONES[status]} size={size}>
      {status}
    </Tag>
  );
}

export function RoleTag({ role }: { role: StepRole }) {
  return (
    <Tag tone={ROLE_TONES[role]} size="sm">
      {role}
    </Tag>
  );
}
