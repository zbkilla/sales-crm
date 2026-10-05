import type { Account, Household, Person } from "@/data/households";
import {
  ASSET_CATEGORIES,
  CUSTODIAN_AS_OF,
  FINANCIALS,
  LIABILITY_CATEGORIES,
  type AssetCategory,
  type HouseholdFinancials,
  type LiabilityCategory,
  type OutOfEstateEntity,
  type OwnerType,
} from "@/data/financials";

export type BalanceSheetEntityValues = {
  clientValue: number;
  spouseValue: number;
  jointValue: number;
  totalValue: number;
};

export type BalanceSheetEntity = BalanceSheetEntityValues & {
  id: string;
  category: string;
  description: string;
  detail: string;
  valueAsOf: string;
  managed: boolean;
};

export type BalanceSheetAssets = Record<AssetCategory, BalanceSheetEntity[]> & {
  totalAssets: BalanceSheetEntityValues;
};

export type BalanceSheetLiabilities = Record<
  LiabilityCategory,
  BalanceSheetEntity[]
> & {
  totalLiabilities: BalanceSheetEntityValues;
};

export type BalanceSheet = {
  assets: BalanceSheetAssets;
  liabilities: BalanceSheetLiabilities;
  netWorth: BalanceSheetEntityValues;
  outOfEstate: (OutOfEstateEntity & { totalValue: number })[];
  hasSpouse: boolean;
  clientName: string;
  spouseName: string | null;
};

const EMPTY_FINANCIALS: HouseholdFinancials = {
  accountDetails: {},
  otherAssets: [],
  liabilities: [],
  outOfEstate: [],
  insurance: [],
  goals: [],
  team: [],
  estateDocuments: [],
};

const RETIREMENT_REGISTRATIONS = new Set([
  "Traditional IRA",
  "Roth IRA",
  "Rollover IRA",
  "Inherited IRA",
  "401(k)",
]);

export function formatRate(rate: number) {
  return `${Number(rate.toFixed(3))}%`;
}

export function householdFinancials(id: string): HouseholdFinancials {
  return FINANCIALS[id] ?? EMPTY_FINANCIALS;
}

export function hasFinancials(id: string) {
  return id in FINANCIALS;
}

export function spouseOf(household: Household): Person | undefined {
  return household.people.find(
    (person) => person.role === "Spouse" || person.role === "Partner",
  );
}

function headOf(household: Household) {
  return (
    household.people.find((person) => person.role === "Head of household") ??
    household.people[0]
  );
}

export function accountCategory(account: Account): AssetCategory {
  if (account.registration === "Trust") return "trustsAndOwnedEntities";
  if (RETIREMENT_REGISTRATIONS.has(account.registration)) return "retirement";
  return "nonQualified";
}

export function taxTreatment(account: Account) {
  if (account.registration === "Roth IRA") return "Tax-free";
  if (account.registration === "529") return "Tax-advantaged";
  if (RETIREMENT_REGISTRATIONS.has(account.registration)) return "Tax-deferred";
  return "Taxable";
}

export function accountOwner(
  household: Household,
  account: Account,
): OwnerType {
  const head = headOf(household);
  const spouse = spouseOf(household);
  const ownsHead = head ? account.ownerIds.includes(head.id) : false;
  const ownsSpouse = spouse ? account.ownerIds.includes(spouse.id) : false;
  if (ownsHead && ownsSpouse) return "Joint";
  if (ownsSpouse) return "Spouse";
  return "Client";
}

function values(owner: OwnerType, amount: number): BalanceSheetEntityValues {
  return {
    clientValue: owner === "Client" ? amount : 0,
    spouseValue: owner === "Spouse" ? amount : 0,
    jointValue: owner === "Joint" ? amount : 0,
    totalValue: amount,
  };
}

function sum(entities: BalanceSheetEntityValues[]): BalanceSheetEntityValues {
  return entities.reduce(
    (total, entity) => ({
      clientValue: total.clientValue + entity.clientValue,
      spouseValue: total.spouseValue + entity.spouseValue,
      jointValue: total.jointValue + entity.jointValue,
      totalValue: total.totalValue + entity.totalValue,
    }),
    { clientValue: 0, spouseValue: 0, jointValue: 0, totalValue: 0 },
  );
}

