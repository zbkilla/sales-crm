export const HOUSEHOLD_TYPES = ["Client", "Prospect", "Past client"] as const;
export type HouseholdType = (typeof HOUSEHOLD_TYPES)[number];

export const HOUSEHOLD_TABS = [
  { value: "clients", label: "Clients", type: "Client" },
  { value: "prospects", label: "Prospects", type: "Prospect" },
  { value: "past", label: "Past clients", type: "Past client" },
] as const;
export type HouseholdTab = (typeof HOUSEHOLD_TABS)[number]["value"];

export const TIERS = ["A", "B", "C", "D"] as const;
export type Tier = (typeof TIERS)[number];

export const HOUSEHOLD_TAGS = [
  "Pre-retiree",
  "Retired",
  "Business owner",
  "RMD-eligible",
  "Estate planning",
  "Next-gen",
  "Widowed",
  "Referral",
] as const;
export type HouseholdTag = (typeof HOUSEHOLD_TAGS)[number];

export type TagTone =
  | "blue"
  | "purple"
  | "green"
  | "moss"
  | "red"
  | "orange"
  | "amber"
  | "teal"
  | "yellow"
  | "neutral";

export const TIER_TONES: Record<Tier, TagTone> = {
  A: "green",
  B: "teal",
  C: "blue",
  D: "neutral",
};

export const TYPE_TONES: Record<HouseholdType, TagTone> = {
  Client: "green",
  Prospect: "purple",
  "Past client": "neutral",
};

export const TAG_TONES: Record<HouseholdTag, TagTone> = {
  "Pre-retiree": "amber",
  Retired: "moss",
  "Business owner": "blue",
  "RMD-eligible": "orange",
  "Estate planning": "purple",
  "Next-gen": "teal",
  Widowed: "yellow",
  Referral: "green",
};

export const REVIEW_CADENCES = [
  { value: "Monthly", months: 1 },
  { value: "Quarterly", months: 3 },
  { value: "Trimesterly", months: 4 },
  { value: "Semi-annual", months: 6 },
  { value: "Annual", months: 12 },
] as const;
export type ReviewCadence = (typeof REVIEW_CADENCES)[number]["value"];

export const TIER_DEFAULTS: Record<
  Tier,
  { reviewCadence: ReviewCadence; touchpointDays: number }
> = {
  A: { reviewCadence: "Quarterly", touchpointDays: 30 },
  B: { reviewCadence: "Semi-annual", touchpointDays: 60 },
  C: { reviewCadence: "Annual", touchpointDays: 90 },
  D: { reviewCadence: "Annual", touchpointDays: 180 },
};

export const PROSPECT_TOUCHPOINT_DAYS = 14;

export const MEETING_TYPES = [
  "Client review",
  "Client check-in",
  "Prospect",
  "COI / partner",
  "Internal",
  "Other",
] as const;
export type MeetingType = (typeof MEETING_TYPES)[number];

export const TOUCHPOINT_CHANNELS = ["Email", "Call", "SMS"] as const;
export type TouchpointChannel = (typeof TOUCHPOINT_CHANNELS)[number];

export const MEETING_TONES: Record<MeetingType, TagTone> = {
  "Client review": "green",
  "Client check-in": "teal",
  Prospect: "purple",
  "COI / partner": "amber",
  Internal: "neutral",
  Other: "neutral",
};

export const PROSPECT_STAGES = [
  { value: "Identified", probability: 10 },
  { value: "Connected", probability: 20 },
  { value: "Meeting scheduled", probability: 30 },
  { value: "Qualified", probability: 60 },
] as const;

export const CLIENT_STAGES = [
  { value: "Identified", probability: 10 },
  { value: "In-progress", probability: 40 },
  { value: "Reviewing", probability: 60 },
] as const;

export type OpportunityStage =
  | (typeof PROSPECT_STAGES)[number]["value"]
  | (typeof CLIENT_STAGES)[number]["value"];

export const HOUSEHOLD_ROLES = [
  "Head of household",
  "Spouse",
  "Partner",
  "Dependent child",
  "Non-dependent child",
  "Grandchild",
  "Other adult",
  "Other dependent",
  "Deceased",
] as const;
export type HouseholdRole = (typeof HOUSEHOLD_ROLES)[number];

export type MaritalStatus =
  | "Single"
  | "Married"
  | "Partnered"
  | "Separated"
  | "Divorced"
  | "Widowed";

export const REGISTRATIONS = [
  "Individual",
  "Joint",
  "Traditional IRA",
  "Roth IRA",
  "Rollover IRA",
  "Inherited IRA",
  "401(k)",
  "529",
  "Trust",
] as const;
export type Registration = (typeof REGISTRATIONS)[number];

export type Advisor = {
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
};

const AVATARS = Array.from(
  { length: 10 },
  (_, i) => `/assets/images/_common/avatars/avatar-${i + 1}.png`,
);

const ADVISOR_RECORDS = [
  { name: "Dana Whitfield", role: "Lead Advisor, CFP" },
  { name: "Marcus Bell", role: "Lead Advisor, CFA" },
  { name: "Priya Raman", role: "Associate Advisor" },
  { name: "Owen Calloway", role: "Associate Advisor" },
  { name: "Ruth Okafor", role: "Lead Advisor, CFP" },
  { name: "Sam Ito", role: "Associate Advisor" },
  { name: "Leah Moreno", role: "Client Service Associate" },
  { name: "Theo Grant", role: "Client Service Associate" },
];

export const ADVISORS: Advisor[] = ADVISOR_RECORDS.map((advisor, i) => ({
  ...advisor,
  avatar: AVATARS[i % AVATARS.length],
  email: `${advisor.name.toLowerCase().replace(" ", ".")}@riaagentos.com`,
  phone: `+1 (415) 555-${String(110 + i * 7).padStart(4, "0")}`,
}));

