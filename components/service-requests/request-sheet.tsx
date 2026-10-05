"use client";

import { useState } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { Checkbox } from "@/components/_ui/checkbox";
import Field from "@/components/_ui/field";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import Tag from "@/components/_ui/tag";
import { FollowUpTag } from "@/components/_common/household-tags";
import DetailSection from "@/components/households/detail/detail-section";
import { RequestStatusTag, RoleTag } from "./request-tags";
import { CURRENT_USER, profileByName } from "@/data/households";
import { LANE_LABELS, requestTemplate } from "@/data/request-templates";
import {
  NIGO_REASONS,
  type NigoReason,
  type ServiceRequest,
} from "@/data/service-requests";
import { TODAY, formatDate, formatMoney } from "@/lib/households";
import {
  isMoneyRequest,
  isOpen,
  needsCallback,
  requestProgress,
  slaStatus,
  turnaroundBD,
} from "@/lib/service-requests";
import { cn } from "@/lib/utils";
import { useHouseholdsStore } from "@/stores/households-store";
import ClipboardIcon from "@/public/assets/images/households/sidebar/clipboard.svg";
import XIcon from "@/public/assets/images/households/detail/x.svg";

const FOUR_EYES_THRESHOLD = 50000;

export default function RequestSheet() {
  const requestId = useHouseholdsStore((state) => state.requestDetailId);
  const request = useHouseholdsStore((state) =>
    state.serviceRequests.find((item) => item.id === state.requestDetailId),
  );
  const closeRequest = useHouseholdsStore((state) => state.closeRequest);

  return (
    <Sheet
      open={requestId !== null && request !== undefined}
      onOpenChange={(open) => !open && closeRequest()}
    >
      <SheetContent side="right" className="sm:w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <ClipboardIcon aria-hidden className="text-icon size-3.5" />
            <SheetTitle>
              {request
                ? `Service request SR-${request.number}`
                : "Service request"}
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Checklist, status, SLA and NIGO history for this request
          </SheetDescription>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="-mr-1"
              aria-label="Close request"
            >
              <XIcon aria-hidden className="text-foreground size-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        {request && <RequestBody key={request.id} request={request} />}
      </SheetContent>
    </Sheet>
  );
}

