"use client";

import { useState } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import { ScrollArea } from "@/components/_ui/scroll-area";
import HouseholdMark from "@/components/_common/household-mark";
import { FollowUpTag, SegmentTags } from "@/components/_common/household-tags";
import PageHeader from "@/components/_common/page-header";
import HouseholdMembers from "@/components/households/detail/household-members";
import Portfolio from "@/components/households/detail/portfolio";
import Opportunities from "@/components/households/detail/opportunities";
import Engagement from "@/components/households/detail/engagement";
import MeetingCard from "@/components/households/detail/meeting-card";
import { TaskList } from "@/components/households/detail/work-items";
import RequestList from "@/components/service-requests/request-list";
import ProfileSection from "./profile-section";
import BalanceSheetTable from "./balance-sheet-table";
import AssetComposition from "./asset-composition";
import DataTable from "./data-table";
import OpenItemsList from "./open-items-list";
import GoalsGrid from "./goals-grid";
import {
  MEETING_TONES,
  advisorByName,
  type Household,
} from "@/data/households";
import type { InsurancePolicy, Liability, OwnerType } from "@/data/financials";
import {
  accountOwner,
  buildBalanceSheet,
  formatRate,
  hasFinancials,
  heldAwayAssets,
  householdFinancials,
  spouseOf,
  taxTreatment,
} from "@/lib/balance-sheet";
import {
  TODAY,
  followUpDue,
  followUpStatus,
  formatCompactMoney,
  formatDate,
  formatMoney,
  householdAum,
  memberCount,
} from "@/lib/households";
import { openItems } from "@/lib/open-items";
import { isOpen } from "@/lib/service-requests";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { useHouseholdsStore } from "@/stores/households-store";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "balance-sheet", label: "Balance sheet" },
  { value: "accounts", label: "Accounts & debts" },
  { value: "protection", label: "Protection & estate" },
  { value: "requests", label: "Service requests" },
  { value: "planning", label: "Planning" },
  { value: "activity", label: "Activity" },
];

type HouseholdProfileProps = {
  id: string;
};

export default function HouseholdProfile({ id }: HouseholdProfileProps) {
  const hydrated = useHydrated();
  const household = useHouseholdsStore((state) =>
    state.households.find((item) => item.id === id),
  );

  if (!household) {
    return (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader
          title={hydrated ? "Household not found" : "Loading household"}
          backHref="/"
          backLabel="Households"
          tabs={[]}
          activeTab=""
          onTabChange={() => {}}
        />
        {hydrated && (
          <p className="text-soft p-6">
            This household doesn’t exist in this book. It may have been removed
            when the demo data was reset.
          </p>
        )}
      </section>
    );
  }

  return <HouseholdProfileView household={household} />;
}

