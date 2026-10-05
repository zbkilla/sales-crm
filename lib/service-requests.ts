import {
  MONEY_CATEGORIES,
  requestTemplate,
  type RequestTemplate,
} from "@/data/request-templates";
import {
  OPEN_STATUSES,
  REQUEST_SEEDS,
  type NigoReason,
  type RequestStatus,
  type RequestStep,
  type ServiceRequest,
} from "@/data/service-requests";
import type { FollowUpStatus } from "@/data/households";
import { addBusinessDays, businessDaysBetween } from "@/lib/business-days";
import { TODAY } from "@/lib/households";

export function requestName(request: Pick<ServiceRequest, "templateKey">) {
  return requestTemplate(request.templateKey)?.name ?? request.templateKey;
}

export function scheduleSteps(
  template: RequestTemplate,
  startISO: string,
): RequestStep[] {
  let elapsed = 0;
  return template.steps.map((step) => {
    elapsed += step.durationBD;
    return {
      ...step,
      dueOn: addBusinessDays(startISO, elapsed),
      done: false,
    };
  });
}

export function derivedStatus(steps: RequestStep[]): RequestStatus {
  const next = steps.find((step) => !step.done);
  if (!next) return "Verification";
  if (next.role === "Client") return "Waiting – Client";
  if (next.role === "External") return "Waiting – Custodian";
  return "In progress";
}

export function isOpen(request: ServiceRequest) {
  return OPEN_STATUSES.includes(request.status);
}

export function buildSeedRequests(): ServiceRequest[] {
  return REQUEST_SEEDS.flatMap((seed) => {
    const template = requestTemplate(seed.templateKey);
    if (!template) return [];
    const steps = scheduleSteps(template, seed.openedOn).map((step, index) =>
      index < seed.doneSteps
        ? {
            ...step,
            done: true,
            doneOn: step.dueOn < TODAY ? step.dueOn : TODAY,
          }
        : step,
    );
    return [
      {
        id: seed.id,
        number: seed.number,
        templateKey: seed.templateKey,
        householdId: seed.householdId,
        accountRef: seed.accountRef ?? null,
        amount: seed.amount ?? null,
        owner: seed.owner,
        advisor: seed.advisor,
        status:
          seed.status ??
          (seed.doneSteps === 0 ? "Intake" : derivedStatus(steps)),
        priority: template.priority,
        openedOn: seed.openedOn,
        dueOn: addBusinessDays(seed.openedOn, template.slaBD),
        completedOn: seed.completedOn,
        verifiedBy: seed.verifiedBy,
        callbackVerified: seed.callbackVerified ?? false,
        nigoHistory: seed.nigoHistory ?? [],
        steps,
      },
    ];
  });
}

export function createRequest({
  template,
  number,
  householdId,
  accountRef,
  amount,
  owner,
  advisor,
}: {
  template: RequestTemplate;
  number: number;
  householdId: string;
  accountRef: string | null;
  amount: number | null;
  owner: string;
  advisor: string;
}): ServiceRequest {
  return {
    id: `sr-${number}`,
    number,
    templateKey: template.key,
    householdId,
    accountRef,
    amount,
    owner,
    advisor,
    status: "Intake",
    priority: template.priority,
    openedOn: TODAY,
    dueOn: addBusinessDays(TODAY, template.slaBD),
    callbackVerified: false,
    nigoHistory: [],
    steps: scheduleSteps(template, TODAY),
  };
}

export function currentStep(request: ServiceRequest) {
  const index = request.steps.findIndex((step) => !step.done);
  return index === -1 ? null : { index, step: request.steps[index] };
}

export function requestProgress(request: ServiceRequest) {
  const done = request.steps.filter((step) => step.done).length;
  const total = request.steps.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function slaStatus(request: ServiceRequest): FollowUpStatus | null {
  if (!isOpen(request)) return null;
  if (request.dueOn < TODAY) return "overdue";
  return businessDaysBetween(TODAY, request.dueOn) <= 2
    ? "due-soon"
    : "on-track";
}

export function isMoneyRequest(request: ServiceRequest) {
  const template = requestTemplate(request.templateKey);
  return template ? MONEY_CATEGORIES.includes(template.category) : false;
}

export function needsCallback(request: ServiceRequest) {
  return request.steps.some((step) =>
    step.name.toLowerCase().includes("callback"),
  );
}

export function toggleStep(
  request: ServiceRequest,
  index: number,
): ServiceRequest {
  if (request.status === "Done" || request.status === "Cancelled") {
    return request;
  }
  const steps = request.steps.map((step, position) =>
    position === index
      ? step.done
        ? { ...step, done: false, doneOn: undefined }
        : { ...step, done: true, doneOn: TODAY }
      : step,
  );
  const callbackStep = steps[index];
  return {
    ...request,
    steps,
    callbackVerified:
      callbackStep.name.toLowerCase().includes("callback") && callbackStep.done
        ? true
        : request.callbackVerified,
    status: derivedStatus(steps),
  };
}

export function flagNigo(
  request: ServiceRequest,
  reason: NigoReason,
  note: string,
): ServiceRequest {
  let reopenIndex = -1;
  request.steps.forEach((step, index) => {
    if (step.done) reopenIndex = index;
  });
  const steps = request.steps.map((step, index) =>
    index === reopenIndex ? { ...step, done: false, doneOn: undefined } : step,
  );
  let elapsed = 0;
  const rescheduled = steps.map((step) => {
    if (step.done) return step;
    elapsed += step.durationBD;
    return { ...step, dueOn: addBusinessDays(TODAY, elapsed) };
  });
  return {
    ...request,
    status: "NIGO / Rework",
    steps: rescheduled,
    dueOn: addBusinessDays(TODAY, Math.max(1, elapsed)),
    nigoHistory: [...request.nigoHistory, { date: TODAY, reason, note }],
  };
}

export function resumeRequest(request: ServiceRequest): ServiceRequest {
  return { ...request, status: derivedStatus(request.steps) };
}

export function verifyRequest(
  request: ServiceRequest,
  verifier: string,
): ServiceRequest {
  return {
    ...request,
    status: "Done",
    completedOn: TODAY,
    verifiedBy: verifier,
  };
}

export function cancelRequest(request: ServiceRequest): ServiceRequest {
  return { ...request, status: "Cancelled", completedOn: TODAY };
}

export function turnaroundBD(request: ServiceRequest) {
  return request.completedOn
    ? businessDaysBetween(request.openedOn, request.completedOn)
    : null;
}
