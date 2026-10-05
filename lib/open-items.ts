import type { Household } from "@/data/households";
import type { Project } from "@/data/projects";
import type { Task } from "@/data/tasks";
import {
  accountCategory,
  householdFinancials,
  hasFinancials,
} from "@/lib/balance-sheet";
import {
  TODAY,
  addDays,
  daysBetween,
  formatDate,
  nextReviewDue,
  nextTouchpointDue,
  reviewStatus,
  touchpointStatus,
} from "@/lib/households";

export type OpenItemSeverity = "critical" | "attention" | "info";

export type OpenItem = {
  id: string;
  severity: OpenItemSeverity;
  title: string;
  detail: string;
};

const SEVERITY_ORDER: Record<OpenItemSeverity, number> = {
  critical: 0,
  attention: 1,
  info: 2,
};

const STALE_DAYS = 365;

export function openItems(
  household: Household,
  tasks: Task[],
  projects: Project[],
): OpenItem[] {
  const items: OpenItem[] = [];
  const financials = householdFinancials(household.id);

  if (reviewStatus(household) === "overdue") {
    items.push({
      id: "review",
      severity: "critical",
      title: "Review overdue",
      detail: `Next review was due ${formatDate(nextReviewDue(household) ?? TODAY)}.`,
    });
  }
  if (touchpointStatus(household) === "overdue") {
    items.push({
      id: "touchpoint",
      severity: "attention",
      title: "Touchpoint overdue",
      detail: `Last contact ${formatDate(household.lastTouchpoint.date)}; due ${formatDate(nextTouchpointDue(household) ?? TODAY)}.`,
    });
  }

  for (const project of projects) {
    if (
      project.householdId === household.id &&
      project.status === "in_progress" &&
      project.dueDate < TODAY
    ) {
      items.push({
        id: `project-${project.id}`,
        severity: "critical",
        title: `Project past due: ${project.name}`,
        detail: `Target was ${formatDate(project.dueDate)}.`,
      });
    }
  }

  const overdueTasks = tasks.filter(
    (task) =>
      task.householdId === household.id &&
      task.status === "todo" &&
      task.due !== null &&
      task.due < TODAY,
  );
  if (overdueTasks.length > 0) {
    items.push({
      id: "tasks",
      severity: "attention",
      title: `${overdueTasks.length} overdue ${overdueTasks.length === 1 ? "task" : "tasks"}`,
      detail: overdueTasks.map((task) => task.title).join("; "),
    });
  }

  if (!hasFinancials(household.id)) return sortItems(items);

  for (const account of household.accounts) {
    const detail = financials.accountDetails[account.id];
    if (
      accountCategory(account) === "retirement" &&
      !detail?.beneficiaryPrimary
    ) {
      items.push({
        id: `beneficiary-${account.id}`,
        severity: "attention",
        title: `No beneficiary on file: ${account.name}`,
        detail:
          "Confirm the primary and contingent beneficiaries with the custodian.",
      });
    }
    if (
      account.source === "manual" &&
      accountCategory(account) === "retirement"
    ) {
      items.push({
        id: `rollover-${account.id}`,
        severity: "info",
        title: `Rollover opportunity: ${account.name}`,
        detail: `Held away at ${account.custodian}; not included in AUM.`,
      });
    }
    const asOf = detail?.valueAsOf;
    if (asOf && daysBetween(asOf, TODAY) > STALE_DAYS) {
      items.push({
        id: `stale-${account.id}`,
        severity: "attention",
        title: `Stale value: ${account.name}`,
        detail: `Last updated ${formatDate(asOf)}.`,
      });
    }
  }

  for (const asset of financials.otherAssets) {
    if (daysBetween(asset.valueAsOf, TODAY) > STALE_DAYS) {
      items.push({
        id: `stale-${asset.id}`,
        severity: "attention",
        title: `Stale valuation: ${asset.name}`,
        detail: `Last valued ${formatDate(asset.valueAsOf)}; request an updated estimate.`,
      });
    }
  }

  for (const liability of financials.liabilities) {
    if (liability.rateAssumed) {
      items.push({
        id: `rate-${liability.id}`,
        severity: "info",
        title: `Interest rate assumed: ${liability.name}`,
        detail: `Using ${liability.interestRate}% until a statement confirms it.`,
      });
    }
  }

  const soon = addDays(TODAY, 730);
  for (const policy of financials.insurance) {
    if (policy.expires && policy.expires <= soon) {
      items.push({
        id: `expiring-${policy.id}`,
        severity: "attention",
        title: `${policy.type} expiring: ${policy.insured}`,
        detail: `${policy.carrier} coverage ends ${formatDate(policy.expires)}.`,
      });
    }
    if (policy.type.includes("life") && !policy.beneficiary) {
      items.push({
        id: `policy-beneficiary-${policy.id}`,
        severity: "attention",
        title: `No beneficiary on ${policy.type.toLowerCase()} policy`,
        detail: `${policy.carrier} policy insuring ${policy.insured}.`,
      });
    }
  }

  for (const document of financials.estateDocuments) {
    if (document.status === "Missing") {
      items.push({
        id: `estate-${document.name}`,
        severity: "attention",
        title: `Missing estate document: ${document.name}`,
        detail: "Refer to an estate attorney.",
      });
    } else if (document.status === "Review due") {
      items.push({
        id: `estate-${document.name}`,
        severity: "info",
        title: `Estate document review due: ${document.name}`,
        detail: document.signed
          ? `Signed ${formatDate(document.signed)}.`
          : "Signing date unknown.",
      });
    }
  }

  for (const goal of financials.goals) {
    if (goal.status === "At risk") {
      items.push({
        id: `goal-${goal.id}`,
        severity: "attention",
        title: `Goal at risk: ${goal.name}`,
        detail: `${goal.fundedPercent}% funded.`,
      });
    }
  }

  return sortItems(items);
}

function sortItems(items: OpenItem[]) {
  return items.sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
}