function HouseholdProfileView({ household }: { household: Household }) {
  const [tab, setTab] = useState("overview");
  const tasks = useHouseholdsStore((state) => state.tasks);
  const serviceRequests = useHouseholdsStore((state) => state.serviceRequests);
  const openNewRequest = useHouseholdsStore((state) => state.openNewRequest);
  const upcomingMeetings = useHouseholdsStore(
    (state) => state.upcomingMeetings,
  );
  const openProfile = useHouseholdsStore((state) => state.openProfile);
  const promoteToClient = useHouseholdsStore((state) => state.promoteToClient);
  const restoreToClient = useHouseholdsStore((state) => state.restoreToClient);
  const logReview = useHouseholdsStore((state) => state.logReview);
  const logTouchpoint = useHouseholdsStore((state) => state.logTouchpoint);
  const toggleTask = useHouseholdsStore((state) => state.toggleTask);
  const askAssistant = useHouseholdsStore((state) => state.askAssistant);

  const financials = householdFinancials(household.id);
  const sheet = buildBalanceSheet(household);
  const items = openItems(household, tasks, serviceRequests);
  const advisor = advisorByName(household.advisor);
  const spouse = spouseOf(household);
  const head = household.people.find(
    (person) => person.role === "Head of household",
  );
  const due = followUpDue(household);
  const status = followUpStatus(household);
  const householdTasks = tasks.filter(
    (task) => task.householdId === household.id && task.status === "todo",
  );
  const householdRequests = serviceRequests
    .filter((request) => request.householdId === household.id)
    .sort((a, b) => b.openedOn.localeCompare(a.openedOn));
  const openRequests = householdRequests.filter(isOpen);
  const closedRequests = householdRequests.filter(
    (request) => !isOpen(request),
  );
  const householdMeetings = upcomingMeetings
    .filter((meeting) => meeting.householdId === household.id)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const tracked = hasFinancials(household.id);

  function ownerName(owner: OwnerType) {
    if (owner === "Joint") return "Joint";
    if (owner === "Spouse") return spouse?.firstName ?? "Spouse";
    return head?.firstName ?? "Client";
  }

  function runPrimary() {
    if (household.type === "Prospect") promoteToClient(household.id);
    else if (household.type === "Past client") restoreToClient(household.id);
    else logReview(household.id);
  }

  const primaryLabel =
    household.type === "Prospect"
      ? "Promote to client"
      : household.type === "Past client"
        ? "Restore to client"
        : "Log review";

  const stats = [
    {
      label: "Net worth",
      value: tracked ? formatCompactMoney(sheet.netWorth.totalValue) : "—",
      note: tracked ? "In estate" : "No balance sheet yet",
    },
    {
      label: "Total assets",
      value: tracked
        ? formatCompactMoney(sheet.assets.totalAssets.totalValue)
        : (household.estAssets ?? "—"),
      note: tracked ? "All categories" : household.estAssets ? "Estimated" : "",
    },
    {
      label: "Liabilities",
      value: tracked
        ? formatCompactMoney(sheet.liabilities.totalLiabilities.totalValue)
        : "—",
      note: `${financials.liabilities.length} on record`,
    },
    {
      label: "AUM",
      value: formatCompactMoney(householdAum(household)),
      note: "Custodian accounts",
    },
    {
      label: "Held away",
      value: tracked ? formatCompactMoney(heldAwayAssets(sheet)) : "—",
      note: "Outside our management",
    },
  ];

  const liabilityColumns = [
    {
      key: "name",
      label: "Liability",
      render: (row: Liability) => (
        <span className="flex flex-col gap-0.5">
          {row.name}
          <span className="caption-style text-subtle">
            {row.type} · {row.lender}
          </span>
        </span>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      render: (row: Liability) => ownerName(row.owner),
    },
    {
      key: "rate",
      label: "Rate",
      align: "right" as const,
      render: (row: Liability) => (
        <span className={cn(row.rateAssumed && "text-warning")}>
          {formatRate(row.interestRate)}
          {row.rateAssumed ? " est." : ""}
        </span>
      ),
    },
    {
      key: "payment",
      label: "Monthly",
      align: "right" as const,
      render: (row: Liability) => `$${formatMoney(row.monthlyPayment)}`,
    },
    {
      key: "balance",
      label: "Balance",
      align: "right" as const,
      render: (row: Liability) => `$${formatMoney(row.balance)}`,
    },
    {
      key: "secured",
      label: "Secured by",
      render: (row: Liability) =>
        financials.otherAssets.find((asset) => asset.id === row.linkedAssetId)
          ?.name ?? <span className="text-subtle">Unsecured</span>,
    },
  ];

  const insuranceColumns = [
    {
      key: "type",
      label: "Policy",
      render: (row: InsurancePolicy) => (
        <span className="flex flex-col gap-0.5">
          {row.type}
          <span className="caption-style text-subtle">{row.carrier}</span>
        </span>
      ),
    },
    {
      key: "insured",
      label: "Insured",
      render: (row: InsurancePolicy) => row.insured,
    },
    {
      key: "owner",
      label: "Owner",
      render: (row: InsurancePolicy) => row.owner,
    },
    {
      key: "coverage",
      label: "Coverage",
      align: "right" as const,
      render: (row: InsurancePolicy) =>
        row.coverageLabel ?? `$${formatMoney(row.coverage)}`,
    },
    {
      key: "premium",
      label: "Premium",
      align: "right" as const,
      render: (row: InsurancePolicy) =>
        `$${formatMoney(row.premium)}/${row.premiumFrequency === "Monthly" ? "mo" : row.premiumFrequency === "Quarterly" ? "qtr" : "yr"}`,
    },
    {
      key: "beneficiary",
      label: "Beneficiary",
      render: (row: InsurancePolicy) =>
        row.beneficiary ??
        (row.type.includes("life") ? (
          <span className="text-warning">Missing</span>
        ) : (
          <span className="text-subtle">n/a</span>
        )),
    },
    {
      key: "expires",
      label: "Term ends",
      render: (row: InsurancePolicy) =>
        row.expires ? (
          formatDate(row.expires)
        ) : (
          <span className="text-subtle">—</span>
        ),
    },
  ];

  const accountColumns = [
    {
      key: "account",
      label: "Account",
      render: (row: Household["accounts"][number]) => (
        <span className="flex flex-col gap-0.5">
          {row.name}
          <span className="caption-style text-subtle">
            {row.registration} · {row.custodian} •••• {row.numberLast4}
          </span>
        </span>
      ),
    },
    {
      key: "tax",
      label: "Tax treatment",
      render: (row: Household["accounts"][number]) => taxTreatment(row),
    },
    {
      key: "owner",
      label: "Owner",
      render: (row: Household["accounts"][number]) =>
        ownerName(accountOwner(household, row)),
    },
    {
      key: "primary",
      label: "Primary beneficiary",
      render: (row: Household["accounts"][number]) =>
        financials.accountDetails[row.id]?.beneficiaryPrimary ?? (
          <span className={cn(tracked ? "text-warning" : "text-subtle")}>
            {tracked ? "Not on file" : "—"}
          </span>
        ),
    },
    {
      key: "contingent",
      label: "Contingent",
      render: (row: Household["accounts"][number]) =>
        financials.accountDetails[row.id]?.beneficiaryContingent ?? (
          <span className="text-subtle">—</span>
        ),
    },
    {
      key: "balance",
      label: "Balance",
      align: "right" as const,
      render: (row: Household["accounts"][number]) =>
        `$${formatMoney(row.balance)}`,
    },
  ];

  return (
    <section
      id="household-profile"
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <PageHeader
        title={household.name}
        backHref="/"
        backLabel="Households"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
      />

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          <div className="border-line-strong flex flex-col gap-4 rounded-xl border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <HouseholdMark
                name={household.name}
                className="size-[50px] rounded-[12.5px] shadow-[0px_6.25px_6.25px_0px_rgba(15,15,15,0.24),0px_0px_0px_1.563px_#232323]"
                textClassName="h2-style"
              />
              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-[3px]">
                  <SegmentTags household={household} size="sm" limit={false} />
                </div>
                <span className="caption-style text-soft flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>
                    {memberCount(household)}{" "}
                    {memberCount(household) === 1 ? "member" : "members"}
                  </span>
                  {household.clientSince && (
                    <span>
                      Client since {formatDate(household.clientSince)}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="none"
                    onClick={() => openProfile(household.advisor)}
                    className="text-soft gap-1.5 rounded-md px-1 py-0.5 font-normal"
                  >
                    <Avatar src={advisor.avatar} alt="" className="size-4" />
                    {advisor.name}
                  </Button>
                  {due && status && (
                    <span className="flex items-center gap-1.5">
                      {household.type === "Client"
                        ? "Next review"
                        : "Next touchpoint"}{" "}
                      {formatDate(due)}
                      <FollowUpTag status={status} />
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  askAssistant(
                    `Brief me on the ${household.name} household: balance sheet, open items, and what to cover at our next meeting.`,
                  )
                }
              >
                Ask AgentOS
              </Button>
              {household.type !== "Past client" && (
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => openNewRequest(household.id)}
                >
                  New request
                </Button>
              )}
              {household.type !== "Past client" && (
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => logTouchpoint(household.id, "Call")}
                >
                  Log call
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={runPrimary}>
                {primaryLabel}
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-line-strong flex flex-col gap-2 rounded-lg border p-3"
              >
                <dt className="caption-style text-soft">{stat.label}</dt>
                <dd className="flex flex-col gap-1">
                  <span className="text-[22px] leading-none font-semibold tabular-nums">
                    {stat.value}
                  </span>
                  <span className="caption-style text-subtle">{stat.note}</span>
                </dd>
              </div>
            ))}
          </dl>

          {tab === "overview" && (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="flex min-w-0 flex-col gap-4">
                <ProfileSection
                  title={`Open items · ${items.length}`}
                  description="Unconfirmed, stale or overdue records to resolve before the next touchpoint."
                >
                  <OpenItemsList items={items} />
                </ProfileSection>
                {tracked && (
                  <ProfileSection
                    title="Asset composition"
                    action={
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTab("balance-sheet")}
                      >
                        Full balance sheet
                      </Button>
                    }
                  >
                    <AssetComposition sheet={sheet} />
                  </ProfileSection>
                )}
                <ProfileSection title="Engagement">
                  <Engagement household={household} scale={1} />
                </ProfileSection>
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                {openRequests.length > 0 && (
                  <ProfileSection
                    title={`Service requests · ${openRequests.length} open`}
                    action={
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTab("requests")}
                      >
                        View all
                      </Button>
                    }
                  >
                    <RequestList requests={openRequests} />
                  </ProfileSection>
                )}
                <ProfileSection title="Household">
                  <HouseholdMembers
                    household={household}
                    onOpenAdvisor={() => openProfile(household.advisor)}
                  />
                </ProfileSection>
                <ProfileSection title="Professional team">
                  {financials.team.length > 0 ? (
                    <ul className="flex flex-col gap-2.5">
                      {financials.team.map((member) => (
                        <li
                          key={`${member.role}-${member.name}`}
                          className="flex flex-col gap-0.5"
                        >
                          <span>{member.name}</span>
                          <span className="caption-style text-subtle">
                            {member.role}
                            {member.firm ? ` · ${member.firm}` : ""}
                            {member.email ? ` · ${member.email}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="caption-style text-subtle">
                      No CPA, attorney or other professionals linked yet.
                    </p>
                  )}
                </ProfileSection>
                <ProfileSection title="Upcoming meetings">
                  {householdMeetings.length > 0 ? (
                    <ul className="flex flex-col gap-3">
                      {householdMeetings.map((meeting) => (
                        <li key={meeting.id} className="flex flex-col gap-1.5">
                          <span className="flex flex-wrap items-center gap-2">
                            {meeting.title}
                            <Tag tone={MEETING_TONES[meeting.type]} size="sm">
                              {meeting.type}
                            </Tag>
                          </span>
                          <span className="caption-style text-subtle tabular-nums">
                            {formatDate(meeting.date)} at {meeting.time} ·{" "}
                            {meeting.location} · {meeting.advisor}
                          </span>
                          <p className="caption-style text-soft">
                            {meeting.prep}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="caption-style text-subtle">
                      Nothing scheduled.
                    </p>
                  )}
                </ProfileSection>
              </div>
            </div>
          )}

          {tab === "balance-sheet" &&
            (tracked ? (
              <div className="flex flex-col gap-4">
                <ProfileSection title="Asset composition">
                  <AssetComposition sheet={sheet} />
                </ProfileSection>
                <ProfileSection
                  title="Balance sheet · in estate"
                  description="Grouped by eMoney balance sheet category, split by owner. Liabilities shown in parentheses; values as of the date on each line."
                >
                  <BalanceSheetTable sheet={sheet} />
                </ProfileSection>
                <ProfileSection
                  title="Out of estate"
                  description="Trusts and entities that hold assets outside the taxable estate."
                >
                  {sheet.outOfEstate.length > 0 ? (
                    <ul className="flex flex-col gap-3">
                      {sheet.outOfEstate.map((entity) => (
                        <li
                          key={entity.id}
                          className="border-line-strong flex flex-col gap-2 rounded-lg border p-3"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <span className="flex flex-col gap-0.5">
                              <span className="font-medium">{entity.name}</span>
                              <span className="caption-style text-subtle">
                                {entity.type}
                              </span>
                            </span>
                            <span className="tabular-nums">
                              ${formatMoney(entity.totalValue)}
                            </span>
                          </div>
                          <ul className="caption-style text-soft flex flex-col gap-1">
                            {entity.assets.map((asset) => (
                              <li
                                key={asset.name}
                                className="flex justify-between gap-2"
                              >
                                <span>
                                  {asset.name} · {asset.type}
                                </span>
                                <span className="tabular-nums">
                                  ${formatMoney(asset.value)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="caption-style text-subtle">
                      No out-of-estate trusts or entities.
                    </p>
                  )}
                </ProfileSection>
              </div>
            ) : (
              <ProfileSection title="Balance sheet">
                <p className="text-soft">
                  No balance sheet has been built for this household yet.
                  {household.estAssets
                    ? ` Estimated assets from discovery: ${household.estAssets}.`
                    : ""}{" "}
                  Gather statements at the next meeting to add accounts,
                  property and debts.
                </p>
              </ProfileSection>
            ))}

          {tab === "accounts" && (
            <div className="flex flex-col gap-4">
              {household.accounts.length > 0 && (
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                  <ProfileSection title="Managed portfolio">
                    <Portfolio household={household} />
                  </ProfileSection>
                  <ProfileSection
                    title="Registrations & beneficiaries"
                    description="Tax treatment and beneficiary designations by account."
                  >
                    <DataTable
                      caption="Accounts with tax treatment and beneficiaries"
                      columns={accountColumns}
                      rows={household.accounts}
                      rowKey={(row) => row.id}
                      empty="No accounts."
                    />
                  </ProfileSection>
                </div>
              )}
              <ProfileSection
                title="Liabilities"
                description={
                  financials.liabilities.length > 0
                    ? `$${formatMoney(financials.liabilities.reduce((total, row) => total + row.monthlyPayment, 0))} in monthly payments across ${financials.liabilities.length} debts.`
                    : undefined
                }
              >
                <DataTable
                  caption="Liabilities with rates, payments and collateral"
                  columns={liabilityColumns}
                  rows={financials.liabilities}
                  rowKey={(row) => row.id}
                  empty="No liabilities on record."
                />
              </ProfileSection>
            </div>
          )}

          {tab === "protection" && (
            <div className="flex flex-col gap-4">
              <ProfileSection title="Insurance">
                <DataTable
                  caption="Insurance policies"
                  columns={insuranceColumns}
                  rows={financials.insurance}
                  rowKey={(row) => row.id}
                  empty="No insurance policies on record."
                />
              </ProfileSection>
              <div className="grid gap-4 lg:grid-cols-2">
                <ProfileSection title="Estate documents">
                  {financials.estateDocuments.length > 0 ? (
                    <ul className="divide-line-strong flex flex-col divide-y">
                      {financials.estateDocuments.map((document) => (
                        <li
                          key={document.name}
                          className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                        >
                          <span className="flex flex-col gap-0.5">
                            {document.name}
                            <span className="caption-style text-subtle">
                              {document.signed
                                ? `Signed ${formatDate(document.signed)}`
                                : "Not signed"}
                            </span>
                          </span>
                          <Tag
                            tone={
                              document.status === "Current"
                                ? "green"
                                : document.status === "Missing"
                                  ? "red"
                                  : "amber"
                            }
                            size="sm"
                          >
                            {document.status}
                          </Tag>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="caption-style text-subtle">
                      No estate documents recorded.
                    </p>
                  )}
                </ProfileSection>
                <ProfileSection title="Out-of-estate trusts & entities">
                  {sheet.outOfEstate.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {sheet.outOfEstate.map((entity) => (
                        <li
                          key={entity.id}
                          className="flex items-baseline justify-between gap-2"
                        >
                          <span className="flex flex-col gap-0.5">
                            {entity.name}
                            <span className="caption-style text-subtle">
                              {entity.type}
                            </span>
                          </span>
                          <span className="tabular-nums">
                            ${formatMoney(entity.totalValue)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="caption-style text-subtle">None.</p>
                  )}
                </ProfileSection>
              </div>
            </div>
          )}

          {tab === "planning" && (
            <div className="flex flex-col gap-4">
              <ProfileSection title="Goals">
                <GoalsGrid goals={financials.goals} />
              </ProfileSection>
              <div className="grid gap-4 lg:grid-cols-2">
                <ProfileSection title="Opportunities">
                  {household.opportunities.length > 0 ? (
                    <Opportunities household={household} />
                  ) : (
                    <p className="caption-style text-subtle">
                      No open opportunities.
                    </p>
                  )}
                </ProfileSection>
                <ProfileSection title="Open tasks">
                  {householdTasks.length > 0 ? (
                    <TaskList tasks={householdTasks} onToggle={toggleTask} />
                  ) : (
                    <p className="caption-style text-subtle">No open tasks.</p>
                  )}
                </ProfileSection>
              </div>
            </div>
          )}

          {tab === "requests" && (
            <div className="grid gap-4 xl:grid-cols-2">
              <ProfileSection
                title={`Open · ${openRequests.length}`}
                action={
                  household.type !== "Past client" ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openNewRequest(household.id)}
                    >
                      New request
                    </Button>
                  ) : undefined
                }
              >
                {openRequests.length > 0 ? (
                  <RequestList requests={openRequests} />
                ) : (
                  <p className="caption-style text-subtle">
                    No open service requests.
                  </p>
                )}
              </ProfileSection>
              <ProfileSection title={`Completed · ${closedRequests.length}`}>
                {closedRequests.length > 0 ? (
                  <RequestList requests={closedRequests} />
                ) : (
                  <p className="caption-style text-subtle">
                    No completed requests yet.
                  </p>
                )}
              </ProfileSection>
            </div>
          )}

          {tab === "activity" && (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <ProfileSection title="Engagement">
                <Engagement household={household} scale={1} />
              </ProfileSection>
              <ProfileSection title="Meeting history">
                {household.meetings.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {household.meetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                ) : (
                  <p className="caption-style text-subtle">
                    No meetings logged yet.
                  </p>
                )}
              </ProfileSection>
            </div>
          )}

          <p className="caption-style text-subtle pb-2">
            Custodian balances sync nightly; other values are as of the date
            shown on each line. Today is {formatDate(TODAY)}.
          </p>
        </div>
      </ScrollArea>
    </section>
  );
}