export const CURRENT_USER: Advisor = {
  name: "Morgan Hale",
  avatar: "/assets/images/_common/avatars/jensen.png",
  email: "morgan.hale@riaagentos.com",
  phone: "+1 (415) 555-0100",
  role: "Principal Advisor, CFP",
};

export function advisorByName(name: string): Advisor {
  return ADVISORS.find((advisor) => advisor.name === name) ?? ADVISORS[0];
}

export function profileByName(name: string): Advisor {
  return name === CURRENT_USER.name ? CURRENT_USER : advisorByName(name);
}

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  role: HouseholdRole;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  maritalStatus?: MaritalStatus;
  jobTitle?: string;
  employer?: string;
  retirementDate?: string;
  designations?: string;
  ssnLast4?: string;
};

export type Account = {
  id: string;
  name: string;
  custodian: string;
  source: "custodian" | "manual";
  registration: Registration;
  balance: number;
  ytdReturn: number;
  numberLast4: string;
  ownerIds: string[];
};

export type Opportunity = {
  id: string;
  name: string;
  stage: OpportunityStage;
  value: number;
  probability: number;
  targetClose: string;
};

export type Meeting = {
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  advisor: string;
  summary: string;
};

export type Touchpoint = {
  date: string;
  label: MeetingType | TouchpointChannel | "Added";
};

export type TouchpointMix = {
  meetings: number;
  emails: number;
  calls: number;
  notes: number;
};

export type Household = {
  id: string;
  name: string;
  type: HouseholdType;
  tier: Tier | null;
  tags: HouseholdTag[];
  advisor: string;
  people: Person[];
  accounts: Account[];
  opportunities: Opportunity[];
  meetings: Meeting[];
  clientSince: string | null;
  pastClientSince?: string;
  lastReview: string | null;
  reviewCadence?: ReviewCadence;
  lastTouchpoint: Touchpoint;
  touchpointTrend: number[];
  touchpointMix: TouchpointMix;
  estAssets?: string;
  importantInfo?: string;
};

export const TREND_PATTERN = [
  false,
  true,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  true,
  false,
];

export const NEW_TREND = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3];

const TREND_A = [4, 4, 10, 3, 2, 4, 7, 4, 11, 4, 11, 7, 4, 14];
const TREND_B = [4, 4, 5, 5, 2, 7, 11, 7, 5, 7, 5, 3, 7, 14];
const TREND_C = [4, 4, 10, 5, 2, 7, 11, 7, 11, 7, 11, 7, 7, 14];
const TREND_D = [4, 4, 5, 12, 5, 7, 11, 3, 11, 3, 11, 3, 7, 14];
const TREND_QUIET = [2, 1, 3, 1, 1, 2, 1, 4, 1, 1, 2, 1, 1, 3];