export function buildBalanceSheet(household: Household): BalanceSheet {
  const financials = householdFinancials(household.id);
  const head = headOf(household);
  const spouse = spouseOf(household);

  const assetLines: BalanceSheetEntity[] = [
    ...household.accounts.map((account) => ({
      id: account.id,
      category: accountCategory(account),
      description: account.name,
      detail: `${account.registration} · ${account.custodian} •••• ${account.numberLast4}`,
      valueAsOf:
        financials.accountDetails[account.id]?.valueAsOf ?? CUSTODIAN_AS_OF,
      managed: account.source === "custodian",
      ...values(accountOwner(household, account), account.balance),
    })),
    ...financials.otherAssets.map((asset) => ({
      id: asset.id,
      category: asset.category,
      description: asset.name,
      detail: asset.heldAway
        ? `${asset.type} · held away${asset.institution ? ` at ${asset.institution}` : ""}`
        : asset.type,
      valueAsOf: asset.valueAsOf,
      managed: false,
      ...values(asset.owner, asset.value),
    })),
  ];

  const liabilityLines: BalanceSheetEntity[] = financials.liabilities.map(
    (liability) => ({
      id: liability.id,
      category: liability.category,
      description: liability.name,
      detail: `${liability.type} · ${liability.lender} · ${formatRate(liability.interestRate)}${liability.rateAssumed ? " (assumed)" : ""}`,
      valueAsOf: liability.valueAsOf,
      managed: false,
      ...values(liability.owner, liability.balance),
    }),
  );

  const assetGroups = Object.fromEntries(
    ASSET_CATEGORIES.map((category) => [
      category.key,
      assetLines
        .filter((line) => line.category === category.key)
        .sort((a, b) => b.totalValue - a.totalValue),
    ]),
  ) as Record<AssetCategory, BalanceSheetEntity[]>;

  const liabilityGroups = Object.fromEntries(
    LIABILITY_CATEGORIES.map((category) => [
      category.key,
      liabilityLines
        .filter((line) => line.category === category.key)
        .sort((a, b) => b.totalValue - a.totalValue),
    ]),
  ) as Record<LiabilityCategory, BalanceSheetEntity[]>;

  const totalAssets = sum(assetLines);
  const totalLiabilities = sum(liabilityLines);

  return {
    assets: { ...assetGroups, totalAssets },
    liabilities: { ...liabilityGroups, totalLiabilities },
    netWorth: {
      clientValue: totalAssets.clientValue - totalLiabilities.clientValue,
      spouseValue: totalAssets.spouseValue - totalLiabilities.spouseValue,
      jointValue: totalAssets.jointValue - totalLiabilities.jointValue,
      totalValue: totalAssets.totalValue - totalLiabilities.totalValue,
    },
    outOfEstate: financials.outOfEstate.map((entity) => ({
      ...entity,
      totalValue:
        entity.assets.reduce((total, asset) => total + asset.value, 0) -
        entity.liabilities.reduce((total, item) => total + item.value, 0),
    })),
    hasSpouse: spouse !== undefined,
    clientName: head ? head.firstName : "Client",
    spouseName: spouse ? spouse.firstName : null,
  };
}

export function assetComposition(sheet: BalanceSheet) {
  const total = sheet.assets.totalAssets.totalValue;
  return ASSET_CATEGORIES.map((category) => {
    const value = sheet.assets[category.key].reduce(
      (sumValue, line) => sumValue + line.totalValue,
      0,
    );
    return {
      ...category,
      value,
      percent: total > 0 ? (value / total) * 100 : 0,
    };
  }).filter((category) => category.value > 0);
}

export function heldAwayAssets(sheet: BalanceSheet) {
  return ASSET_CATEGORIES.flatMap((category) => sheet.assets[category.key])
    .filter(
      (line) =>
        !line.managed &&
        (line.category === "retirement" || line.category === "nonQualified"),
    )
    .reduce((total, line) => total + line.totalValue, 0);
}