function RequestBody({ request }: { request: ServiceRequest }) {
  const households = useHouseholdsStore((state) => state.households);
  const toggleRequestStep = useHouseholdsStore(
    (state) => state.toggleRequestStep,
  );
  const markRequestNigo = useHouseholdsStore((state) => state.markRequestNigo);
  const resumeServiceRequest = useHouseholdsStore(
    (state) => state.resumeServiceRequest,
  );
  const verifyServiceRequest = useHouseholdsStore(
    (state) => state.verifyServiceRequest,
  );
  const cancelServiceRequest = useHouseholdsStore(
    (state) => state.cancelServiceRequest,
  );
  const closeRequest = useHouseholdsStore((state) => state.closeRequest);
  const [nigoOpen, setNigoOpen] = useState(false);
  const [nigoReason, setNigoReason] = useState<NigoReason>(NIGO_REASONS[0]);
  const [nigoNote, setNigoNote] = useState("");

  const template = requestTemplate(request.templateKey);
  const household = households.find((item) => item.id === request.householdId);
  const owner = profileByName(request.owner);
  const progress = requestProgress(request);
  const sla = slaStatus(request);
  const open = isOpen(request);
  const callbackRequired = needsCallback(request);
  const fourEyes =
    isMoneyRequest(request) &&
    (request.amount ?? 0) >= FOUR_EYES_THRESHOLD &&
    request.owner === CURRENT_USER.name;
  const latestNigo = request.nigoHistory[request.nigoHistory.length - 1];
  const turnaround = turnaroundBD(request);

  function submitNigo() {
    markRequestNigo(
      request.id,
      nigoReason,
      nigoNote.trim() || "No details recorded.",
    );
    setNigoOpen(false);
    setNigoNote("");
  }

  const summary = [
    {
      label: "Household",
      value: household ? (
        <Button
          variant="link"
          size="none"
          href={`/households/${household.id}`}
          onClick={closeRequest}
        >
          {household.name}
        </Button>
      ) : (
        "Unknown"
      ),
    },
    { label: "Account", value: request.accountRef ?? "Not specified" },
    {
      label: "Amount",
      value:
        request.amount !== null ? `$${formatMoney(request.amount)}` : "n/a",
    },
    {
      label: "Owner",
      value: (
        <span className="flex items-center gap-1.5">
          <Avatar src={owner.avatar} alt="" className="size-4" />
          {owner.name}
        </span>
      ),
    },
    { label: "Advisor", value: request.advisor },
    { label: "Opened", value: formatDate(request.openedOn) },
    {
      label: open ? "Due (SLA)" : "Completed",
      value: open ? (
        <span className="flex items-center gap-2">
          {formatDate(request.dueOn)} · {template?.slaBD ?? "?"} business days
          {sla && <FollowUpTag status={sla} />}
        </span>
      ) : request.completedOn ? (
        `${formatDate(request.completedOn)}${turnaround !== null ? ` · ${turnaround} business days` : ""}`
      ) : (
        "—"
      ),
    },
    ...(callbackRequired
      ? [
          {
            label: "Callback",
            value: request.callbackVerified ? (
              <Tag tone="green" size="sm">
                Verified
              </Tag>
            ) : (
              <Tag tone="amber" size="sm">
                Required before submission
              </Tag>
            ),
          },
        ]
      : []),
    ...(request.verifiedBy
      ? [{ label: "Verified by", value: request.verifiedBy }]
      : []),
  ];

  return (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-5 shadow-[inset_0_-1px_0_var(--line-strong)]">
          <div className="flex flex-wrap items-center gap-2">
            <RequestStatusTag status={request.status} size="md" />
            <Tag tone="neutral" size="md">
              {template?.category}
            </Tag>
            {request.priority !== "Normal" && (
              <Tag
                tone={request.priority === "Critical" ? "red" : "orange"}
                size="md"
              >
                {request.priority} priority
              </Tag>
            )}
          </div>
          <h2>{request.title}</h2>
          {template && request.title !== template.name && (
            <span className="caption-style text-subtle">{template.name}</span>
          )}
        </div>

        {request.status === "NIGO / Rework" && latestNigo && (
          <div className="border-danger/40 m-5 mb-0 flex flex-col gap-1 rounded-lg border bg-white/2 px-3 py-2.5">
            <span className="text-danger font-medium">
              Not in good order: {latestNigo.reason}
            </span>
            <span className="text-soft">{latestNigo.note}</span>
            <span className="caption-style text-subtle">
              Flagged {formatDate(latestNigo.date)}. The SLA restarted from that
              date.
            </span>
          </div>
        )}

        <DetailSection title="Details">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5">
            {summary.map((row) => (
              <div
                key={row.label}
                className="col-span-full grid grid-cols-subgrid"
              >
                <dt className="caption-style text-soft">{row.label}</dt>
                <dd className="text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </DetailSection>

        <DetailSection
          title={`Checklist · ${progress.done} of ${progress.total}`}
        >
          <ol className="flex flex-col gap-1">
            {request.steps.map((step, index) => {
              const late = !step.done && step.dueOn < TODAY && open;
              return (
                <li
                  key={`${index}-${step.name}`}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-2 py-2",
                    !step.done &&
                      request.steps.findIndex((item) => !item.done) === index &&
                      open &&
                      "bg-white/4",
                  )}
                >
                  <Checkbox
                    checked={step.done}
                    disabled={!open}
                    onCheckedChange={() => toggleRequestStep(request.id, index)}
                    aria-label={`${step.done ? "Reopen" : "Complete"} step ${index + 1}: ${step.name}`}
                    className="mt-0.5"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span
                      className={cn(step.done && "text-subtle line-through")}
                    >
                      {index + 1}. {step.name}
                    </span>
                    <span className="caption-style text-subtle flex flex-wrap items-center gap-1.5">
                      <RoleTag role={step.role} />
                      {step.lane && (
                        <Tag tone="neutral" size="sm">
                          {LANE_LABELS[step.lane]}
                        </Tag>
                      )}
                      {step.medallion && (
                        <Tag tone="orange" size="sm">
                          Medallion guarantee
                        </Tag>
                      )}
                      <span
                        className={cn("tabular-nums", late && "text-danger")}
                      >
                        {step.done && step.doneOn
                          ? `Done ${formatDate(step.doneOn)}`
                          : `Due ${formatDate(step.dueOn)}`}
                      </span>
                    </span>
                    {step.note && (
                      <span className="caption-style text-soft">
                        {step.note}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </DetailSection>

        {template && (
          <DetailSection title="Watch for">
            <p className="text-soft">{template.nigoRisks}</p>
          </DetailSection>
        )}

        {request.nigoHistory.length > 0 && (
          <DetailSection title="NIGO history" className="shadow-none">
            <ul className="flex flex-col gap-2">
              {request.nigoHistory.map((event, index) => (
                <li key={index} className="flex flex-col gap-0.5">
                  <span>
                    {formatDate(event.date)} · {event.reason}
                  </span>
                  <span className="caption-style text-subtle">
                    {event.note}
                  </span>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {nigoOpen && (
          <DetailSection title="Flag not in good order" className="shadow-none">
            <div className="flex flex-col gap-3">
              <Field label="Reason" htmlFor="nigo-reason">
                <Select
                  value={nigoReason}
                  onValueChange={(value) => setNigoReason(value as NigoReason)}
                >
                  <SelectTrigger id="nigo-reason">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGO_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="What needs fixing" htmlFor="nigo-note">
                <textarea
                  id="nigo-note"
                  value={nigoNote}
                  onChange={(event) => setNigoNote(event.target.value)}
                  rows={3}
                  placeholder="e.g. Custodian rejected: joint registration doesn't match contra statement."
                  className="border-line-strong bg-secondary text-foreground placeholder:text-subtle focus-visible:border-ring ease-power3-out w-full resize-none rounded-lg border px-3 py-2.5 text-[14px] transition-[border-color] duration-150 outline-none"
                />
              </Field>
              <div className="flex justify-end gap-2">
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => setNigoOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={submitNigo}>
                  Flag NIGO and restart SLA
                </Button>
              </div>
            </div>
          </DetailSection>
        )}
      </ScrollArea>

      <SheetFooter>
        <div className="flex items-center gap-2">
          {open && request.status !== "NIGO / Rework" && !nigoOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-1.5"
              onClick={() => setNigoOpen(true)}
            >
              Flag NIGO
            </Button>
          )}
          {open && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cancelServiceRequest(request.id)}
            >
              Cancel request
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SheetClose asChild>
            <Button variant="subtle" size="sm">
              Close
            </Button>
          </SheetClose>
          {request.status === "NIGO / Rework" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => resumeServiceRequest(request.id)}
            >
              Resume work
            </Button>
          )}
          {request.status === "Verification" && (
            <Button
              variant="primary"
              size="sm"
              disabled={fourEyes}
              title={
                fourEyes
                  ? "Money movement over $50,000 needs a reviewer other than the owner"
                  : undefined
              }
              onClick={() =>
                verifyServiceRequest(request.id, CURRENT_USER.name)
              }
            >
              {fourEyes ? "Needs second reviewer" : "Verify and close"}
            </Button>
          )}
        </div>
      </SheetFooter>
    </>
  );
}
