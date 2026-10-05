"use client";

import Button from "@/components/_ui/button";
import { FollowUpTag } from "@/components/_common/household-tags";
import SegmentBar from "@/components/_common/segment-bar";
import { RequestStatusTag, RoleTag } from "./request-tags";
import type { ServiceRequest } from "@/data/service-requests";
import { formatDate } from "@/lib/households";
import {
  currentStep,
  requestProgress,
  slaStatus,
} from "@/lib/service-requests";
import { useHouseholdsStore } from "@/stores/households-store";

type RequestListProps = {
  requests: ServiceRequest[];
};

export default function RequestList({ requests }: RequestListProps) {
  const openRequest = useHouseholdsStore((state) => state.openRequest);

  return (
    <ul className="divide-line-strong flex flex-col divide-y">
      {requests.map((request) => {
        const step = currentStep(request);
        const progress = requestProgress(request);
        const sla = slaStatus(request);
        return (
          <li key={request.id} className="py-3 first:pt-0 last:pb-0">
            <Button
              variant="item"
              size="none"
              onClick={() => openRequest(request.id)}
              className="-mx-2 flex-col gap-2 px-2 py-1.5"
            >
              <span className="flex w-full flex-wrap items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="caption-style text-subtle tabular-nums">
                    SR-{request.number}
                  </span>
                  <span className="truncate">{request.title}</span>
                </span>
                <RequestStatusTag status={request.status} />
              </span>
              {step && (
                <span className="caption-style text-soft flex w-full items-center gap-2">
                  <RoleTag role={step.step.role} />
                  <span className="min-w-0 flex-1 truncate">
                    {step.step.name}
                  </span>
                </span>
              )}
              <span className="caption-style flex w-full items-center gap-2">
                <SegmentBar
                  percent={progress.percent}
                  segments={32}
                  tone="success"
                  className="flex-1"
                />
                <span className="text-soft tabular-nums">
                  {progress.done}/{progress.total}
                </span>
                <span className="text-soft tabular-nums">
                  Due {formatDate(request.dueOn)}
                </span>
                {sla && <FollowUpTag status={sla} />}
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
