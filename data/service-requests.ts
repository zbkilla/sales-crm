import type {
  RequestPriority,
  StepLane,
  StepRole,
} from "@/data/request-templates";

export const REQUEST_STATUSES = [
  "Intake",
  "In progress",
  "Waiting – Client",
  "Waiting – Custodian",
  "NIGO / Rework",
  "Verification",
  "Done",
  "Cancelled",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const OPEN_STATUSES: RequestStatus[] = [
  "Intake",
  "In progress",
  "Waiting – Client",
  "Waiting – Custodian",
  "NIGO / Rework",
  "Verification",
];

export const NIGO_REASONS = [
  "Missing signature",
  "Registration mismatch",
  "Missing document",
  "Outdated form",
  "Incorrect information",
  "Medallion required",
  "Other",
] as const;

export type NigoReason = (typeof NIGO_REASONS)[number];

export const OPERATIONS_TEAM = ["Leah Moreno", "Theo Grant", "Sam Ito"];

export type RequestStep = {
  name: string;
  role: StepRole;
  durationBD: number;
  dueOn: string;
  done: boolean;
  doneOn?: string;
  lane?: StepLane;
  medallion?: boolean;
  note?: string;
};

export type NigoEvent = {
  date: string;
  reason: NigoReason;
  note: string;
};

export type ServiceRequest = {
  id: string;
  number: number;
  templateKey: string;
  householdId: string;
  accountRef: string | null;
  amount: number | null;
  owner: string;
  advisor: string;
  status: RequestStatus;
  priority: RequestPriority;
  openedOn: string;
  dueOn: string;
  completedOn?: string;
  verifiedBy?: string;
  callbackVerified: boolean;
  nigoHistory: NigoEvent[];
  steps: RequestStep[];
};

export type RequestSeed = {
  id: string;
  number: number;
  templateKey: string;
  householdId: string;
  accountRef?: string;
  amount?: number;
  owner: string;
  advisor: string;
  openedOn: string;
  doneSteps: number;
  status?: RequestStatus;
  completedOn?: string;
  verifiedBy?: string;
  callbackVerified?: boolean;
  nigoHistory?: NigoEvent[];
};

export const REQUEST_SEEDS: RequestSeed[] = [
  {
    id: "sr-chen-rmd",
    number: 1031,
    templateKey: "rmd-distribution",
    householdId: "chen",
    accountRef: "Traditional IRA •••• 8127",
    amount: 41800,
    owner: "Leah Moreno",
    advisor: "Dana Whitfield",
    openedOn: "2026-08-03",
    doneSteps: 6,
    status: "Done",
    completedOn: "2026-08-10",
    verifiedBy: "Morgan Hale",
    callbackVerified: true,
  },
  {
    id: "sr-morales-life",
    number: 1032,
    templateKey: "life-insurance-app",
    householdId: "morales",
    accountRef: "Term life, $1M face",
    amount: 1000000,
    owner: "Theo Grant",
    advisor: "Priya Raman",
    openedOn: "2026-08-17",
    doneSteps: 6,
    status: "Waiting – Custodian",
  },
  {
    id: "sr-whitaker-qcd",
    number: 1033,
    templateKey: "qcd",
    householdId: "whitaker",
    accountRef: "Traditional IRA •••• 1451",
    amount: 40000,
    owner: "Leah Moreno",
    advisor: "Marcus Bell",
    openedOn: "2026-09-01",
    doneSteps: 6,
    status: "Done",
    completedOn: "2026-09-10",
    verifiedBy: "Morgan Hale",
  },
  {
    id: "sr-hartwell-rmd",
    number: 1034,
    templateKey: "rmd-distribution",
    householdId: "hartwell",
    accountRef: "Traditional IRA •••• 2214",
    amount: 68400,
    owner: "Leah Moreno",
    advisor: "Dana Whitfield",
    openedOn: "2026-09-15",
    doneSteps: 1,
  },
  {
    id: "sr-feldman-rollover",
    number: 1035,
    templateKey: "rollover-401k",
    householdId: "feldman",
    accountRef: "Northfield 401(k) •••• 0091",
    amount: 410000,
    owner: "Theo Grant",
    advisor: "Priya Raman",
    openedOn: "2026-09-24",
    doneSteps: 2,
  },
  {
    id: "sr-brooks-ach",
    number: 1036,
    templateKey: "ach-one-time",
    householdId: "brooks",
    accountRef: "Individual •••• 3071",
    amount: 45000,
    owner: "Leah Moreno",
    advisor: "Ruth Okafor",
    openedOn: "2026-09-25",
    doneSteps: 2,
    status: "NIGO / Rework",
    callbackVerified: true,
    nigoHistory: [
      {
        date: "2026-10-01",
        reason: "Missing signature",
        note: "Plan adoption agreement was declined in DocuSign; resend with the corrected plan year.",
      },
    ],
  },
  {
    id: "sr-coleman-roth",
    number: 1037,
    templateKey: "new-account-ira",
    householdId: "coleman",
    accountRef: "Roth IRA (new)",
    owner: "Theo Grant",
    advisor: "Sam Ito",
    openedOn: "2026-09-28",
    doneSteps: 2,
  },
  {
    id: "sr-reyes-plan",
    number: 1038,
    templateKey: "plan-update",
    householdId: "reyes",
    owner: "Sam Ito",
    advisor: "Marcus Bell",
    openedOn: "2026-09-28",
    doneSteps: 2,
  },
  {
    id: "sr-chen-beneficiary",
    number: 1039,
    templateKey: "beneficiary-change",
    householdId: "chen",
    accountRef: "Inherited IRA •••• 8130",
    owner: "Leah Moreno",
    advisor: "Dana Whitfield",
    openedOn: "2026-09-29",
    doneSteps: 3,
  },
  {
    id: "sr-sullivan-bank",
    number: 1040,
    templateKey: "bank-change",
    householdId: "sullivan",
    accountRef: "Joint •••• 6604",
    owner: "Theo Grant",
    advisor: "Owen Calloway",
    openedOn: "2026-09-30",
    doneSteps: 4,
    status: "Waiting – Custodian",
    callbackVerified: true,
  },
  {
    id: "sr-patel-journal",
    number: 1041,
    templateKey: "internal-journal",
    householdId: "patel",
    accountRef: "Joint •••• 2290",
    amount: 120000,
    owner: "Leah Moreno",
    advisor: "Owen Calloway",
    openedOn: "2026-10-01",
    doneSteps: 5,
  },
  {
    id: "sr-bishop-acat",
    number: 1042,
    templateKey: "acat-full-in",
    householdId: "bishop",
    accountRef: "Joint brokerage at current broker",
    amount: 1200000,
    owner: "Theo Grant",
    advisor: "Priya Raman",
    openedOn: "2026-10-02",
    doneSteps: 0,
  },
];
