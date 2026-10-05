export const NOTE_CATEGORIES = [
  "General information",
  "Client service",
  "Money movement",
  "Review",
  "Planning",
  "Compliance",
] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export type Note = {
  id: string;
  householdId: string;
  author: string;
  createdAt: string;
  category: NoteCategory;
  body: string;
  accountIds: string[];
};

export type NoteComment = {
  id: string;
  author: string;
  createdAt: string;
  body: string;
};

export const NOTES: Note[] = [
  {
    id: "note-coleman-3",
    householdId: "coleman",
    author: "Sam Ito",
    createdAt: "2026-10-03T16:20",
    category: "Money movement",
    body: "Spoke with Brian about funding the new Roth IRA on SR-1037.\n\nWe'll move $7,000 from the joint account once the account number posts, then set a $500 monthly contribution starting in November. Tasha may open her own Roth next year.",
    accountIds: ["coleman-joint", "coleman-roth"],
  },
  {
    id: "note-coleman-2",
    householdId: "coleman",
    author: "Leah Moreno",
    createdAt: "2026-09-28T10:05",
    category: "Client service",
    body: "Opened SR-1037 for Brian's Roth IRA. Digital application is queued in the Schwab portal and Brian will sign through DocuSign.",
    accountIds: [],
  },
  {
    id: "note-coleman-1",
    householdId: "coleman",
    author: "Sam Ito",
    createdAt: "2026-03-30T14:45",
    category: "General information",
    body: "Emailed Brian and Tasha the updated emergency fund summary. They asked to hold the annual review until after tax season.",
    accountIds: ["coleman-joint"],
  },
  {
    id: "note-hartwell-2",
    householdId: "hartwell",
    author: "Leah Moreno",
    createdAt: "2026-09-15T13:30",
    category: "Money movement",
    body: "Opened SR-1034 for Thomas's 2026 RMD. Distribution goes out the first week of December with 20% federal withholding, per the August check-in.",
    accountIds: ["hartwell-ira"],
  },
  {
    id: "note-hartwell-1",
    householdId: "hartwell",
    author: "Dana Whitfield",
    createdAt: "2026-08-28T11:00",
    category: "Planning",
    body: "Eleanor wants to gift appreciated shares to a donor-advised fund before year end. Pull the lots with the lowest basis from the joint account and send a short list for her to choose from.",
    accountIds: ["hartwell-joint"],
  },
  {
    id: "note-reyes-2",
    householdId: "reyes",
    author: "Marcus Bell",
    createdAt: "2026-09-24T09:40",
    category: "Planning",
    body: "Daniel expects the LOI for Reyes Logistics in February. Elena Ruiz wants the pre-sale gifting memo before she runs the 2027 projections.",
    accountIds: ["reyes-trust"],
  },
  {
    id: "note-reyes-1",
    householdId: "reyes",
    author: "Sam Ito",
    createdAt: "2026-09-28T15:10",
    category: "Client service",
    body: "Opened SR-1038 to refresh the liquidity event plan with the updated sale range and the 529 superfunding option for Mateo and Lucia.",
    accountIds: ["reyes-529-mateo", "reyes-529-lucia"],
  },
  {
    id: "note-chen-1",
    householdId: "chen",
    author: "Leah Moreno",
    createdAt: "2026-09-30T10:20",
    category: "Client service",
    body: "Margaret called about the inherited IRA. She wants to name James as primary and her grandchildren as contingent. Sent the beneficiary form for SR-1039.",
    accountIds: ["chen-inherited"],
  },
  {
    id: "note-feldman-1",
    householdId: "feldman",
    author: "Theo Grant",
    createdAt: "2026-09-24T14:05",
    category: "Money movement",
    body: "Northfield 401(k) rollover is waiting on Aaron's distribution form. Schwab also flagged a transfer-out request on the rollover IRA; Priya to confirm with Aaron before anything moves.",
    accountIds: ["feldman-rollover", "feldman-401k"],
  },
  {
    id: "note-patel-1",
    householdId: "patel",
    author: "Owen Calloway",
    createdAt: "2026-10-01T12:15",
    category: "Money movement",
    body: "Kevin's quarterly RSU sale settled. Proceeds are moving to the joint account on SR-1041 and are waiting on verification.",
    accountIds: ["patel-joint"],
  },
  {
    id: "note-whitaker-1",
    householdId: "whitaker",
    author: "Marcus Bell",
    createdAt: "2026-09-18T16:00",
    category: "Money movement",
    body: "QCD instructions are in place for Gregory's IRA. Covers $18,000 of the RMD to their church and the food bank; the balance goes out in December.",
    accountIds: ["whitaker-ira"],
  },
  {
    id: "note-brooks-1",
    householdId: "brooks",
    author: "Leah Moreno",
    createdAt: "2026-09-26T11:45",
    category: "Compliance",
    body: "Cash balance plan contribution came back NIGO: the adoption agreement was signed before the plan effective date. Called Lauren; the TPA is reissuing the agreement.",
    accountIds: [],
  },
  {
    id: "note-morales-1",
    householdId: "morales",
    author: "Theo Grant",
    createdAt: "2026-08-17T10:30",
    category: "Client service",
    body: "Submitted Victor's replacement term application. The carrier needs an attending physician statement before underwriting can finish.",
    accountIds: [],
  },
  {
    id: "note-sullivan-1",
    householdId: "sullivan",
    author: "Theo Grant",
    createdAt: "2026-09-30T09:25",
    category: "Client service",
    body: "Ethan asked to change the bank on file for 529 contributions. New instructions submitted on SR-1040; Altruist is verifying the account.",
    accountIds: ["sullivan-529"],
  },
  {
    id: "note-avery-1",
    householdId: "avery",
    author: "Ruth Okafor",
    createdAt: "2026-09-03T15:30",
    category: "General information",
    body: "Checked in with Rosalind by phone. The higher monthly income is covering her expenses, and she is planning a trip to see her daughter in November.",
    accountIds: ["avery-ira"],
  },
  {
    id: "note-thornton-1",
    householdId: "thornton",
    author: "Dana Whitfield",
    createdAt: "2026-09-29T17:05",
    category: "Review",
    body: "Discovery meeting with William and Grace, referred by the Hartwells. They want a second opinion on retiring in 2028. Statements for all four accounts are due this week.",
    accountIds: [],
  },
  {
    id: "note-shah-1",
    householdId: "shah",
    author: "Marcus Bell",
    createdAt: "2026-09-22T13:20",
    category: "General information",
    body: "Intro call with Anika. Her practice has a solo 401(k) and she is weighing a cash balance plan. Sending a discovery recap and a short questionnaire.",
    accountIds: [],
  },
  {
    id: "note-bishop-1",
    householdId: "bishop",
    author: "Priya Raman",
    createdAt: "2026-10-02T10:10",
    category: "Client service",
    body: "Samuel and Irene accepted the proposal. Opened SR-1042 for the joint brokerage ACAT; transfer forms go out once we have the latest broker statement.",
    accountIds: [],
  },
];

export const NOTE_COMMENTS: Record<string, NoteComment[]> = {
  "note-coleman-3": [
    {
      id: "comment-coleman-3-1",
      author: "Leah Moreno",
      createdAt: "2026-10-04T09:15",
      body: "Account number posted this morning. The funding request is ready for Brian's signature.",
    },
  ],
  "note-brooks-1": [
    {
      id: "comment-brooks-1-1",
      author: "Ruth Okafor",
      createdAt: "2026-09-26T14:02",
      body: "TPA confirmed the corrected agreement will be dated October 1.",
    },
  ],
};