export const HOUSEHOLDS: Household[] = [
  {
    id: "hartwell",
    name: "Thomas and Eleanor Hartwell",
    type: "Client",
    tier: "A",
    tags: ["Retired", "RMD-eligible", "Estate planning"],
    advisor: "Dana Whitfield",
    people: [
      {
        id: "hartwell-thomas",
        firstName: "Thomas",
        lastName: "Hartwell",
        role: "Head of household",
        dateOfBirth: "1951-05-14",
        email: "thomas.hartwell@example.com",
        phone: "+1 (415) 555-0142",
        maritalStatus: "Married",
        jobTitle: "Retired surgeon",
        retirementDate: "2017-06-30",
        ssnLast4: "4821",
      },
      {
        id: "hartwell-eleanor",
        firstName: "Eleanor",
        lastName: "Hartwell",
        role: "Spouse",
        dateOfBirth: "1953-11-02",
        email: "eleanor.hartwell@example.com",
        phone: "+1 (415) 555-0143",
        maritalStatus: "Married",
        ssnLast4: "7730",
      },
    ],
    accounts: [
      {
        id: "hartwell-joint",
        name: "Hartwell Joint Brokerage",
        custodian: "Schwab",
        source: "custodian",
        registration: "Joint",
        balance: 2840000,
        ytdReturn: 7.8,
        numberLast4: "6780",
        ownerIds: ["hartwell-thomas", "hartwell-eleanor"],
      },
      {
        id: "hartwell-ira",
        name: "Thomas Traditional IRA",
        custodian: "Schwab",
        source: "custodian",
        registration: "Traditional IRA",
        balance: 1620000,
        ytdReturn: 6.9,
        numberLast4: "2214",
        ownerIds: ["hartwell-thomas"],
      },
      {
        id: "hartwell-roth",
        name: "Eleanor Roth IRA",
        custodian: "Schwab",
        source: "custodian",
        registration: "Roth IRA",
        balance: 410000,
        ytdReturn: 9.1,
        numberLast4: "9035",
        ownerIds: ["hartwell-eleanor"],
      },
      {
        id: "hartwell-checking",
        name: "First Republic Checking",
        custodian: "First Republic",
        source: "manual",
        registration: "Joint",
        balance: 85000,
        ytdReturn: 0,
        numberLast4: "1187",
        ownerIds: ["hartwell-thomas", "hartwell-eleanor"],
      },
    ],
    opportunities: [
      {
        id: "hartwell-daf",
        name: "Donor-advised fund funding",
        stage: "Reviewing",
        value: 500000,
        probability: 60,
        targetClose: "2026-12-15",
      },
    ],
    meetings: [
      {
        id: "hartwell-m2",
        title: "Q3 check-in",
        type: "Client check-in",
        date: "2026-08-28",
        advisor: "Dana Whitfield",
        summary:
          "Confirmed the 2026 RMD will be taken in December. Eleanor wants to discuss gifting appreciated shares to a donor-advised fund.",
      },
      {
        id: "hartwell-m1",
        title: "Mid-year review",
        type: "Client review",
        date: "2026-06-10",
        advisor: "Dana Whitfield",
        summary:
          "Reviewed allocation drift after the spring rally and trimmed equities by 4%. Estate attorney to update the trust schedule.",
      },
    ],
    clientSince: "2014-03-01",
    lastReview: "2026-06-10",
    lastTouchpoint: { date: "2026-08-28", label: "Client check-in" },
    touchpointTrend: TREND_A,
    touchpointMix: { meetings: 4, emails: 18, calls: 6, notes: 9 },
    importantInfo:
      "Thomas must take his 2026 RMD before December 31. Estate attorney: Holloway & Pratt.",
  },
  {
    id: "reyes",
    name: "Daniel and Sofia Reyes",
    type: "Client",
    tier: "A",
    tags: ["Business owner", "Estate planning"],
    advisor: "Marcus Bell",
    people: [
      {
        id: "reyes-daniel",
        firstName: "Daniel",
        lastName: "Reyes",
        role: "Head of household",
        dateOfBirth: "1968-02-21",
        email: "daniel@reyeslogistics.example.com",
        phone: "+1 (512) 555-0118",
        maritalStatus: "Married",
        jobTitle: "Founder & CEO",
        employer: "Reyes Logistics",
        ssnLast4: "3302",
      },
      {
        id: "reyes-sofia",
        firstName: "Sofia",
        lastName: "Reyes",
        role: "Spouse",
        dateOfBirth: "1971-09-08",
        email: "sofia.reyes@example.com",
        phone: "+1 (512) 555-0119",
        maritalStatus: "Married",
        jobTitle: "Pediatrician",
        ssnLast4: "6648",
      },
      {
        id: "reyes-mateo",
        firstName: "Mateo",
        lastName: "Reyes",
        role: "Dependent child",
        dateOfBirth: "2010-04-17",
      },
      {
        id: "reyes-lucia",
        firstName: "Lucia",
        lastName: "Reyes",
        role: "Dependent child",
        dateOfBirth: "2013-12-03",
      },
    ],
    accounts: [
      {
        id: "reyes-trust",
        name: "Reyes Family Revocable Trust",
        custodian: "Fidelity",
        source: "custodian",
        registration: "Trust",
        balance: 3150000,
        ytdReturn: 8.4,
        numberLast4: "5521",
        ownerIds: ["reyes-daniel", "reyes-sofia"],
      },
      {
        id: "reyes-individual",
        name: "Daniel Individual",
        custodian: "Fidelity",
        source: "custodian",
        registration: "Individual",
        balance: 920000,
        ytdReturn: 11.2,
        numberLast4: "0947",
        ownerIds: ["reyes-daniel"],
      },
      {
        id: "reyes-401k",
        name: "Reyes Logistics Solo 401(k)",
        custodian: "Fidelity",
        source: "custodian",
        registration: "401(k)",
        balance: 640000,
        ytdReturn: 9.6,
        numberLast4: "3318",
        ownerIds: ["reyes-daniel"],
      },
      {
        id: "reyes-529-mateo",
        name: "Mateo 529",
        custodian: "Fidelity",
        source: "custodian",
        registration: "529",
        balance: 118000,
        ytdReturn: 7.3,
        numberLast4: "7702",
        ownerIds: ["reyes-sofia"],
      },
      {
        id: "reyes-529-lucia",
        name: "Lucia 529",
        custodian: "Fidelity",
        source: "custodian",
        registration: "529",
        balance: 96000,
        ytdReturn: 7.3,
        numberLast4: "7703",
        ownerIds: ["reyes-sofia"],
      },
    ],
    opportunities: [
      {
        id: "reyes-liquidity",
        name: "Business sale proceeds",
        stage: "In-progress",
        value: 2500000,
        probability: 40,
        targetClose: "2027-03-31",
      },
    ],
    meetings: [
      {
        id: "reyes-m1",
        title: "Liquidity event planning",
        type: "Client review",
        date: "2026-07-20",
        advisor: "Marcus Bell",
        summary:
          "Daniel expects an LOI for Reyes Logistics in Q1. Modeled after-tax proceeds and a pre-sale gifting strategy with the CPA.",
      },
    ],
    clientSince: "2018-09-15",
    lastReview: "2026-07-20",
    lastTouchpoint: { date: "2026-09-24", label: "Email" },
    touchpointTrend: TREND_C,
    touchpointMix: { meetings: 5, emails: 26, calls: 8, notes: 12 },
    importantInfo:
      "Daniel is exploring a sale of Reyes Logistics in 2027. Coordinate with the CPA before any liquidity event.",
  },
  {
    id: "chen",
    name: "Margaret Chen",
    type: "Client",
    tier: "A",
    tags: ["Widowed", "Retired"],
    advisor: "Dana Whitfield",
    people: [
      {
        id: "chen-margaret",
        firstName: "Margaret",
        lastName: "Chen",
        role: "Head of household",
        dateOfBirth: "1949-07-30",
        email: "margaret.chen@example.com",
        phone: "+1 (650) 555-0131",
        maritalStatus: "Widowed",
        jobTitle: "Retired professor",
        retirementDate: "2014-05-31",
        ssnLast4: "1909",
      },
      {
        id: "chen-robert",
        firstName: "Robert",
        lastName: "Chen",
        role: "Deceased",
        dateOfBirth: "1947-01-12",
      },
    ],
    accounts: [
      {
        id: "chen-individual",
        name: "Margaret Individual",
        custodian: "Pershing",
        source: "custodian",
        registration: "Individual",
        balance: 2210000,
        ytdReturn: 5.4,
        numberLast4: "8126",
        ownerIds: ["chen-margaret"],
      },
      {
        id: "chen-ira",
        name: "Margaret Traditional IRA",
        custodian: "Pershing",
        source: "custodian",
        registration: "Traditional IRA",
        balance: 1050000,
        ytdReturn: 4.8,
        numberLast4: "8127",
        ownerIds: ["chen-margaret"],
      },
      {
        id: "chen-inherited",
        name: "Inherited IRA from Robert",
        custodian: "Pershing",
        source: "custodian",
        registration: "Inherited IRA",
        balance: 780000,
        ytdReturn: 5.1,
        numberLast4: "8130",
        ownerIds: ["chen-margaret"],
      },
    ],
    opportunities: [],
    meetings: [
      {
        id: "chen-m1",
        title: "Annual review",
        type: "Client review",
        date: "2026-09-02",
        advisor: "Dana Whitfield",
        summary:
          "Income plan is on track. Margaret asked to name her son James as trusted contact; paperwork sent through DocuSign.",
      },
    ],
    clientSince: "2011-06-01",
    lastReview: "2026-09-02",
    lastTouchpoint: { date: "2026-09-30", label: "Call" },
    touchpointTrend: TREND_B,
    touchpointMix: { meetings: 3, emails: 7, calls: 11, notes: 6 },
    importantInfo:
      "Prefers phone calls in the morning. Son James Chen holds power of attorney.",
  },
  {
    id: "feldman",
    name: "Aaron and Naomi Feldman",
    type: "Client",
    tier: "B",
    tags: ["Pre-retiree"],
    advisor: "Priya Raman",
    people: [
      {
        id: "feldman-aaron",
        firstName: "Aaron",
        lastName: "Feldman",
        role: "Head of household",
        dateOfBirth: "1963-03-11",
        email: "aaron.feldman@example.com",
        phone: "+1 (303) 555-0177",
        maritalStatus: "Married",
        jobTitle: "VP Engineering",
        employer: "Northfield Aerospace",
        retirementDate: "2028-12-31",
        ssnLast4: "5560",
      },
      {
        id: "feldman-naomi",
        firstName: "Naomi",
        lastName: "Feldman",
        role: "Spouse",
        dateOfBirth: "1965-10-26",
        email: "naomi.feldman@example.com",
        maritalStatus: "Married",
        jobTitle: "School principal",
        ssnLast4: "2093",
      },
    ],
    accounts: [
      {
        id: "feldman-joint",
        name: "Feldman Joint",
        custodian: "Schwab",
        source: "custodian",
        registration: "Joint",
        balance: 1180000,
        ytdReturn: 8.1,
        numberLast4: "4402",
        ownerIds: ["feldman-aaron", "feldman-naomi"],
      },
      {
        id: "feldman-rollover",
        name: "Naomi Rollover IRA",
        custodian: "Schwab",
        source: "custodian",
        registration: "Rollover IRA",
        balance: 690000,
        ytdReturn: 7.6,
        numberLast4: "4410",
        ownerIds: ["feldman-naomi"],
      },
      {
        id: "feldman-401k",
        name: "Northfield 401(k)",
        custodian: "Vanguard",
        source: "manual",
        registration: "401(k)",
        balance: 410000,
        ytdReturn: 6.2,
        numberLast4: "0091",
        ownerIds: ["feldman-aaron"],
      },
    ],
    opportunities: [
      {
        id: "feldman-rollover-opp",
        name: "Rollover of Northfield 401(k)",
        stage: "Identified",
        value: 410000,
        probability: 30,
        targetClose: "2029-01-31",
      },
    ],
    meetings: [
      {
        id: "feldman-m1",
        title: "Retirement readiness review",
        type: "Client review",
        date: "2026-03-15",
        advisor: "Priya Raman",
        summary:
          "Aaron plans to retire end of 2028. Agreed to model a Roth conversion window for 2029 to 2031 before RMDs begin.",
      },
    ],
    clientSince: "2019-02-01",
    lastReview: "2026-03-15",
    lastTouchpoint: { date: "2026-07-02", label: "Email" },
    touchpointTrend: TREND_QUIET,
    touchpointMix: { meetings: 1, emails: 6, calls: 2, notes: 3 },
  },
  {
    id: "patel",
    name: "Kevin and Jasmine Patel",
    type: "Client",
    tier: "B",
    tags: ["Next-gen", "Referral"],
    advisor: "Owen Calloway",
    people: [
      {
        id: "patel-kevin",
        firstName: "Kevin",
        lastName: "Patel",
        role: "Head of household",
        dateOfBirth: "1988-06-04",
        email: "kevin.patel@example.com",
        phone: "+1 (206) 555-0164",
        maritalStatus: "Married",
        jobTitle: "Staff software engineer",
        employer: "Cascade Cloud",
        ssnLast4: "7781",
      },
      {
        id: "patel-jasmine",
        firstName: "Jasmine",
        lastName: "Patel",
        role: "Spouse",
        dateOfBirth: "1990-01-19",
        email: "jasmine.patel@example.com",
        maritalStatus: "Married",
        jobTitle: "Product designer",
        ssnLast4: "3127",
      },
      {
        id: "patel-arjun",
        firstName: "Arjun",
        lastName: "Patel",
        role: "Dependent child",
        dateOfBirth: "2021-08-30",
      },
    ],
    accounts: [
      {
        id: "patel-joint",
        name: "Patel Joint",
        custodian: "Altruist",
        source: "custodian",
        registration: "Joint",
        balance: 640000,
        ytdReturn: 12.4,
        numberLast4: "2290",
        ownerIds: ["patel-kevin", "patel-jasmine"],
      },
      {
        id: "patel-roth-kevin",
        name: "Kevin Roth IRA",
        custodian: "Altruist",
        source: "custodian",
        registration: "Roth IRA",
        balance: 120000,
        ytdReturn: 13.1,
        numberLast4: "2291",
        ownerIds: ["patel-kevin"],
      },
      {
        id: "patel-roth-jasmine",
        name: "Jasmine Roth IRA",
        custodian: "Altruist",
        source: "custodian",
        registration: "Roth IRA",
        balance: 98000,
        ytdReturn: 12.8,
        numberLast4: "2292",
        ownerIds: ["patel-jasmine"],
      },
    ],
    opportunities: [
      {
        id: "patel-rsu",
        name: "RSU diversification plan",
        stage: "In-progress",
        value: 380000,
        probability: 40,
        targetClose: "2026-11-30",
      },
    ],
    meetings: [
      {
        id: "patel-m1",
        title: "Semi-annual review",
        type: "Client review",
        date: "2026-04-25",
        advisor: "Owen Calloway",
        summary:
          "Set a 10b5-1 style schedule to sell vested RSUs quarterly. Opened a 529 discussion for Arjun.",
      },
    ],
    clientSince: "2022-05-10",
    lastReview: "2026-04-25",
    lastTouchpoint: { date: "2026-09-12", label: "SMS" },
    touchpointTrend: TREND_D,
    touchpointMix: { meetings: 2, emails: 14, calls: 3, notes: 5 },
  },
  {
    id: "whitaker",
    name: "Gregory and Anne Whitaker",
    type: "Client",
    tier: "B",
    tags: ["Retired", "RMD-eligible"],
    advisor: "Marcus Bell",
    people: [
      {
        id: "whitaker-gregory",
        firstName: "Gregory",
        lastName: "Whitaker",
        role: "Head of household",
        dateOfBirth: "1952-12-09",
        email: "greg.whitaker@example.com",
        phone: "+1 (919) 555-0125",
        maritalStatus: "Married",
        retirementDate: "2016-12-31",
        ssnLast4: "6019",
      },
      {
        id: "whitaker-anne",
        firstName: "Anne",
        lastName: "Whitaker",
        role: "Spouse",
        dateOfBirth: "1955-04-15",
        email: "anne.whitaker@example.com",
        maritalStatus: "Married",
        ssnLast4: "4455",
      },
    ],
    accounts: [
      {
        id: "whitaker-joint",
        name: "Whitaker Joint",
        custodian: "Fidelity",
        source: "custodian",
        registration: "Joint",
        balance: 1340000,
        ytdReturn: 6.3,
        numberLast4: "1450",
        ownerIds: ["whitaker-gregory", "whitaker-anne"],
      },
      {
        id: "whitaker-ira",
        name: "Gregory Traditional IRA",
        custodian: "Fidelity",
        source: "custodian",
        registration: "Traditional IRA",
        balance: 880000,
        ytdReturn: 5.9,
        numberLast4: "1451",
        ownerIds: ["whitaker-gregory"],
      },
    ],
    opportunities: [],
    meetings: [
      {
        id: "whitaker-m1",
        title: "Semi-annual review",
        type: "Client review",
        date: "2026-08-01",
        advisor: "Marcus Bell",
        summary:
          "Set up qualified charitable distributions from Gregory's IRA to cover most of the RMD.",
      },
    ],
    clientSince: "2016-01-15",
    lastReview: "2026-08-01",
    lastTouchpoint: { date: "2026-09-18", label: "Email" },
    touchpointTrend: TREND_B,
    touchpointMix: { meetings: 2, emails: 9, calls: 4, notes: 4 },
  },
  {
    id: "brooks",
    name: "Lauren Brooks",
    type: "Client",
    tier: "B",
    tags: ["Business owner"],
    advisor: "Ruth Okafor",
    people: [
      {
        id: "brooks-lauren",
        firstName: "Lauren",
        lastName: "Brooks",
        role: "Head of household",
        dateOfBirth: "1979-08-22",
        email: "lauren@brooksdesign.example.com",
        phone: "+1 (312) 555-0187",
        maritalStatus: "Single",
        jobTitle: "Principal",
        employer: "Brooks Design Studio",
        ssnLast4: "8840",
      },
    ],
    accounts: [
      {
        id: "brooks-individual",
        name: "Lauren Individual",
        custodian: "Schwab",
        source: "custodian",
        registration: "Individual",
        balance: 760000,
        ytdReturn: 9.8,
        numberLast4: "3071",
        ownerIds: ["brooks-lauren"],
      },
      {
        id: "brooks-rollover",
        name: "Lauren Rollover IRA",
        custodian: "Schwab",
        source: "custodian",
        registration: "Rollover IRA",
        balance: 310000,
        ytdReturn: 8.7,
        numberLast4: "3072",
        ownerIds: ["brooks-lauren"],
      },
    ],
    opportunities: [
      {
        id: "brooks-cash-balance",
        name: "Cash balance plan for studio",
        stage: "Reviewing",
        value: 450000,
        probability: 60,
        targetClose: "2026-12-01",
      },
    ],
    meetings: [
      {
        id: "brooks-m1",
        title: "Business retirement plan options",
        type: "Client review",
        date: "2026-07-12",
        advisor: "Ruth Okafor",
        summary:
          "Compared a cash balance plan with a SEP increase. Third-party administrator proposal due in October.",
      },
    ],
    clientSince: "2020-11-01",
    lastReview: "2026-07-12",
    lastTouchpoint: { date: "2026-09-26", label: "Call" },
    touchpointTrend: TREND_C,
    touchpointMix: { meetings: 3, emails: 12, calls: 5, notes: 6 },
  },
  {
    id: "morales",
    name: "Victor and Helen Morales",
    type: "Client",
    tier: "C",
    tags: ["Pre-retiree"],
    advisor: "Priya Raman",
    people: [
      {
        id: "morales-victor",
        firstName: "Victor",
        lastName: "Morales",
        role: "Head of household",
        dateOfBirth: "1966-05-02",
        email: "victor.morales@example.com",
        phone: "+1 (602) 555-0149",
        maritalStatus: "Married",
        jobTitle: "Operations manager",
        ssnLast4: "2218",
      },
      {
        id: "morales-helen",
        firstName: "Helen",
        lastName: "Morales",
        role: "Spouse",
        dateOfBirth: "1967-09-14",
        email: "helen.morales@example.com",
        maritalStatus: "Married",
        ssnLast4: "9014",
      },
      {
        id: "morales-isabel",
        firstName: "Isabel",
        lastName: "Morales",
        role: "Non-dependent child",
        dateOfBirth: "1996-02-28",
        email: "isabel.morales@example.com",
      },
    ],
    accounts: [
      {
        id: "morales-joint",
        name: "Morales Joint",
        custodian: "Altruist",
        source: "custodian",
        registration: "Joint",
        balance: 420000,
        ytdReturn: 7.2,
        numberLast4: "5130",
        ownerIds: ["morales-victor", "morales-helen"],
      },
      {
        id: "morales-rollover",
        name: "Victor Rollover IRA",
        custodian: "Altruist",
        source: "custodian",
        registration: "Rollover IRA",
        balance: 260000,
        ytdReturn: 6.8,
        numberLast4: "5131",
        ownerIds: ["morales-victor"],
      },
    ],
    opportunities: [],
    meetings: [
      {
        id: "morales-m1",
        title: "Annual review",
        type: "Client review",
        date: "2025-09-01",
        advisor: "Priya Raman",
        summary:
          "Raised savings rate to 15%. Helen wants to revisit long-term care insurance next year.",
      },
    ],
    clientSince: "2021-08-20",
    lastReview: "2025-09-01",
    lastTouchpoint: { date: "2026-05-19", label: "Email" },
    touchpointTrend: TREND_QUIET,
    touchpointMix: { meetings: 1, emails: 4, calls: 1, notes: 2 },
  },
  {
    id: "sullivan",
    name: "Ethan and Chloe Sullivan",
    type: "Client",
    tier: "C",
    tags: ["Next-gen"],
    advisor: "Owen Calloway",
    people: [
      {
        id: "sullivan-ethan",
        firstName: "Ethan",
        lastName: "Sullivan",
        role: "Head of household",
        dateOfBirth: "1992-11-11",
        email: "ethan.sullivan@example.com",
        phone: "+1 (617) 555-0156",
        maritalStatus: "Married",
        jobTitle: "Resident physician",
        ssnLast4: "6670",
      },
      {
        id: "sullivan-chloe",
        firstName: "Chloe",
        lastName: "Sullivan",
        role: "Spouse",
        dateOfBirth: "1993-03-07",
        email: "chloe.sullivan@example.com",
        maritalStatus: "Married",
        jobTitle: "Attorney",
        ssnLast4: "1248",
      },
      {
        id: "sullivan-nora",
        firstName: "Nora",
        lastName: "Sullivan",
        role: "Dependent child",
        dateOfBirth: "2024-01-22",
      },
    ],
    accounts: [
      {
        id: "sullivan-joint",
        name: "Sullivan Joint",
        custodian: "Altruist",
        source: "custodian",
        registration: "Joint",
        balance: 210000,
        ytdReturn: 10.9,
        numberLast4: "6604",
        ownerIds: ["sullivan-ethan", "sullivan-chloe"],
      },
      {
        id: "sullivan-roth",
        name: "Chloe Roth IRA",
        custodian: "Altruist",
        source: "custodian",
        registration: "Roth IRA",
        balance: 64000,
        ytdReturn: 11.4,
        numberLast4: "6605",
        ownerIds: ["sullivan-chloe"],
      },
      {
        id: "sullivan-529",
        name: "Nora 529",
        custodian: "Altruist",
        source: "custodian",
        registration: "529",
        balance: 38000,
        ytdReturn: 9.2,
        numberLast4: "6606",
        ownerIds: ["sullivan-ethan"],
      },
    ],
    opportunities: [],
    meetings: [
      {
        id: "sullivan-m1",
        title: "Annual review",
        type: "Client review",
        date: "2025-10-20",
        advisor: "Owen Calloway",
        summary:
          "Built a student loan payoff plan around PSLF eligibility. Increased 529 contributions after Nora's birth.",
      },
    ],
    clientSince: "2023-03-01",
    lastReview: "2025-10-20",
    lastTouchpoint: { date: "2026-08-14", label: "Email" },
    touchpointTrend: TREND_D,
    touchpointMix: { meetings: 1, emails: 8, calls: 2, notes: 3 },
  },
  {
    id: "avery",
    name: "Rosalind Avery",
    type: "Client",
    tier: "C",
    tags: ["Retired", "Widowed"],
    advisor: "Ruth Okafor",
    people: [
      {
        id: "avery-rosalind",
        firstName: "Rosalind",
        lastName: "Avery",
        role: "Head of household",
        dateOfBirth: "1946-10-05",
        email: "rosalind.avery@example.com",
        phone: "+1 (503) 555-0138",
        maritalStatus: "Widowed",
        retirementDate: "2011-06-30",
        ssnLast4: "3356",
      },
    ],
    accounts: [
      {
        id: "avery-ira",
        name: "Rosalind Traditional IRA",
        custodian: "Fidelity",
        source: "custodian",
        registration: "Traditional IRA",
        balance: 530000,
        ytdReturn: 4.6,
        numberLast4: "7719",
        ownerIds: ["avery-rosalind"],
      },
    ],
    opportunities: [],
    meetings: [
      {
        id: "avery-m1",
        title: "Annual review",
        type: "Client review",
        date: "2026-02-10",
        advisor: "Ruth Okafor",
        summary:
          "Monthly income distribution increased by $400. Daughter added as trusted contact.",
      },
    ],
    clientSince: "2012-04-01",
    lastReview: "2026-02-10",
    lastTouchpoint: { date: "2026-09-03", label: "Call" },
    touchpointTrend: TREND_B,
    touchpointMix: { meetings: 1, emails: 2, calls: 9, notes: 4 },
  },
  {
    id: "coleman",
    name: "Brian and Tasha Coleman",
    type: "Client",
    tier: "D",
    tags: ["Referral"],
    advisor: "Sam Ito",
    people: [
      {
        id: "coleman-brian",
        firstName: "Brian",
        lastName: "Coleman",
        role: "Head of household",
        dateOfBirth: "1984-07-16",
        email: "brian.coleman@example.com",
        phone: "+1 (404) 555-0193",
        maritalStatus: "Married",
        jobTitle: "Electrician",
        ssnLast4: "5092",
      },
      {
        id: "coleman-tasha",
        firstName: "Tasha",
        lastName: "Coleman",
        role: "Spouse",
        dateOfBirth: "1986-12-01",
        email: "tasha.coleman@example.com",
        maritalStatus: "Married",
        ssnLast4: "8813",
      },
    ],
    accounts: [
      {
        id: "coleman-joint",
        name: "Coleman Joint",
        custodian: "Schwab",
        source: "custodian",
        registration: "Joint",
        balance: 180000,
        ytdReturn: 8.9,
        numberLast4: "9960",
        ownerIds: ["coleman-brian", "coleman-tasha"],
      },
      {
        id: "coleman-roth",
        name: "Tasha Roth IRA",
        custodian: "Schwab",
        source: "custodian",
        registration: "Roth IRA",
        balance: 45000,
        ytdReturn: 10.2,
        numberLast4: "9961",
        ownerIds: ["coleman-tasha"],
      },
    ],
    opportunities: [],
    meetings: [
      {
        id: "coleman-m1",
        title: "Annual review",
        type: "Client review",
        date: "2025-08-15",
        advisor: "Sam Ito",
        summary:
          "Emergency fund is fully funded. Next step is opening a Roth IRA for Brian.",
      },
    ],
    clientSince: "2024-02-12",
    lastReview: "2025-08-15",
    lastTouchpoint: { date: "2026-03-30", label: "Email" },
    touchpointTrend: TREND_QUIET,
    touchpointMix: { meetings: 0, emails: 3, calls: 1, notes: 1 },
  },
  {
    id: "thornton",
    name: "William and Grace Thornton",
    type: "Prospect",
    tier: null,
    tags: ["Pre-retiree", "Referral"],
    advisor: "Dana Whitfield",
    people: [
      {
        id: "thornton-william",
        firstName: "William",
        lastName: "Thornton",
        role: "Head of household",
        dateOfBirth: "1962-04-29",
        email: "will.thornton@example.com",
        phone: "+1 (415) 555-0171",
        maritalStatus: "Married",
        jobTitle: "Managing partner",
        employer: "Thornton & Lake LLP",
      },
      {
        id: "thornton-grace",
        firstName: "Grace",
        lastName: "Thornton",
        role: "Spouse",
        dateOfBirth: "1964-08-18",
        email: "grace.thornton@example.com",
        maritalStatus: "Married",
      },
    ],
    accounts: [],
    opportunities: [
      {
        id: "thornton-opp",
        name: "Thornton new relationship",
        stage: "Qualified",
        value: 3200000,
        probability: 60,
        targetClose: "2026-11-15",
      },
    ],
    meetings: [
      {
        id: "thornton-m1",
        title: "Discovery meeting",
        type: "Prospect",
        date: "2026-09-29",
        advisor: "Dana Whitfield",
        summary:
          "Referred by the Hartwells. Wants a second opinion on retirement timing and a plan for $3.2M across four accounts.",
      },
    ],
    clientSince: null,
    lastReview: null,
    lastTouchpoint: { date: "2026-09-29", label: "Prospect" },
    touchpointTrend: TREND_C,
    touchpointMix: { meetings: 2, emails: 6, calls: 2, notes: 3 },
    estAssets: "$2M–$5M",
  },
  {
    id: "shah",
    name: "Anika Shah",
    type: "Prospect",
    tier: null,
    tags: ["Business owner"],
    advisor: "Marcus Bell",
    people: [
      {
        id: "shah-anika",
        firstName: "Anika",
        lastName: "Shah",
        role: "Head of household",
        dateOfBirth: "1975-01-09",
        email: "anika@shahdental.example.com",
        phone: "+1 (408) 555-0128",
        maritalStatus: "Divorced",
        jobTitle: "Owner",
        employer: "Shah Dental Group",
        designations: "DDS",
      },
    ],
    accounts: [],
    opportunities: [
      {
        id: "shah-opp",
        name: "Practice sale wealth plan",
        stage: "Meeting scheduled",
        value: 6000000,
        probability: 30,
        targetClose: "2027-01-31",
      },
    ],
    meetings: [],
    clientSince: null,
    lastReview: null,
    lastTouchpoint: { date: "2026-09-22", label: "Email" },
    touchpointTrend: TREND_A,
    touchpointMix: { meetings: 0, emails: 5, calls: 1, notes: 2 },
    estAssets: "$5M+",
  },
  {
    id: "liu",
    name: "Jordan and Casey Liu",
    type: "Prospect",
    tier: null,
    tags: ["Next-gen"],
    advisor: "Owen Calloway",
    people: [
      {
        id: "liu-jordan",
        firstName: "Jordan",
        lastName: "Liu",
        role: "Head of household",
        dateOfBirth: "1991-05-23",
        email: "jordan.liu@example.com",
        phone: "+1 (206) 555-0182",
        maritalStatus: "Partnered",
        jobTitle: "Product manager",
      },
      {
        id: "liu-casey",
        firstName: "Casey",
        lastName: "Liu",
        role: "Partner",
        dateOfBirth: "1990-10-14",
        email: "casey.liu@example.com",
        maritalStatus: "Partnered",
      },
    ],
    accounts: [],
    opportunities: [
      {
        id: "liu-opp",
        name: "Liu new relationship",
        stage: "Connected",
        value: 750000,
        probability: 20,
        targetClose: "2026-12-31",
      },
    ],
    meetings: [],
    clientSince: null,
    lastReview: null,
    lastTouchpoint: { date: "2026-09-10", label: "Email" },
    touchpointTrend: TREND_QUIET,
    touchpointMix: { meetings: 0, emails: 3, calls: 0, notes: 1 },
    estAssets: "$500K–$1M",
  },
  {
    id: "donnelly",
    name: "Patricia Donnelly",
    type: "Prospect",
    tier: null,
    tags: ["Widowed"],
    advisor: "Ruth Okafor",
    people: [
      {
        id: "donnelly-patricia",
        firstName: "Patricia",
        lastName: "Donnelly",
        role: "Head of household",
        dateOfBirth: "1958-02-17",
        email: "patricia.donnelly@example.com",
        phone: "+1 (617) 555-0115",
        maritalStatus: "Widowed",
      },
    ],
    accounts: [],
    opportunities: [
      {
        id: "donnelly-opp",
        name: "Donnelly new relationship",
        stage: "Identified",
        value: 1400000,
        probability: 10,
        targetClose: "2027-02-28",
      },
    ],
    meetings: [],
    clientSince: null,
    lastReview: null,
    lastTouchpoint: { date: "2026-10-01", label: "Call" },
    touchpointTrend: TREND_QUIET,
    touchpointMix: { meetings: 0, emails: 1, calls: 2, notes: 1 },
    estAssets: "$1M–$2M",
  },
  {
    id: "bishop",
    name: "Samuel and Irene Bishop",
    type: "Prospect",
    tier: null,
    tags: ["Retired", "Referral"],
    advisor: "Priya Raman",
    people: [
      {
        id: "bishop-samuel",
        firstName: "Samuel",
        lastName: "Bishop",
        role: "Head of household",
        dateOfBirth: "1956-09-03",
        email: "sam.bishop@example.com",
        phone: "+1 (919) 555-0108",
        maritalStatus: "Married",
        retirementDate: "2022-03-31",
      },
      {
        id: "bishop-irene",
        firstName: "Irene",
        lastName: "Bishop",
        role: "Spouse",
        dateOfBirth: "1957-06-25",
        email: "irene.bishop@example.com",
        maritalStatus: "Married",
      },
    ],
    accounts: [],
    opportunities: [
      {
        id: "bishop-opp",
        name: "Bishop new relationship",
        stage: "Qualified",
        value: 2600000,
        probability: 60,
        targetClose: "2026-10-31",
      },
    ],
    meetings: [
      {
        id: "bishop-m1",
        title: "Proposal walkthrough",
        type: "Prospect",
        date: "2026-09-16",
        advisor: "Priya Raman",
        summary:
          "Presented the income plan and fee schedule. Waiting on account statements from their current broker to finalize transfers.",
      },
    ],
    clientSince: null,
    lastReview: null,
    lastTouchpoint: { date: "2026-09-16", label: "Prospect" },
    touchpointTrend: TREND_B,
    touchpointMix: { meetings: 2, emails: 7, calls: 1, notes: 4 },
    estAssets: "$2M–$5M",
  },
  {
    id: "lambert",
    name: "Howard and June Lambert",
    type: "Past client",
    tier: null,
    tags: ["Retired"],
    advisor: "Sam Ito",
    people: [
      {
        id: "lambert-howard",
        firstName: "Howard",
        lastName: "Lambert",
        role: "Head of household",
        dateOfBirth: "1950-03-19",
        email: "howard.lambert@example.com",
        phone: "+1 (480) 555-0199",
        maritalStatus: "Married",
      },
      {
        id: "lambert-june",
        firstName: "June",
        lastName: "Lambert",
        role: "Spouse",
        dateOfBirth: "1952-07-07",
        maritalStatus: "Married",
      },
    ],
    accounts: [],
    opportunities: [],
    meetings: [
      {
        id: "lambert-m1",
        title: "Transition call",
        type: "Client check-in",
        date: "2025-12-10",
        advisor: "Sam Ito",
        summary:
          "Moving assets to their son's advisor in Arizona. Transfer paperwork confirmed; no open items.",
      },
    ],
    clientSince: "2016-04-01",
    pastClientSince: "2025-12-15",
    lastReview: "2025-06-18",
    lastTouchpoint: { date: "2025-12-10", label: "Client check-in" },
    touchpointTrend: TREND_QUIET,
    touchpointMix: { meetings: 1, emails: 2, calls: 1, notes: 1 },
  },
  {
    id: "foster",
    name: "Diane Foster",
    type: "Past client",
    tier: null,
    tags: ["Pre-retiree"],
    advisor: "Owen Calloway",
    people: [
      {
        id: "foster-diane",
        firstName: "Diane",
        lastName: "Foster",
        role: "Head of household",
        dateOfBirth: "1964-11-28",
        email: "diane.foster@example.com",
        phone: "+1 (720) 555-0161",
        maritalStatus: "Divorced",
      },
    ],
    accounts: [],
    opportunities: [],
    meetings: [],
    clientSince: "2019-08-01",
    pastClientSince: "2026-05-30",
    lastReview: "2025-11-04",
    lastTouchpoint: { date: "2026-05-28", label: "Email" },
    touchpointTrend: TREND_QUIET,
    touchpointMix: { meetings: 0, emails: 2, calls: 0, notes: 1 },
  },
];

export const SORT_OPTIONS = [
  { value: "assets", label: "AUM / Assets" },
  { value: "followUp", label: "Next follow-up" },
  { value: "pipeline", label: "Pipeline" },
  { value: "lastTouchpoint", label: "Last touchpoint" },
  { value: "name", label: "Household name" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const FOLLOW_UP_STATUSES = [
  { value: "overdue", label: "Overdue" },
  { value: "due-soon", label: "Due soon" },
  { value: "on-track", label: "On track" },
] as const;

export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number]["value"];

export const FOLLOW_UP_TONES: Record<FollowUpStatus, TagTone> = {
  overdue: "red",
  "due-soon": "amber",
  "on-track": "green",
};

export const TREND_WINDOWS = ["Last 30 Days", "Last 90 Days", "Last 12 Months"];
