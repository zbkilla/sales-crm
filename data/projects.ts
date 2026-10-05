export type ProjectType = {
  id: string;
  name: string;
  milestones: string[];
};

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "onboarding",
    name: "New client onboarding",
    milestones: [
      "Discovery & paperwork",
      "Account opening",
      "Asset transfers",
      "Plan delivery",
    ],
  },
  {
    id: "annual-review",
    name: "Annual review",
    milestones: ["Prep", "Review meeting", "Follow-up"],
  },
  {
    id: "money-movement",
    name: "Money movement",
    milestones: [
      "Request received",
      "Forms signed",
      "Submitted to custodian",
      "Funds confirmed",
    ],
  },
  {
    id: "rmd",
    name: "RMD distribution",
    milestones: ["Calculate RMD", "Client approval", "Distribution sent"],
  },
];

export type ProjectStatus = "in_progress" | "completed" | "cancelled";

export type Project = {
  id: string;
  name: string;
  typeId: string;
  householdId: string;
  assignee: string;
  milestoneIndex: number;
  milestoneProgress: number;
  startDate: string;
  dueDate: string;
  status: ProjectStatus;
  completedAt?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "p-hartwell-rmd",
    name: "Hartwell 2026 RMD",
    typeId: "rmd",
    householdId: "hartwell",
    assignee: "Dana Whitfield",
    milestoneIndex: 0,
    milestoneProgress: 50,
    startDate: "2026-09-01",
    dueDate: "2026-10-01",
    status: "in_progress",
  },
  {
    id: "p-feldman-rollover",
    name: "Feldman 401(k) rollover",
    typeId: "money-movement",
    householdId: "feldman",
    assignee: "Priya Raman",
    milestoneIndex: 1,
    milestoneProgress: 30,
    startDate: "2026-09-10",
    dueDate: "2026-10-31",
    status: "in_progress",
  },
  {
    id: "p-reyes-review",
    name: "Reyes annual review",
    typeId: "annual-review",
    householdId: "reyes",
    assignee: "Marcus Bell",
    milestoneIndex: 0,
    milestoneProgress: 60,
    startDate: "2026-09-28",
    dueDate: "2026-10-20",
    status: "in_progress",
  },
  {
    id: "p-patel-review",
    name: "Patel semi-annual review",
    typeId: "annual-review",
    householdId: "patel",
    assignee: "Owen Calloway",
    milestoneIndex: 0,
    milestoneProgress: 20,
    startDate: "2026-10-01",
    dueDate: "2026-10-25",
    status: "in_progress",
  },
  {
    id: "p-brooks-plan",
    name: "Brooks cash balance plan funding",
    typeId: "money-movement",
    householdId: "brooks",
    assignee: "Ruth Okafor",
    milestoneIndex: 1,
    milestoneProgress: 0,
    startDate: "2026-08-15",
    dueDate: "2026-12-01",
    status: "in_progress",
  },
  {
    id: "p-coleman-roth",
    name: "Coleman Roth IRA opening",
    typeId: "money-movement",
    householdId: "coleman",
    assignee: "Theo Grant",
    milestoneIndex: 0,
    milestoneProgress: 40,
    startDate: "2026-09-22",
    dueDate: "2026-10-30",
    status: "in_progress",
  },
  {
    id: "p-whitaker-rmd",
    name: "Whitaker 2026 RMD via QCD",
    typeId: "rmd",
    householdId: "whitaker",
    assignee: "Marcus Bell",
    milestoneIndex: 2,
    milestoneProgress: 50,
    startDate: "2026-08-05",
    dueDate: "2026-11-15",
    status: "in_progress",
  },
  {
    id: "p-chen-review",
    name: "Chen annual review",
    typeId: "annual-review",
    householdId: "chen",
    assignee: "Dana Whitfield",
    milestoneIndex: 2,
    milestoneProgress: 100,
    startDate: "2026-08-10",
    dueDate: "2026-09-15",
    status: "completed",
    completedAt: "2026-09-12",
  },
];
