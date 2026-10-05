import type { TagTone } from "@/data/households";

export const TASK_PRIORITIES = ["urgent", "high", "medium", "low"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const PRIORITY_TONES: Record<TaskPriority, TagTone> = {
  urgent: "red",
  high: "orange",
  medium: "amber",
  low: "neutral",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export type TaskSource =
  | "Manual"
  | "Meeting"
  | "Automation"
  | "Service request";

export type Task = {
  id: string;
  title: string;
  householdId: string | null;
  assignee: string;
  due: string | null;
  priority: TaskPriority;
  status: "todo" | "done";
  completedAt?: string;
  source: TaskSource;
  requestId?: string;
};

export const TASKS: Task[] = [
  {
    id: "t1",
    title: "Confirm Thomas Hartwell's 2026 RMD amount and distribution date",
    householdId: "hartwell",
    assignee: "Morgan Hale",
    due: "2026-10-02",
    priority: "urgent",
    status: "todo",
    source: "Service request",
    requestId: "sr-hartwell-rmd",
  },
  {
    id: "t2",
    title: "Send pre-sale gifting memo to the Reyes' CPA",
    householdId: "reyes",
    assignee: "Morgan Hale",
    due: "2026-10-04",
    priority: "high",
    status: "todo",
    source: "Meeting",
  },
  {
    id: "t3",
    title: "Schedule annual review with Victor and Helen Morales",
    householdId: "morales",
    assignee: "Priya Raman",
    due: "2026-09-25",
    priority: "high",
    status: "todo",
    source: "Automation",
  },
  {
    id: "t4",
    title:
      "Call Aaron Feldman about the Schwab rollover IRA transfer-out alert",
    householdId: "feldman",
    assignee: "Morgan Hale",
    due: "2026-10-05",
    priority: "urgent",
    status: "todo",
    source: "Automation",
  },
  {
    id: "t5",
    title: "Send account transfer forms to the Bishops",
    householdId: "bishop",
    assignee: "Morgan Hale",
    due: "2026-10-06",
    priority: "high",
    status: "todo",
    source: "Manual",
  },
  {
    id: "t6",
    title: "Prepare RSU diversification schedule for Kevin Patel",
    householdId: "patel",
    assignee: "Owen Calloway",
    due: "2026-10-08",
    priority: "medium",
    status: "todo",
    source: "Meeting",
  },
  {
    id: "t7",
    title: "Follow up on declined cash balance plan adoption agreement",
    householdId: "brooks",
    assignee: "Ruth Okafor",
    due: "2026-10-05",
    priority: "high",
    status: "todo",
    source: "Automation",
  },
  {
    id: "t8",
    title: "Send birthday card to Rosalind Avery",
    householdId: "avery",
    assignee: "Leah Moreno",
    due: "2026-10-04",
    priority: "low",
    status: "todo",
    source: "Automation",
  },
  {
    id: "t9",
    title: "Draft discovery recap for Anika Shah",
    householdId: "shah",
    assignee: "Marcus Bell",
    due: "2026-10-09",
    priority: "medium",
    status: "todo",
    source: "Manual",
  },
  {
    id: "t10",
    title: "Open Roth IRA for Brian Coleman",
    householdId: "coleman",
    assignee: "Theo Grant",
    due: "2026-10-14",
    priority: "medium",
    status: "todo",
    source: "Service request",
    requestId: "sr-coleman-roth",
  },
  {
    id: "t11",
    title: "Review Thornton account statements before proposal",
    householdId: "thornton",
    assignee: "Morgan Hale",
    due: "2026-10-12",
    priority: "medium",
    status: "todo",
    source: "Meeting",
  },
  {
    id: "t12",
    title: "Update Sullivan 529 contribution schedule",
    householdId: "sullivan",
    assignee: "Owen Calloway",
    due: null,
    priority: "low",
    status: "todo",
    source: "Manual",
  },
  {
    id: "t13",
    title: "Quarterly compliance attestation for advisor notes",
    householdId: null,
    assignee: "Morgan Hale",
    due: "2026-10-15",
    priority: "medium",
    status: "todo",
    source: "Manual",
  },
  {
    id: "t14",
    title: "Send trusted contact form to Margaret Chen via DocuSign",
    householdId: "chen",
    assignee: "Leah Moreno",
    due: "2026-09-03",
    priority: "medium",
    status: "done",
    completedAt: "2026-09-03",
    source: "Meeting",
  },
  {
    id: "t15",
    title: "Set up QCD instructions for Gregory Whitaker",
    householdId: "whitaker",
    assignee: "Marcus Bell",
    due: "2026-09-20",
    priority: "high",
    status: "done",
    completedAt: "2026-09-18",
    source: "Service request",
    requestId: "sr-whitaker-qcd",
  },
];
