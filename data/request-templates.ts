export const REQUEST_CATEGORIES = [
  "Account Opening",
  "Money Movement",
  "Asset Transfer",
  "Maintenance",
  "Planning",
  "Insurance",
  "Compliance/Recurring",
  "Estate/Exception",
] as const;

export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];

export const STEP_ROLES = [
  "CSA",
  "Advisor",
  "Principal",
  "Client",
  "Planner",
  "External",
] as const;

export type StepRole = (typeof STEP_ROLES)[number];

export type RequestPriority = "Normal" | "High" | "Critical";

export type StepLane = "custodian" | "docusign";

export const LANE_LABELS: Record<StepLane, string> = {
  custodian: "Custodian portal",
  docusign: "DocuSign",
};

export type TemplateStep = {
  name: string;
  role: StepRole;
  durationBD: number;
  lane?: StepLane;
  medallion?: boolean;
  note?: string;
};

export type RequestTemplate = {
  key: string;
  name: string;
  category: RequestCategory;
  slaBD: number;
  priority: RequestPriority;
  nigoRisks: string;
  steps: TemplateStep[];
};

export const MONEY_CATEGORIES: RequestCategory[] = [
  "Money Movement",
  "Asset Transfer",
];

export const REQUEST_TEMPLATES: RequestTemplate[] = [
  {
    key: "new-account-brokerage",
    name: "New Account - Individual/Joint Brokerage",
    category: "Account Opening",
    slaBD: 5,
    priority: "Normal",
    nigoRisks:
      "Registration mismatch vs intended titling; TOD designation missed; features (margin/options) unchecked.",
    steps: [
      {
        name: "Collect registration details and confirm account type/features (TOD, margin, options)",
        role: "CSA",
        durationBD: 1,
      },
      { name: "Verify ID/KYC data current in CRM", role: "CSA", durationBD: 0 },
      {
        name: "Prepare digital account open in custodian portal",
        role: "CSA",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Principal pre-submission review of application",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "Client e-signs application",
        role: "Client",
        durationBD: 2,
        lane: "custodian",
      },
      {
        name: "Confirm account number issued; record registration + last-4",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Set up e-delivery and online access",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Chain funding request if applicable (money movement/transfer)",
        role: "CSA",
        durationBD: 0,
        note: "Spawn linked request; do not fund inside this one.",
      },
      { name: "Update CRM and billing group", role: "CSA", durationBD: 0 },
      {
        name: "Close out and file (books and records)",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "new-account-ira",
    name: "New Account - IRA (Traditional/Roth)",
    category: "Account Opening",
    slaBD: 5,
    priority: "Normal",
    nigoRisks:
      "Wrong IRA type selected; beneficiary designation skipped at open; contribution year mis-coded.",
    steps: [
      {
        name: "Confirm IRA type and funding path (contribution vs rollover vs transfer)",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Advisor confirms eligibility notes (Roth MAGI, contribution limits)",
        role: "Advisor",
        durationBD: 0,
      },
      {
        name: "Prepare digital account open in custodian portal",
        role: "CSA",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Principal pre-submission review of application",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "Client e-signs application",
        role: "Client",
        durationBD: 2,
        lane: "custodian",
      },
      {
        name: "Confirm account number issued; record registration + last-4",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Record beneficiary designations (primary/contingent with percentages)",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Set up e-delivery and online access",
        role: "CSA",
        durationBD: 0,
      },
      { name: "Update CRM and billing group", role: "CSA", durationBD: 0 },
      {
        name: "Close out and file (books and records)",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "new-account-trust",
    name: "New Account - Trust",
    category: "Account Opening",
    slaBD: 7,
    priority: "Normal",
    nigoRisks:
      "Trust certification pages missing/stale; trustee signatures incomplete; titling mismatch vs trust document.",
    steps: [
      {
        name: "Collect trust certification pages and trustee information",
        role: "Client",
        durationBD: 2,
      },
      {
        name: "Review trust document against custodian requirements checklist",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Prepare application and trustee certification",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Principal pre-submission review of application",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "All trustees e-sign",
        role: "Client",
        durationBD: 2,
        lane: "custodian",
      },
      {
        name: "Submit; resolve custodian document review comments",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Confirm account open and titling exactly matches trust",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Set up e-delivery; update CRM and billing",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Close out and file (books and records)",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "rollover-401k",
    name: "401(k) Rollover to IRA",
    category: "Account Opening",
    slaBD: 15,
    priority: "High",
    nigoRisks:
      "Indirect rollover 60-day clock; check made out incorrectly; tax coding not G; plan-side delays. SLA is end-to-end; direct rollover processing itself runs 5-10 BD once initiated.",
    steps: [
      {
        name: "Advisor confirms rollover strategy (direct vs indirect; employer stock/NUA check)",
        role: "Advisor",
        durationBD: 1,
      },
      {
        name: "Open receiving IRA if needed (chain new-account-ira request)",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Client initiates distribution with plan administrator (three-way call best practice)",
        role: "Client",
        durationBD: 2,
      },
      {
        name: "Document instructions and expected amount; if indirect, calendar the 60-day deposit deadline",
        role: "CSA",
        durationBD: 0,
        note: "60-day clock is statutory - missing it makes the distribution taxable.",
      },
      {
        name: "Track check/ACH issuance from plan",
        role: "External",
        durationBD: 8,
        note: "Plan-side wait; follow up weekly.",
      },
      {
        name: "Deposit and confirm funds posted as rollover contribution",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Verify expected tax coding (1099-R code G) documented",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Invest proceeds per advisor instructions",
        role: "Advisor",
        durationBD: 1,
      },
      {
        name: "Update CRM; confirm completion to client",
        role: "CSA",
        durationBD: 1,
      },
      { name: "Principal review and file", role: "Principal", durationBD: 1 },
    ],
  },
  {
    key: "ach-one-time",
    name: "ACH - One-Time Distribution/Contribution",
    category: "Money Movement",
    slaBD: 3,
    priority: "Normal",
    nigoRisks:
      "Bank instructions not on file; IRA withholding election missing; wrong direction/amount.",
    steps: [
      {
        name: "Confirm instructions: amount, direction, accounts, tax withholding if IRA",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Verify bank instructions on file (chain bank-change request if missing)",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Verbal callback verification for distribution requests",
        role: "CSA",
        durationBD: 1,
        note: "Fraud control - mark Callback Verified on the request.",
      },
      {
        name: "Enter ACH in custodian portal",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Confirm settlement (1-3 business days)",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Log completion; notify client and advisor",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "wire-transfer",
    name: "Wire Transfer",
    category: "Money Movement",
    slaBD: 2,
    priority: "High",
    nigoRisks:
      "Cutoff missed; callback skipped (fraud exposure); beneficiary bank details transposed. Same-day execution possible before cutoff; SLA allows one day for LOA signature.",
    steps: [
      {
        name: "Confirm wire details in writing and cutoff feasibility",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Verbal callback verification (mandatory, any amount)",
        role: "CSA",
        durationBD: 0,
        note: "Fraud control - mark Callback Verified.",
      },
      {
        name: "Prepare wire request/LOA",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Principal pre-submission review of wire instructions",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "Client signs LOA if required",
        role: "Client",
        durationBD: 1,
        lane: "custodian",
      },
      { name: "Submit before custodian cutoff", role: "CSA", durationBD: 0 },
      {
        name: "Confirm Fed reference number / receipt",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Log completion; notify client and advisor",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "internal-journal",
    name: "Internal Journal Between Accounts",
    category: "Money Movement",
    slaBD: 2,
    priority: "Normal",
    nigoRisks:
      "Registration mismatch triggers gift/authorization requirements; wrong asset vs cash journal.",
    steps: [
      {
        name: "Confirm from/to accounts and assets or cash to journal",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Check registration match; flag gift/authorization implications if registrations differ",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Obtain client authorization if required",
        role: "Client",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Submit journal in custodian portal",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      { name: "Verify posted correctly", role: "CSA", durationBD: 1 },
    ],
  },
  {
    key: "rmd-distribution",
    name: "RMD Distribution",
    category: "Money Movement",
    slaBD: 5,
    priority: "High",
    nigoRisks:
      "Custodian RMD calc mismatch; withholding election stale; Dec 31 deadline (25% excise on shortfall).",
    steps: [
      {
        name: "Pull current-year RMD amount from custodian; reconcile against own calculation",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Advisor confirms withholding elections and destination with client",
        role: "Advisor",
        durationBD: 1,
      },
      {
        name: "Verbal verification if instructions are new or changed",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Enter distribution in custodian portal",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Confirm processed; flag YTD RMD satisfied",
        role: "CSA",
        durationBD: 1,
      },
      { name: "Update RMD tracking and CRM", role: "CSA", durationBD: 1 },
    ],
  },
  {
    key: "qcd",
    name: "Qualified Charitable Distribution (QCD)",
    category: "Money Movement",
    slaBD: 7,
    priority: "Normal",
    nigoRisks:
      "Charity payee details wrong; client under 70.5; annual QCD limit exceeded; hard Dec 31 deadline with year-end custodian backlog - initiate by early December.",
    steps: [
      {
        name: "Confirm charity payee details and amount vs remaining RMD",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Advisor verifies age 70.5+ eligibility and annual QCD limit headroom",
        role: "Advisor",
        durationBD: 1,
      },
      {
        name: "Prepare check-to-charity request",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Client signs if required",
        role: "Client",
        durationBD: 2,
        lane: "custodian",
      },
      {
        name: "Submit; confirm check issued and mailed",
        role: "CSA",
        durationBD: 2,
      },
      {
        name: "Record for 1099-R notation; memo to client's CPA",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "acat-full-in",
    name: "ACAT - Full Transfer In",
    category: "Asset Transfer",
    slaBD: 10,
    priority: "High",
    nigoRisks:
      "Contra statement stale (>90 days); registration mismatch (top ACAT reject); proprietary funds not flagged for liquidation. SLA is end-to-end; the custodian ACAT window itself is 5-7 BD in good order, account frozen during transfer.",
    steps: [
      {
        name: "Collect recent contra-firm statement from client",
        role: "Client",
        durationBD: 1,
      },
      {
        name: "Advisor reviews holdings: in-kind eligibility, proprietary funds, liquidation needs",
        role: "Advisor",
        durationBD: 0,
      },
      {
        name: "Open receiving account if needed (chain new-account request)",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Prepare TOA / digital transfer with exact registration match",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Principal pre-submission review of transfer paperwork",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "Client e-signs transfer paperwork",
        role: "Client",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Submit; monitor ACAT status daily (NIGO watch)",
        role: "CSA",
        durationBD: 6,
        note: "Custodian ACAT window 5-7 BD in good order.",
      },
      {
        name: "Confirm assets received; verify cost basis transferred",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Residual dividend/interest sweep follow-up (~2 weeks trailing)",
        role: "CSA",
        durationBD: 0,
        note: "Residuals sweep weekly/bi-weekly after transfer - calendar a check.",
      },
      {
        name: "Notify advisor and client; invest per model",
        role: "Advisor",
        durationBD: 0,
      },
      {
        name: "Close out and file (books and records)",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "acat-partial-in",
    name: "ACAT - Partial Transfer In",
    category: "Asset Transfer",
    slaBD: 10,
    priority: "Normal",
    nigoRisks:
      "Asset list imprecise (CUSIP/quantity); contra firm rejects partial specs; basis missing on received lots. SLA is end-to-end; custodian window 5-7 BD.",
    steps: [
      {
        name: "Collect statement and exact holdings list to transfer (CUSIP + quantity)",
        role: "Client",
        durationBD: 1,
      },
      {
        name: "Advisor reviews in-kind eligibility of listed assets",
        role: "Advisor",
        durationBD: 0,
      },
      {
        name: "Prepare partial TOA with asset list",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Principal pre-submission review of transfer paperwork",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "Client e-signs transfer paperwork",
        role: "Client",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Submit; monitor status (NIGO watch)",
        role: "CSA",
        durationBD: 6,
      },
      {
        name: "Verify received holdings and cost basis",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Notify advisor and client; invest per model",
        role: "Advisor",
        durationBD: 0,
      },
      {
        name: "Close out and file (books and records)",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "non-acat-in",
    name: "Non-ACAT Transfer In (Bank/Mutual Fund/Annuity)",
    category: "Asset Transfer",
    slaBD: 20,
    priority: "Normal",
    nigoRisks:
      "Medallion signature guarantee required (client must visit bank in person); contra paperwork variants; 2-4 week transfer window.",
    steps: [
      {
        name: "Identify transfer method (DTC, direct mutual fund, annuity/1035)",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Obtain contra-firm paperwork requirements",
        role: "CSA",
        durationBD: 2,
      },
      {
        name: "Prepare transfer forms",
        role: "CSA",
        durationBD: 1,
        lane: "custodian",
        medallion: true,
      },
      {
        name: "Principal pre-submission review of transfer paperwork",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "Client obtains medallion signature guarantee and signs",
        role: "Client",
        durationBD: 4,
        medallion: true,
        note: "Client must visit their bank in person - biggest delay driver.",
      },
      {
        name: "Submit; track with contra firm weekly",
        role: "CSA",
        durationBD: 10,
        note: "Non-ACAT window 2-4 weeks.",
      },
      {
        name: "Confirm receipt; enter cost basis manually if not transmitted",
        role: "CSA",
        durationBD: 1,
      },
      {
        name: "Notify advisor/client; close out and file",
        role: "Principal",
        durationBD: 1,
      },
    ],
  },
  {
    key: "beneficiary-change",
    name: "Beneficiary Add/Change",
    category: "Maintenance",
    slaBD: 5,
    priority: "Normal",
    nigoRisks:
      "Percentages not totaling 100; spousal consent missing (community property/ERISA); contingents skipped; medallion sometimes required.",
    steps: [
      {
        name: "Advisor confirms desired primary/contingent beneficiaries with percentages",
        role: "Advisor",
        durationBD: 1,
      },
      {
        name: "Check spousal-consent AND medallion requirements for this account type",
        role: "CSA",
        durationBD: 0,
        note: "Community property state / ERISA plan -> spousal consent; some custodians require medallion.",
      },
      {
        name: "Prepare designation form",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Client signs (obtains medallion first if required)",
        role: "Client",
        durationBD: 2,
        lane: "custodian",
      },
      {
        name: "Submit; confirm recorded exactly as intended",
        role: "CSA",
        durationBD: 1,
      },
      { name: "Update estate notes in CRM", role: "CSA", durationBD: 1 },
    ],
  },
  {
    key: "bank-change",
    name: "Bank Instructions Add/Change",
    category: "Maintenance",
    slaBD: 3,
    priority: "High",
    nigoRisks:
      "Top fraud vector - callback mandatory; voided check illegible; prenote validation delay surprises clients; medallion sometimes required.",
    steps: [
      {
        name: "Collect voided check or bank letter from client",
        role: "Client",
        durationBD: 1,
      },
      {
        name: "Verbal callback verification (mandatory - fraud control)",
        role: "CSA",
        durationBD: 0,
        note: "Mark Callback Verified on the request.",
      },
      {
        name: "Prepare bank instruction form; check medallion requirement",
        role: "CSA",
        durationBD: 0,
        lane: "custodian",
      },
      {
        name: "Client signs",
        role: "Client",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Submit; confirm micro-deposit/prenote validation complete",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "plan-update",
    name: "Financial Plan Update",
    category: "Planning",
    slaBD: 10,
    priority: "Normal",
    nigoRisks:
      "Stale outside-asset data; scenario assumptions not documented; plan version not logged.",
    steps: [
      {
        name: "Gather updated data (account feeds check, outside assets, compensation changes)",
        role: "Planner",
        durationBD: 3,
      },
      {
        name: "Update plan inputs in planning software",
        role: "Planner",
        durationBD: 2,
      },
      {
        name: "Run scenarios per meeting notes",
        role: "Planner",
        durationBD: 2,
      },
      { name: "Advisor review and revisions", role: "Advisor", durationBD: 2 },
      {
        name: "Publish to client portal; schedule delivery/review",
        role: "CSA",
        durationBD: 0,
      },
      { name: "Log plan version in CRM", role: "CSA", durationBD: 1 },
    ],
  },
  {
    key: "life-insurance-app",
    name: "Life Insurance Application",
    category: "Insurance",
    slaBD: 60,
    priority: "Normal",
    nigoRisks:
      "Paper app NIGO rates highest of any process; exam scheduling stalls; APS retrieval is the long pole (full UW 8-12 weeks; accelerated can close in days).",
    steps: [
      {
        name: "Complete needs analysis; select carrier and product",
        role: "Advisor",
        durationBD: 3,
      },
      {
        name: "Run illustrations; client approves coverage and premium",
        role: "Advisor",
        durationBD: 4,
      },
      {
        name: "Complete application in carrier e-app",
        role: "CSA",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Principal pre-submission review of application",
        role: "Principal",
        durationBD: 0,
      },
      {
        name: "Client signs application and HIPAA authorization",
        role: "Client",
        durationBD: 3,
        lane: "custodian",
      },
      {
        name: "Schedule paramedical exam if required",
        role: "CSA",
        durationBD: 5,
      },
      {
        name: "Underwriting follow-up loop - weekly status/APS checks",
        role: "CSA",
        durationBD: 35,
        note: "Full underwriting 8-12 weeks incl. exam + APS; accelerated can close in days.",
      },
      {
        name: "Review offer/rating with client; accept or negotiate",
        role: "Advisor",
        durationBD: 3,
      },
      {
        name: "Complete policy delivery requirements; set up premium payments",
        role: "CSA",
        durationBD: 5,
      },
      {
        name: "Record policy in CRM and planning software",
        role: "CSA",
        durationBD: 0,
      },
      {
        name: "Close out and file (books and records)",
        role: "CSA",
        durationBD: 1,
      },
    ],
  },
  {
    key: "annual-rmd-sweep",
    name: "Annual RMD Sweep (Batch)",
    category: "Compliance/Recurring",
    slaBD: 30,
    priority: "High",
    nigoRisks:
      "Start early November - custodians back up late December; missed RMD = 25% excise (10% if corrected promptly).",
    steps: [
      {
        name: "Pull list of RMD-subject clients (age 73+ and inherited IRAs)",
        role: "CSA",
        durationBD: 2,
      },
      {
        name: "Reconcile custodian RMD amounts vs own calculations",
        role: "CSA",
        durationBD: 3,
      },
      {
        name: "Advisor reviews distribution plan per client",
        role: "Advisor",
        durationBD: 5,
      },
      {
        name: "Spawn rmd-distribution requests per client",
        role: "CSA",
        durationBD: 2,
        note: "One linked request per client; this item tracks the batch.",
      },
      {
        name: "Track completion to 100% before Dec 15",
        role: "CSA",
        durationBD: 17,
      },
      {
        name: "Year-end confirmation memo to compliance file",
        role: "Principal",
        durationBD: 1,
      },
    ],
  },
  {
    key: "death-processing",
    name: "Death of Client Processing",
    category: "Estate/Exception",
    slaBD: 30,
    priority: "Critical",
    nigoRisks:
      "No account activity until legal authority established; certified death certificate + Letters required; TOD vs probate path determines everything.",
    steps: [
      {
        name: "Receive notification; freeze-activity checklist; condolences protocol",
        role: "Advisor",
        durationBD: 1,
      },
      {
        name: "Obtain certified death certificate and Letters; verify executor/beneficiary identity",
        role: "Client",
        durationBD: 9,
        note: "Family/executor provides; nothing moves without these. Verify identity before acting on instructions.",
      },
      {
        name: "Notify custodian; retitle/restrict decedent accounts",
        role: "CSA",
        durationBD: 1,
        lane: "custodian",
      },
      {
        name: "Determine beneficiary/TOD vs probate path per account",
        role: "Advisor",
        durationBD: 2,
      },
      {
        name: "Open inherited/estate accounts (chain new-account requests)",
        role: "CSA",
        durationBD: 3,
      },
      {
        name: "Transfer assets per beneficiary designations",
        role: "CSA",
        durationBD: 8,
        lane: "custodian",
      },
      { name: "Document stepped-up basis", role: "CSA", durationBD: 2 },
      {
        name: "Coordinate with estate attorney and CPA",
        role: "Advisor",
        durationBD: 2,
      },
      { name: "Close decedent accounts", role: "CSA", durationBD: 1 },
      {
        name: "Principal review and compliance file",
        role: "Principal",
        durationBD: 1,
      },
    ],
  },
];

export function requestTemplate(key: string) {
  return REQUEST_TEMPLATES.find((template) => template.key === key);
}
