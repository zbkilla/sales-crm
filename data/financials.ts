export const ASSET_CATEGORIES = [
  { key: "nonQualified", label: "Non-qualified", color: "bg-[#3987e5]" },
  { key: "retirement", label: "Retirement", color: "bg-[#d95926]" },
  { key: "stockOptions", label: "Stock options", color: "bg-[#199e70]" },
  {
    key: "businessInterests",
    label: "Business interests",
    color: "bg-[#c98500]",
  },
  { key: "realEstate", label: "Real estate", color: "bg-[#d55181]" },
  { key: "personal", label: "Personal", color: "bg-[#008300]" },
  { key: "notesReceivable", label: "Notes receivable", color: "bg-[#9085e9]" },
  {
    key: "trustsAndOwnedEntities",
    label: "Trusts & owned entities",
    color: "bg-[#e66767]",
  },
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number]["key"];

export const LIABILITY_CATEGORIES = [
  { key: "shortTerm", label: "Short-term" },
  { key: "longTerm", label: "Long-term" },
] as const;

export type LiabilityCategory = (typeof LIABILITY_CATEGORIES)[number]["key"];

export type OwnerType = "Client" | "Spouse" | "Joint";

export type OtherAsset = {
  id: string;
  name: string;
  category: AssetCategory;
  type: string;
  owner: OwnerType;
  value: number;
  valueAsOf: string;
  heldAway?: boolean;
  institution?: string;
};

export type LiabilityType =
  | "Mortgage"
  | "HELOC"
  | "Auto loan"
  | "Student loan"
  | "Credit card"
  | "Personal loan";

export type Liability = {
  id: string;
  name: string;
  type: LiabilityType;
  category: LiabilityCategory;
  lender: string;
  owner: OwnerType;
  balance: number;
  interestRate: number;
  rateAssumed?: boolean;
  monthlyPayment: number;
  linkedAssetId?: string;
  valueAsOf: string;
};

export type OutOfEstateEntity = {
  id: string;
  name: string;
  type: string;
  assets: { name: string; type: string; value: number }[];
  liabilities: { name: string; type: string; value: number }[];
};

export type PolicyType =
  | "Term life"
  | "Permanent life"
  | "Survivorship life"
  | "Disability"
  | "Long-term care"
  | "Umbrella"
  | "Homeowners";

export type InsurancePolicy = {
  id: string;
  type: PolicyType;
  carrier: string;
  insured: string;
  owner: string;
  coverage: number;
  coverageLabel?: string;
  premium: number;
  premiumFrequency: "Monthly" | "Quarterly" | "Annual";
  beneficiary?: string;
  expires?: string;
};

export type GoalCategory =
  | "Retirement"
  | "Income"
  | "Education"
  | "Estate"
  | "Charitable"
  | "Liquidity event"
  | "Debt"
  | "Protection";

export type GoalStatus =
  | "On track"
  | "Needs attention"
  | "At risk"
  | "Achieved";

export type Goal = {
  id: string;
  name: string;
  category: GoalCategory;
  targetAmount: number | null;
  targetDate: string | null;
  fundedPercent: number;
  priority: "High" | "Medium" | "Low";
  status: GoalStatus;
};

export type TeamMember = {
  role: string;
  name: string;
  firm?: string;
  email?: string;
};

export type AccountDetail = {
  beneficiaryPrimary?: string;
  beneficiaryContingent?: string;
  valueAsOf?: string;
};

export type EstateDocument = {
  name: string;
  signed: string | null;
  status: "Current" | "Review due" | "Missing";
};

export type HouseholdFinancials = {
  accountDetails: Record<string, AccountDetail>;
  otherAssets: OtherAsset[];
  liabilities: Liability[];
  outOfEstate: OutOfEstateEntity[];
  insurance: InsurancePolicy[];
  goals: Goal[];
  team: TeamMember[];
  estateDocuments: EstateDocument[];
};

export const CUSTODIAN_AS_OF = "2026-10-03";

