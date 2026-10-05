import type { Household } from "@/data/households";
import type { ScheduledMeeting } from "@/data/meetings";
import { requestTemplate } from "@/data/request-templates";
import type { ServiceRequest } from "@/data/service-requests";
import { currentStep, isOpen } from "@/lib/service-requests";
import type { Task } from "@/data/tasks";
import { ASSET_CATEGORIES } from "@/data/financials";
import {
  buildBalanceSheet,
  hasFinancials,
  householdFinancials,
} from "@/lib/balance-sheet";
import { openItems } from "@/lib/open-items";
import {
  TODAY,
  ageFrom,
  householdAum,
  nextReviewDue,
  nextTouchpointDue,
  reviewCadence,
  reviewStatus,
  touchpointStatus,
  weightedPipeline,
} from "@/lib/households";

type BookSource = {
  households: Household[];
  tasks: Task[];
  serviceRequests: ServiceRequest[];
  upcomingMeetings: ScheduledMeeting[];
};

function financialSnapshot(household: Household) {
  if (!hasFinancials(household.id)) return null;
  const sheet = buildBalanceSheet(household);
  const financials = householdFinancials(household.id);
  return {
    netWorth: sheet.netWorth.totalValue,
    totalAssets: sheet.assets.totalAssets.totalValue,
    totalLiabilities: sheet.liabilities.totalLiabilities.totalValue,
    assetsByCategory: Object.fromEntries(
      ASSET_CATEGORIES.map((category) => [
        category.label,
        sheet.assets[category.key].reduce(
          (total, line) => total + line.totalValue,
          0,
        ),
      ]).filter(([, value]) => value !== 0),
    ),
    otherAssets: financials.otherAssets.map((asset) => ({
      name: asset.name,
      category: asset.category,
      owner: asset.owner,
      value: asset.value,
      valueAsOf: asset.valueAsOf,
      heldAway: asset.heldAway ?? false,
    })),
    liabilities: financials.liabilities.map((liability) => ({
      name: liability.name,
      type: liability.type,
      lender: liability.lender,
      balance: liability.balance,
      interestRatePercent: liability.interestRate,
      rateAssumed: liability.rateAssumed ?? false,
      monthlyPayment: liability.monthlyPayment,
    })),
    outOfEstate: sheet.outOfEstate.map((entity) => ({
      name: entity.name,
      type: entity.type,
      totalValue: entity.totalValue,
    })),
    beneficiaries: Object.fromEntries(
      household.accounts.map((account) => [
        account.name,
        financials.accountDetails[account.id]?.beneficiaryPrimary ?? null,
      ]),
    ),
    insurance: financials.insurance.map((policy) => ({
      type: policy.type,
      carrier: policy.carrier,
      insured: policy.insured,
      coverage: policy.coverageLabel ?? policy.coverage,
      premium: `${policy.premium} ${policy.premiumFrequency}`,
      beneficiary: policy.beneficiary ?? null,
      termEnds: policy.expires ?? null,
    })),
    goals: financials.goals.map((goal) => ({
      name: goal.name,
      category: goal.category,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
      fundedPercent: goal.fundedPercent,
      status: goal.status,
    })),
    estateDocuments: financials.estateDocuments,
    professionalTeam: financials.team,
  };
}

function householdSnapshot(
  household: Household,
  tasks: Task[],
  serviceRequests: ServiceRequest[],
) {
  return {
    id: household.id,
    name: household.name,
    type: household.type,
    tier: household.tier,
    tags: household.tags,
    leadAdvisor: household.advisor,
    clientSince: household.clientSince,
    pastClientSince: household.pastClientSince ?? null,
    estimatedAssets: household.estAssets ?? null,
    aum: householdAum(household),
    importantInformation: household.importantInfo ?? null,
    members: household.people.map((person) => ({
      name: `${person.firstName} ${person.lastName}`,
      role: person.role,
      age:
        person.dateOfBirth && person.role !== "Deceased"
          ? ageFrom(person.dateOfBirth)
          : null,
      dateOfBirth: person.dateOfBirth ?? null,
      maritalStatus: person.maritalStatus ?? null,
      occupation:
        [person.jobTitle, person.employer].filter(Boolean).join(", ") || null,
      retirementDate: person.retirementDate ?? null,
      email: person.email ?? null,
      phone: person.phone ?? null,
    })),
    accounts: household.accounts.map((account) => ({
      name: account.name,
      registration: account.registration,
      custodian: account.custodian,
      countsTowardAum: account.source === "custodian",
      balance: account.balance,
      ytdReturnPercent: account.ytdReturn,
    })),
    engagement: {
      reviewCadence:
        household.type === "Client" ? reviewCadence(household) : null,
      lastReview: household.lastReview,
      nextReviewDue: nextReviewDue(household),
      reviewStatus: reviewStatus(household),
      lastTouchpoint: household.lastTouchpoint,
      nextTouchpointDue: nextTouchpointDue(household),
      touchpointStatus: touchpointStatus(household),
    },
    opportunities: household.opportunities.map((opportunity) => ({
      name: opportunity.name,
      stage: opportunity.stage,
      value: opportunity.value,
      probabilityPercent: opportunity.probability,
      targetClose: opportunity.targetClose,
    })),
    weightedPipeline: weightedPipeline(household),
    financials: financialSnapshot(household),
    openItems: openItems(household, tasks, serviceRequests).map(
      (item) => `${item.severity}: ${item.title}`,
    ),
    recentMeetings: household.meetings.map((meeting) => ({
      title: meeting.title,
      type: meeting.type,
      date: meeting.date,
      advisor: meeting.advisor,
      summary: meeting.summary,
    })),
  };
}

export function buildBookSnapshot({
  households,
  tasks,
  serviceRequests,
  upcomingMeetings,
}: BookSource) {
  const nameOf = (id: string | null) =>
    households.find((household) => household.id === id)?.name ?? null;

  return {
    today: TODAY,
    households: households.map((household) =>
      householdSnapshot(household, tasks, serviceRequests),
    ),
    openTasks: tasks
      .filter((task) => task.status === "todo")
      .map((task) => ({
        title: task.title,
        household: nameOf(task.householdId),
        assignee: task.assignee,
        due: task.due,
        priority: task.priority,
      })),
    openServiceRequests: serviceRequests.filter(isOpen).map((request) => {
      const template = requestTemplate(request.templateKey);
      const step = currentStep(request);
      return {
        number: `SR-${request.number}`,
        title: request.title,
        type: template?.name ?? request.templateKey,
        category: template?.category ?? null,
        household: nameOf(request.householdId),
        status: request.status,
        currentStep: step ? `${step.step.name} (${step.step.role})` : null,
        owner: request.owner,
        amount: request.amount,
        openedOn: request.openedOn,
        dueOn: request.dueOn,
        nigo: request.nigoHistory.map(
          (event) => `${event.date}: ${event.reason}`,
        ),
      };
    }),
    upcomingMeetings: upcomingMeetings.map((meeting) => ({
      title: meeting.title,
      type: meeting.type,
      household: nameOf(meeting.householdId),
      date: meeting.date,
      time: meeting.time,
      advisor: meeting.advisor,
      prepNotes: meeting.prep,
    })),
  };
}
