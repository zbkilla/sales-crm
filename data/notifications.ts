export type NotificationKind =
  | "mention"
  | "departure"
  | "docusign"
  | "review"
  | "task"
  | "nudge";

export type Notification = {
  id: string;
  kind: NotificationKind;
  actor?: string;
  householdId: string;
  message: string;
  quote?: string;
  time: string;
  unread: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "departure",
    householdId: "feldman",
    message: "Schwab Rollover IRA •••• 4410 transferred out to another custodian",
    time: "12m ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "mention",
    actor: "Marcus Bell",
    householdId: "reyes",
    message: "mentioned you on Daniel and Sofia Reyes",
    quote:
      "The LOI landed early. Can you join Thursday's call with their CPA to walk through the pre-sale gifting plan?",
    time: "34m ago",
    unread: true,
  },
  {
    id: "n3",
    kind: "nudge",
    householdId: "hartwell",
    message: "Thomas Hartwell has an RMD due before December 31",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n4",
    kind: "review",
    householdId: "morales",
    message: "Annual review for Victor and Helen Morales is 33 days overdue",
    time: "3h ago",
    unread: true,
  },
  {
    id: "n5",
    kind: "docusign",
    householdId: "chen",
    message: "Trusted contact form for Margaret Chen was signed",
    time: "5h ago",
    unread: false,
  },
  {
    id: "n6",
    kind: "nudge",
    householdId: "avery",
    message: "Rosalind Avery turns 80 tomorrow",
    time: "Today",
    unread: false,
  },
  {
    id: "n7",
    kind: "task",
    actor: "Leah Moreno",
    householdId: "bishop",
    message: "assigned you Send account transfer forms to the Bishops",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n8",
    kind: "nudge",
    householdId: "patel",
    message: "Job change detected: Jasmine Patel joined Lumen Health as Design Director",
    time: "2d ago",
    unread: false,
  },
  {
    id: "n9",
    kind: "docusign",
    householdId: "brooks",
    message: "Cash balance plan adoption agreement for Lauren Brooks was declined",
    time: "3d ago",
    unread: false,
  },
];