export const FINANCIALS: Record<string, HouseholdFinancials> = {
  hartwell: {
    accountDetails: {
      "hartwell-joint": {
        beneficiaryPrimary: "Hartwell Revocable Trust (TOD)",
      },
      "hartwell-ira": {
        beneficiaryPrimary: "Eleanor Hartwell",
        beneficiaryContingent: "Children, per stirpes",
      },
      "hartwell-roth": {
        beneficiaryPrimary: "Thomas Hartwell",
        beneficiaryContingent: "Children, per stirpes",
      },
      "hartwell-checking": { valueAsOf: "2026-09-30" },
    },
    otherAssets: [
      {
        id: "hartwell-home",
        name: "Primary residence, Sausalito",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 3200000,
        valueAsOf: "2026-06-30",
      },
      {
        id: "hartwell-tahoe",
        name: "Lake Tahoe cabin",
        category: "realEstate",
        type: "Vacation home",
        owner: "Joint",
        value: 1150000,
        valueAsOf: "2025-08-20",
      },
      {
        id: "hartwell-art",
        name: "Art collection",
        category: "personal",
        type: "Collectibles",
        owner: "Spouse",
        value: 240000,
        valueAsOf: "2024-05-01",
      },
      {
        id: "hartwell-vehicles",
        name: "Vehicles",
        category: "personal",
        type: "Vehicles",
        owner: "Joint",
        value: 95000,
        valueAsOf: "2026-06-30",
      },
    ],
    liabilities: [
      {
        id: "hartwell-heloc",
        name: "Tahoe cabin HELOC",
        type: "HELOC",
        category: "longTerm",
        lender: "First Republic",
        owner: "Joint",
        balance: 120000,
        interestRate: 7.25,
        rateAssumed: true,
        monthlyPayment: 1050,
        linkedAssetId: "hartwell-tahoe",
        valueAsOf: "2026-09-30",
      },
      {
        id: "hartwell-card",
        name: "Credit cards",
        type: "Credit card",
        category: "shortTerm",
        lender: "American Express",
        owner: "Joint",
        balance: 8400,
        interestRate: 0,
        monthlyPayment: 8400,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [
      {
        id: "hartwell-ilit",
        name: "Hartwell Family ILIT",
        type: "Irrevocable life insurance trust",
        assets: [
          {
            name: "Survivorship UL policy (cash value)",
            type: "Life insurance",
            value: 310000,
          },
        ],
        liabilities: [],
      },
    ],
    insurance: [
      {
        id: "hartwell-sul",
        type: "Survivorship life",
        carrier: "Pacific Life",
        insured: "Thomas & Eleanor",
        owner: "Hartwell Family ILIT",
        coverage: 4000000,
        premium: 38000,
        premiumFrequency: "Annual",
        beneficiary: "Hartwell Family ILIT",
      },
      {
        id: "hartwell-ltc-t",
        type: "Long-term care",
        carrier: "Genworth",
        insured: "Thomas",
        owner: "Thomas",
        coverage: 365000,
        coverageLabel: "$365K benefit pool",
        premium: 4800,
        premiumFrequency: "Annual",
      },
      {
        id: "hartwell-ltc-e",
        type: "Long-term care",
        carrier: "Genworth",
        insured: "Eleanor",
        owner: "Eleanor",
        coverage: 365000,
        coverageLabel: "$365K benefit pool",
        premium: 5200,
        premiumFrequency: "Annual",
      },
      {
        id: "hartwell-umbrella",
        type: "Umbrella",
        carrier: "Chubb",
        insured: "Household",
        owner: "Joint",
        coverage: 5000000,
        premium: 1450,
        premiumFrequency: "Annual",
      },
    ],
    goals: [
      {
        id: "hartwell-income",
        name: "Sustain $240K/yr retirement spending",
        category: "Income",
        targetAmount: 240000,
        targetDate: null,
        fundedPercent: 100,
        priority: "High",
        status: "On track",
      },
      {
        id: "hartwell-daf",
        name: "Fund a donor-advised fund with appreciated shares",
        category: "Charitable",
        targetAmount: 500000,
        targetDate: "2026-12-15",
        fundedPercent: 40,
        priority: "Medium",
        status: "Needs attention",
      },
      {
        id: "hartwell-estate",
        name: "Update revocable trust schedule",
        category: "Estate",
        targetAmount: null,
        targetDate: "2026-11-30",
        fundedPercent: 50,
        priority: "Medium",
        status: "Needs attention",
      },
    ],
    team: [
      {
        role: "Estate attorney",
        name: "James Holloway",
        firm: "Holloway & Pratt",
        email: "jholloway@example.com",
      },
      {
        role: "CPA",
        name: "Linda Park, CPA",
        firm: "Park & Associates",
        email: "linda@example.com",
      },
    ],
    estateDocuments: [
      { name: "Revocable trust", signed: "2019-03-12", status: "Review due" },
      { name: "Pour-over wills", signed: "2019-03-12", status: "Current" },
      {
        name: "Durable powers of attorney",
        signed: "2019-03-12",
        status: "Current",
      },
      {
        name: "Healthcare directives",
        signed: "2019-03-12",
        status: "Current",
      },
    ],
  },
  reyes: {
    accountDetails: {
      "reyes-trust": { beneficiaryPrimary: "Per trust terms" },
      "reyes-individual": { beneficiaryPrimary: "Sofia Reyes (TOD)" },
      "reyes-401k": {
        beneficiaryPrimary: "Sofia Reyes",
        beneficiaryContingent: "Reyes Family Revocable Trust",
      },
      "reyes-529-mateo": { beneficiaryPrimary: "Mateo Reyes" },
      "reyes-529-lucia": { beneficiaryPrimary: "Lucia Reyes" },
    },
    otherAssets: [
      {
        id: "reyes-business",
        name: "Reyes Logistics (100% interest)",
        category: "businessInterests",
        type: "Operating business",
        owner: "Client",
        value: 8500000,
        valueAsOf: "2025-06-30",
      },
      {
        id: "reyes-home",
        name: "Primary residence, Austin",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 1850000,
        valueAsOf: "2026-03-31",
      },
      {
        id: "reyes-duplex",
        name: "Rental duplex, East Austin",
        category: "realEstate",
        type: "Rental property",
        owner: "Joint",
        value: 720000,
        valueAsOf: "2026-03-31",
      },
      {
        id: "reyes-vehicles",
        name: "Vehicles",
        category: "personal",
        type: "Vehicles",
        owner: "Joint",
        value: 110000,
        valueAsOf: "2026-03-31",
      },
    ],
    liabilities: [
      {
        id: "reyes-mortgage",
        name: "Primary residence mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Frost Bank",
        owner: "Joint",
        balance: 640000,
        interestRate: 3.125,
        monthlyPayment: 4380,
        linkedAssetId: "reyes-home",
        valueAsOf: "2026-09-30",
      },
      {
        id: "reyes-duplex-mortgage",
        name: "Duplex mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Frost Bank",
        owner: "Joint",
        balance: 410000,
        interestRate: 6.5,
        monthlyPayment: 2950,
        linkedAssetId: "reyes-duplex",
        valueAsOf: "2026-09-30",
      },
      {
        id: "reyes-card",
        name: "Credit cards",
        type: "Credit card",
        category: "shortTerm",
        lender: "Chase",
        owner: "Joint",
        balance: 12300,
        interestRate: 0,
        monthlyPayment: 12300,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [
      {
        id: "reyes-gift-trust",
        name: "Reyes 2021 Irrevocable Gift Trust",
        type: "Irrevocable trust",
        assets: [
          {
            name: "Trust brokerage account",
            type: "Taxable investment",
            value: 450000,
          },
        ],
        liabilities: [],
      },
    ],
    insurance: [
      {
        id: "reyes-term-d",
        type: "Term life",
        carrier: "Protective",
        insured: "Daniel",
        owner: "Daniel",
        coverage: 5000000,
        premium: 6200,
        premiumFrequency: "Annual",
        beneficiary: "Sofia Reyes",
        expires: "2038-04-01",
      },
      {
        id: "reyes-term-s",
        type: "Term life",
        carrier: "Protective",
        insured: "Sofia",
        owner: "Sofia",
        coverage: 2000000,
        premium: 1900,
        premiumFrequency: "Annual",
        beneficiary: "Daniel Reyes",
        expires: "2038-04-01",
      },
      {
        id: "reyes-di",
        type: "Disability",
        carrier: "Guardian",
        insured: "Sofia",
        owner: "Sofia",
        coverage: 12000,
        coverageLabel: "$12K/mo, own-occupation",
        premium: 310,
        premiumFrequency: "Monthly",
      },
      {
        id: "reyes-umbrella",
        type: "Umbrella",
        carrier: "Chubb",
        insured: "Household",
        owner: "Joint",
        coverage: 3000000,
        premium: 980,
        premiumFrequency: "Annual",
      },
    ],
    goals: [
      {
        id: "reyes-liquidity",
        name: "Plan and invest Reyes Logistics sale proceeds",
        category: "Liquidity event",
        targetAmount: 2500000,
        targetDate: "2027-03-31",
        fundedPercent: 40,
        priority: "High",
        status: "Needs attention",
      },
      {
        id: "reyes-college",
        name: "Fund college for Mateo and Lucia",
        category: "Education",
        targetAmount: 600000,
        targetDate: "2028-08-15",
        fundedPercent: 36,
        priority: "High",
        status: "At risk",
      },
      {
        id: "reyes-retire",
        name: "Daniel retires at 62",
        category: "Retirement",
        targetAmount: null,
        targetDate: "2030-02-21",
        fundedPercent: 74,
        priority: "Medium",
        status: "On track",
      },
    ],
    team: [
      {
        role: "CPA",
        name: "Elena Ruiz, CPA",
        firm: "Ruiz Tax Advisors",
        email: "elena@example.com",
      },
      {
        role: "M&A advisor",
        name: "Grant Whitley",
        firm: "Hill Country Capital",
      },
      {
        role: "Estate attorney",
        name: "Priscilla Moreau",
        firm: "Moreau Estate Law",
      },
    ],
    estateDocuments: [
      { name: "Revocable trust", signed: "2021-05-18", status: "Current" },
      {
        name: "Wills with guardianship",
        signed: "2021-05-18",
        status: "Current",
      },
      { name: "Buy-sell agreement", signed: null, status: "Missing" },
    ],
  },
  chen: {
    accountDetails: {
      "chen-individual": { beneficiaryPrimary: "James Chen (TOD)" },
      "chen-ira": {
        beneficiaryPrimary: "James Chen",
        beneficiaryContingent: "Grandchildren, per stirpes",
      },
      "chen-inherited": {},
    },
    otherAssets: [
      {
        id: "chen-home",
        name: "Primary residence, Palo Alto",
        category: "realEstate",
        type: "Primary residence",
        owner: "Client",
        value: 2900000,
        valueAsOf: "2026-04-15",
      },
      {
        id: "chen-personal",
        name: "Vehicle and jewelry",
        category: "personal",
        type: "Personal property",
        owner: "Client",
        value: 60000,
        valueAsOf: "2026-04-15",
      },
    ],
    liabilities: [],
    outOfEstate: [],
    insurance: [
      {
        id: "chen-ltc",
        type: "Long-term care",
        carrier: "Mutual of Omaha",
        insured: "Margaret",
        owner: "Margaret",
        coverage: 200000,
        coverageLabel: "$200K benefit pool",
        premium: 3900,
        premiumFrequency: "Annual",
      },
      {
        id: "chen-home-ins",
        type: "Homeowners",
        carrier: "Chubb",
        insured: "Palo Alto residence",
        owner: "Margaret",
        coverage: 2100000,
        premium: 4200,
        premiumFrequency: "Annual",
      },
    ],
    goals: [
      {
        id: "chen-income",
        name: "Sustain $14K/month income",
        category: "Income",
        targetAmount: 168000,
        targetDate: null,
        fundedPercent: 100,
        priority: "High",
        status: "On track",
      },
      {
        id: "chen-legacy",
        name: "Leave a legacy to grandchildren",
        category: "Estate",
        targetAmount: null,
        targetDate: null,
        fundedPercent: 60,
        priority: "Medium",
        status: "On track",
      },
    ],
    team: [
      {
        role: "Power of attorney",
        name: "James Chen",
        firm: "Son",
        email: "james.chen@example.com",
      },
      { role: "Estate attorney", name: "Ruth Alvarez", firm: "Alvarez & Kim" },
    ],
    estateDocuments: [
      { name: "Revocable trust", signed: "2022-01-20", status: "Current" },
      {
        name: "Durable power of attorney",
        signed: "2022-01-20",
        status: "Current",
      },
      { name: "Trusted contact form", signed: "2026-09-03", status: "Current" },
    ],
  },
  feldman: {
    accountDetails: {
      "feldman-joint": {},
      "feldman-rollover": {
        beneficiaryPrimary: "Aaron Feldman",
        beneficiaryContingent: "Children, equal shares",
      },
      "feldman-401k": {
        beneficiaryPrimary: "Naomi Feldman",
        valueAsOf: "2025-06-30",
      },
    },
    otherAssets: [
      {
        id: "feldman-home",
        name: "Primary residence, Denver",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 980000,
        valueAsOf: "2026-02-01",
      },
      {
        id: "feldman-vehicles",
        name: "Vehicles",
        category: "personal",
        type: "Vehicles",
        owner: "Joint",
        value: 55000,
        valueAsOf: "2026-02-01",
      },
    ],
    liabilities: [
      {
        id: "feldman-mortgage",
        name: "Primary residence mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Wells Fargo",
        owner: "Joint",
        balance: 312000,
        interestRate: 2.875,
        monthlyPayment: 2140,
        linkedAssetId: "feldman-home",
        valueAsOf: "2026-09-30",
      },
      {
        id: "feldman-auto",
        name: "Auto loan",
        type: "Auto loan",
        category: "shortTerm",
        lender: "Toyota Financial",
        owner: "Spouse",
        balance: 18500,
        interestRate: 4.9,
        monthlyPayment: 520,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [],
    insurance: [
      {
        id: "feldman-term",
        type: "Term life",
        carrier: "Banner Life",
        insured: "Aaron",
        owner: "Aaron",
        coverage: 1500000,
        premium: 2300,
        premiumFrequency: "Annual",
        beneficiary: "Naomi Feldman",
        expires: "2028-06-30",
      },
    ],
    goals: [
      {
        id: "feldman-retire",
        name: "Aaron retires at end of 2028",
        category: "Retirement",
        targetAmount: null,
        targetDate: "2028-12-31",
        fundedPercent: 82,
        priority: "High",
        status: "Needs attention",
      },
      {
        id: "feldman-roth",
        name: "Roth conversions 2029–2031",
        category: "Retirement",
        targetAmount: 300000,
        targetDate: "2031-12-31",
        fundedPercent: 0,
        priority: "Medium",
        status: "On track",
      },
    ],
    team: [{ role: "CPA", name: "Dev Patel, CPA", firm: "Front Range Tax" }],
    estateDocuments: [
      { name: "Wills", signed: "2012-09-10", status: "Review due" },
      { name: "Durable powers of attorney", signed: null, status: "Missing" },
    ],
  },
  patel: {
    accountDetails: {
      "patel-joint": {},
      "patel-roth-kevin": { beneficiaryPrimary: "Jasmine Patel" },
      "patel-roth-jasmine": { beneficiaryPrimary: "Kevin Patel" },
    },
    otherAssets: [
      {
        id: "patel-rsus",
        name: "Cascade Cloud unvested RSUs",
        category: "stockOptions",
        type: "Restricted stock units",
        owner: "Client",
        value: 410000,
        valueAsOf: "2026-09-30",
      },
      {
        id: "patel-home",
        name: "Primary residence, Seattle",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 1250000,
        valueAsOf: "2026-05-01",
      },
      {
        id: "patel-personal",
        name: "Vehicles",
        category: "personal",
        type: "Vehicles",
        owner: "Joint",
        value: 40000,
        valueAsOf: "2026-05-01",
      },
    ],
    liabilities: [
      {
        id: "patel-mortgage",
        name: "Primary residence mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Chase",
        owner: "Joint",
        balance: 860000,
        interestRate: 6.125,
        monthlyPayment: 5590,
        linkedAssetId: "patel-home",
        valueAsOf: "2026-09-30",
      },
      {
        id: "patel-student",
        name: "Graduate student loan",
        type: "Student loan",
        category: "longTerm",
        lender: "Nelnet",
        owner: "Spouse",
        balance: 24000,
        interestRate: 5.5,
        monthlyPayment: 310,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [],
    insurance: [
      {
        id: "patel-term-k",
        type: "Term life",
        carrier: "Haven Life",
        insured: "Kevin",
        owner: "Kevin",
        coverage: 2000000,
        premium: 1450,
        premiumFrequency: "Annual",
        beneficiary: "Jasmine Patel",
        expires: "2052-01-01",
      },
      {
        id: "patel-term-j",
        type: "Term life",
        carrier: "Haven Life",
        insured: "Jasmine",
        owner: "Jasmine",
        coverage: 1000000,
        premium: 820,
        premiumFrequency: "Annual",
        expires: "2052-01-01",
      },
    ],
    goals: [
      {
        id: "patel-college",
        name: "Open and fund a 529 for Arjun",
        category: "Education",
        targetAmount: 250000,
        targetDate: "2039-08-15",
        fundedPercent: 0,
        priority: "Medium",
        status: "Needs attention",
      },
      {
        id: "patel-concentration",
        name: "Reduce employer stock concentration below 15%",
        category: "Protection",
        targetAmount: null,
        targetDate: "2027-06-30",
        fundedPercent: 35,
        priority: "High",
        status: "Needs attention",
      },
    ],
    team: [{ role: "Referral source", name: "Ethan Sullivan", firm: "Client" }],
    estateDocuments: [
      { name: "Wills with guardianship", signed: null, status: "Missing" },
    ],
  },
  whitaker: {
    accountDetails: {
      "whitaker-joint": {},
      "whitaker-ira": {
        beneficiaryPrimary: "Anne Whitaker",
        beneficiaryContingent: "First Baptist Church (10%), children (90%)",
      },
    },
    otherAssets: [
      {
        id: "whitaker-home",
        name: "Primary residence, Raleigh",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 760000,
        valueAsOf: "2026-01-15",
      },
      {
        id: "whitaker-vehicles",
        name: "Vehicles",
        category: "personal",
        type: "Vehicles",
        owner: "Joint",
        value: 45000,
        valueAsOf: "2026-01-15",
      },
    ],
    liabilities: [],
    outOfEstate: [],
    insurance: [
      {
        id: "whitaker-ltc",
        type: "Long-term care",
        carrier: "OneAmerica",
        insured: "Gregory & Anne",
        owner: "Joint",
        coverage: 500000,
        coverageLabel: "$500K shared pool",
        premium: 7600,
        premiumFrequency: "Annual",
      },
    ],
    goals: [
      {
        id: "whitaker-income",
        name: "Sustain $110K/yr retirement spending",
        category: "Income",
        targetAmount: 110000,
        targetDate: null,
        fundedPercent: 100,
        priority: "High",
        status: "On track",
      },
      {
        id: "whitaker-qcd",
        name: "Give $40K/yr through QCDs",
        category: "Charitable",
        targetAmount: 40000,
        targetDate: "2026-12-31",
        fundedPercent: 100,
        priority: "Medium",
        status: "Achieved",
      },
    ],
    team: [{ role: "CPA", name: "Sandra Owens, CPA", firm: "Owens Tax Group" }],
    estateDocuments: [
      { name: "Wills", signed: "2020-11-02", status: "Current" },
      {
        name: "Durable powers of attorney",
        signed: "2020-11-02",
        status: "Current",
      },
    ],
  },
  brooks: {
    accountDetails: {
      "brooks-individual": {},
      "brooks-rollover": {},
    },
    otherAssets: [
      {
        id: "brooks-studio",
        name: "Brooks Design Studio (100% interest)",
        category: "businessInterests",
        type: "Operating business",
        owner: "Client",
        value: 1200000,
        valueAsOf: "2025-03-31",
      },
      {
        id: "brooks-condo",
        name: "Condo, Chicago",
        category: "realEstate",
        type: "Primary residence",
        owner: "Client",
        value: 540000,
        valueAsOf: "2026-07-01",
      },
    ],
    liabilities: [
      {
        id: "brooks-mortgage",
        name: "Condo mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "BMO",
        owner: "Client",
        balance: 290000,
        interestRate: 5.25,
        monthlyPayment: 1980,
        linkedAssetId: "brooks-condo",
        valueAsOf: "2026-09-30",
      },
      {
        id: "brooks-card",
        name: "Credit card",
        type: "Credit card",
        category: "shortTerm",
        lender: "Capital One",
        owner: "Client",
        balance: 6200,
        interestRate: 22.9,
        rateAssumed: true,
        monthlyPayment: 400,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [],
    insurance: [
      {
        id: "brooks-di",
        type: "Disability",
        carrier: "Principal",
        insured: "Lauren",
        owner: "Lauren",
        coverage: 9000,
        coverageLabel: "$9K/mo, own-occupation",
        premium: 240,
        premiumFrequency: "Monthly",
      },
      {
        id: "brooks-term",
        type: "Term life",
        carrier: "Lincoln",
        insured: "Lauren",
        owner: "Lauren",
        coverage: 1000000,
        premium: 980,
        premiumFrequency: "Annual",
        expires: "2041-09-01",
      },
    ],
    goals: [
      {
        id: "brooks-cbp",
        name: "Adopt a cash balance plan for the studio",
        category: "Retirement",
        targetAmount: 450000,
        targetDate: "2026-12-01",
        fundedPercent: 20,
        priority: "High",
        status: "At risk",
      },
      {
        id: "brooks-succession",
        name: "Studio succession plan",
        category: "Liquidity event",
        targetAmount: null,
        targetDate: "2032-12-31",
        fundedPercent: 10,
        priority: "Low",
        status: "On track",
      },
    ],
    team: [
      {
        role: "Plan administrator",
        name: "Retirement Plan Partners",
        firm: "TPA",
      },
      { role: "CPA", name: "Owen Fitz, CPA", firm: "Fitz & Co." },
    ],
    estateDocuments: [
      { name: "Will", signed: null, status: "Missing" },
      { name: "Durable power of attorney", signed: null, status: "Missing" },
    ],
  },
  morales: {
    accountDetails: {
      "morales-joint": {},
      "morales-rollover": {
        beneficiaryPrimary: "Helen Morales",
        beneficiaryContingent: "Isabel Morales",
      },
    },
    otherAssets: [
      {
        id: "morales-home",
        name: "Primary residence, Phoenix",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 520000,
        valueAsOf: "2025-09-01",
      },
      {
        id: "morales-vehicles",
        name: "Vehicles",
        category: "personal",
        type: "Vehicles",
        owner: "Joint",
        value: 40000,
        valueAsOf: "2025-09-01",
      },
    ],
    liabilities: [
      {
        id: "morales-mortgage",
        name: "Primary residence mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Rocket Mortgage",
        owner: "Joint",
        balance: 210000,
        interestRate: 3.5,
        monthlyPayment: 1640,
        linkedAssetId: "morales-home",
        valueAsOf: "2026-09-30",
      },
      {
        id: "morales-auto",
        name: "Auto loan",
        type: "Auto loan",
        category: "shortTerm",
        lender: "Ally",
        owner: "Client",
        balance: 22000,
        interestRate: 7.4,
        rateAssumed: true,
        monthlyPayment: 610,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [],
    insurance: [
      {
        id: "morales-term",
        type: "Term life",
        carrier: "Transamerica",
        insured: "Victor",
        owner: "Victor",
        coverage: 750000,
        premium: 1100,
        premiumFrequency: "Annual",
        beneficiary: "Helen Morales",
        expires: "2027-05-01",
      },
    ],
    goals: [
      {
        id: "morales-retire",
        name: "Retire at 65 with $90K/yr",
        category: "Retirement",
        targetAmount: 90000,
        targetDate: "2031-05-02",
        fundedPercent: 58,
        priority: "High",
        status: "At risk",
      },
      {
        id: "morales-ltc",
        name: "Decide on long-term care coverage",
        category: "Protection",
        targetAmount: null,
        targetDate: "2026-12-31",
        fundedPercent: 0,
        priority: "Medium",
        status: "Needs attention",
      },
    ],
    team: [],
    estateDocuments: [
      { name: "Wills", signed: "2016-04-22", status: "Review due" },
    ],
  },
  sullivan: {
    accountDetails: {
      "sullivan-joint": {},
      "sullivan-roth": { beneficiaryPrimary: "Ethan Sullivan" },
      "sullivan-529": { beneficiaryPrimary: "Nora Sullivan" },
    },
    otherAssets: [
      {
        id: "sullivan-condo",
        name: "Condo, Boston",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 690000,
        valueAsOf: "2026-02-15",
      },
    ],
    liabilities: [
      {
        id: "sullivan-mortgage",
        name: "Condo mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Citizens",
        owner: "Joint",
        balance: 540000,
        interestRate: 6.75,
        monthlyPayment: 3600,
        linkedAssetId: "sullivan-condo",
        valueAsOf: "2026-09-30",
      },
      {
        id: "sullivan-student-e",
        name: "Medical school loans (PSLF)",
        type: "Student loan",
        category: "longTerm",
        lender: "MOHELA",
        owner: "Client",
        balance: 285000,
        interestRate: 6.8,
        monthlyPayment: 410,
        valueAsOf: "2026-09-30",
      },
      {
        id: "sullivan-student-c",
        name: "Law school loans",
        type: "Student loan",
        category: "longTerm",
        lender: "SoFi",
        owner: "Spouse",
        balance: 62000,
        interestRate: 5.8,
        monthlyPayment: 690,
        valueAsOf: "2026-09-30",
      },
      {
        id: "sullivan-card",
        name: "Credit card",
        type: "Credit card",
        category: "shortTerm",
        lender: "Citi",
        owner: "Joint",
        balance: 4100,
        interestRate: 0,
        monthlyPayment: 4100,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [],
    insurance: [
      {
        id: "sullivan-term-e",
        type: "Term life",
        carrier: "Banner Life",
        insured: "Ethan",
        owner: "Ethan",
        coverage: 2000000,
        premium: 1050,
        premiumFrequency: "Annual",
        beneficiary: "Chloe Sullivan",
        expires: "2054-11-01",
      },
      {
        id: "sullivan-di",
        type: "Disability",
        carrier: "MassMutual",
        insured: "Ethan",
        owner: "Ethan",
        coverage: 10000,
        coverageLabel: "$10K/mo, own-occupation",
        premium: 290,
        premiumFrequency: "Monthly",
      },
    ],
    goals: [
      {
        id: "sullivan-pslf",
        name: "PSLF forgiveness on Ethan's loans",
        category: "Debt",
        targetAmount: 285000,
        targetDate: "2031-07-01",
        fundedPercent: 55,
        priority: "High",
        status: "On track",
      },
      {
        id: "sullivan-college",
        name: "Fund college for Nora",
        category: "Education",
        targetAmount: 200000,
        targetDate: "2042-08-15",
        fundedPercent: 19,
        priority: "Medium",
        status: "On track",
      },
    ],
    team: [],
    estateDocuments: [
      { name: "Wills with guardianship", signed: null, status: "Missing" },
    ],
  },
  avery: {
    accountDetails: {
      "avery-ira": {
        beneficiaryPrimary: "Claire Avery",
        beneficiaryContingent: "Grandchildren, per stirpes",
      },
    },
    otherAssets: [
      {
        id: "avery-home",
        name: "Primary residence, Portland",
        category: "realEstate",
        type: "Primary residence",
        owner: "Client",
        value: 610000,
        valueAsOf: "2026-02-10",
      },
    ],
    liabilities: [],
    outOfEstate: [],
    insurance: [],
    goals: [
      {
        id: "avery-income",
        name: "Monthly income from IRA",
        category: "Income",
        targetAmount: 30000,
        targetDate: null,
        fundedPercent: 100,
        priority: "High",
        status: "On track",
      },
    ],
    team: [
      {
        role: "Trusted contact",
        name: "Claire Avery",
        firm: "Daughter",
        email: "claire.avery@example.com",
      },
    ],
    estateDocuments: [
      { name: "Will", signed: "2018-08-14", status: "Current" },
      {
        name: "Durable power of attorney",
        signed: "2018-08-14",
        status: "Current",
      },
    ],
  },
  coleman: {
    accountDetails: {
      "coleman-joint": {},
      "coleman-roth": { beneficiaryPrimary: "Brian Coleman" },
    },
    otherAssets: [
      {
        id: "coleman-home",
        name: "Primary residence, Atlanta",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 385000,
        valueAsOf: "2025-08-15",
      },
      {
        id: "coleman-vehicles",
        name: "Vehicles",
        category: "personal",
        type: "Vehicles",
        owner: "Joint",
        value: 38000,
        valueAsOf: "2025-08-15",
      },
    ],
    liabilities: [
      {
        id: "coleman-mortgage",
        name: "Primary residence mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Truist",
        owner: "Joint",
        balance: 268000,
        interestRate: 6.9,
        monthlyPayment: 1890,
        linkedAssetId: "coleman-home",
        valueAsOf: "2026-09-30",
      },
      {
        id: "coleman-auto",
        name: "Auto loan",
        type: "Auto loan",
        category: "shortTerm",
        lender: "Capital One Auto",
        owner: "Client",
        balance: 21000,
        interestRate: 8.1,
        monthlyPayment: 560,
        valueAsOf: "2026-09-30",
      },
      {
        id: "coleman-card",
        name: "Credit card",
        type: "Credit card",
        category: "shortTerm",
        lender: "Discover",
        owner: "Spouse",
        balance: 3800,
        interestRate: 24.9,
        rateAssumed: true,
        monthlyPayment: 150,
        valueAsOf: "2026-09-30",
      },
    ],
    outOfEstate: [],
    insurance: [
      {
        id: "coleman-term",
        type: "Term life",
        carrier: "Ladder",
        insured: "Brian",
        owner: "Brian",
        coverage: 500000,
        premium: 420,
        premiumFrequency: "Annual",
        beneficiary: "Tasha Coleman",
        expires: "2044-02-01",
      },
    ],
    goals: [
      {
        id: "coleman-emergency",
        name: "Six-month emergency fund",
        category: "Protection",
        targetAmount: 36000,
        targetDate: null,
        fundedPercent: 100,
        priority: "High",
        status: "Achieved",
      },
      {
        id: "coleman-roth",
        name: "Open a Roth IRA for Brian",
        category: "Retirement",
        targetAmount: 7000,
        targetDate: "2026-12-31",
        fundedPercent: 0,
        priority: "Medium",
        status: "Needs attention",
      },
      {
        id: "coleman-debt",
        name: "Pay off credit card and auto loan",
        category: "Debt",
        targetAmount: 24800,
        targetDate: "2027-06-30",
        fundedPercent: 30,
        priority: "Medium",
        status: "On track",
      },
    ],
    team: [{ role: "Referral source", name: "Kevin Patel", firm: "Client" }],
    estateDocuments: [{ name: "Wills", signed: null, status: "Missing" }],
  },
  thornton: {
    accountDetails: {},
    otherAssets: [
      {
        id: "thornton-401k",
        name: "Thornton & Lake 401(k)",
        category: "retirement",
        type: "401(k)",
        owner: "Client",
        value: 1450000,
        valueAsOf: "2026-09-29",
        heldAway: true,
        institution: "Current recordkeeper",
      },
      {
        id: "thornton-ira",
        name: "Grace Traditional IRA",
        category: "retirement",
        type: "Traditional IRA",
        owner: "Spouse",
        value: 420000,
        valueAsOf: "2026-09-29",
        heldAway: true,
        institution: "Current broker",
      },
      {
        id: "thornton-brokerage",
        name: "Joint brokerage",
        category: "nonQualified",
        type: "Taxable brokerage",
        owner: "Joint",
        value: 1330000,
        valueAsOf: "2026-09-29",
        heldAway: true,
        institution: "Current broker",
      },
      {
        id: "thornton-home",
        name: "Primary residence, Mill Valley",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 2400000,
        valueAsOf: "2026-09-29",
      },
    ],
    liabilities: [
      {
        id: "thornton-mortgage",
        name: "Primary residence mortgage",
        type: "Mortgage",
        category: "longTerm",
        lender: "Unknown — confirm",
        owner: "Joint",
        balance: 600000,
        interestRate: 3.0,
        rateAssumed: true,
        monthlyPayment: 3800,
        linkedAssetId: "thornton-home",
        valueAsOf: "2026-09-29",
      },
    ],
    outOfEstate: [],
    insurance: [],
    goals: [
      {
        id: "thornton-retire",
        name: "Second opinion on retiring in 2028",
        category: "Retirement",
        targetAmount: null,
        targetDate: "2028-06-30",
        fundedPercent: 0,
        priority: "High",
        status: "Needs attention",
      },
    ],
    team: [
      {
        role: "Referral source",
        name: "Thomas and Eleanor Hartwell",
        firm: "Client",
      },
    ],
    estateDocuments: [],
  },
  bishop: {
    accountDetails: {},
    otherAssets: [
      {
        id: "bishop-brokerage",
        name: "Joint brokerage",
        category: "nonQualified",
        type: "Taxable brokerage",
        owner: "Joint",
        value: 1200000,
        valueAsOf: "2026-09-16",
        heldAway: true,
        institution: "Current broker",
      },
      {
        id: "bishop-ira-s",
        name: "Samuel Rollover IRA",
        category: "retirement",
        type: "Rollover IRA",
        owner: "Client",
        value: 900000,
        valueAsOf: "2026-09-16",
        heldAway: true,
        institution: "Current broker",
      },
      {
        id: "bishop-ira-i",
        name: "Irene Traditional IRA",
        category: "retirement",
        type: "Traditional IRA",
        owner: "Spouse",
        value: 500000,
        valueAsOf: "2026-09-16",
        heldAway: true,
        institution: "Current broker",
      },
      {
        id: "bishop-home",
        name: "Primary residence, Cary",
        category: "realEstate",
        type: "Primary residence",
        owner: "Joint",
        value: 850000,
        valueAsOf: "2026-09-16",
      },
    ],
    liabilities: [],
    outOfEstate: [],
    insurance: [],
    goals: [
      {
        id: "bishop-income",
        name: "Reliable retirement income plan",
        category: "Income",
        targetAmount: 120000,
        targetDate: null,
        fundedPercent: 0,
        priority: "High",
        status: "Needs attention",
      },
    ],
    team: [],
    estateDocuments: [],
  },
};
