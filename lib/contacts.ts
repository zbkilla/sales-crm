import {
  CONTACTS,
  type HouseholdContact,
  type PersonContact,
} from "@/data/contacts";
import type { Household, Person } from "@/data/households";
import { TODAY, ageFrom, daysBetween } from "@/lib/households";

export type ContactMethod = {
  kind: "phone" | "email";
  label: string;
  value: string;
  href: string;
};

export const CONTACT_ROLE_ORDER = [
  "Head of household",
  "Spouse",
  "Partner",
  "Other adult",
  "Non-dependent child",
  "Dependent child",
  "Grandchild",
  "Other dependent",
  "Deceased",
];

export function householdContact(
  householdId: string,
): HouseholdContact | undefined {
  return CONTACTS[householdId];
}

export function personContact(
  householdId: string,
  personId: string,
): PersonContact | undefined {
  return CONTACTS[householdId]?.people[personId];
}

export function orderedPeople(household: Household) {
  return [...household.people].sort(
    (a, b) =>
      CONTACT_ROLE_ORDER.indexOf(a.role) - CONTACT_ROLE_ORDER.indexOf(b.role),
  );
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function contactMethods(
  person: Person,
  contact: PersonContact | undefined,
): ContactMethod[] {
  const methods: ContactMethod[] = [];
  if (person.phone) {
    methods.push({
      kind: "phone",
      label: "Mobile",
      value: person.phone,
      href: phoneHref(person.phone),
    });
  }
  if (contact?.homePhone) {
    methods.push({
      kind: "phone",
      label: "Home",
      value: contact.homePhone,
      href: phoneHref(contact.homePhone),
    });
  }
  if (contact?.workPhone) {
    methods.push({
      kind: "phone",
      label: "Work",
      value: contact.workPhone,
      href: phoneHref(contact.workPhone),
    });
  }
  const emails = [
    person.email
      ? { type: contact?.emailType ?? "Home", address: person.email }
      : null,
    contact?.secondaryEmail ?? null,
  ]
    .filter((email) => email !== null)
    .sort((a, b) => (a.type === b.type ? 0 : a.type === "Home" ? -1 : 1));
  for (const email of emails) {
    methods.push({
      kind: "email",
      label: email.type,
      value: email.address,
      href: `mailto:${email.address}`,
    });
  }
  return methods;
}

export function contactStatus(household: Household, person: Person) {
  if (person.role === "Deceased") return "Deceased";
  if (household.type === "Client") return "Active client";
  return household.type;
}

export function tenureLabel(iso: string) {
  const years = ageFrom(iso);
  if (years >= 1) return `over ${years} ${years === 1 ? "year" : "years"}`;
  const days = Math.max(0, daysBetween(iso, TODAY));
  const months = Math.floor(days / 30.44);
  if (months >= 1) return `${months} ${months === 1 ? "month" : "months"}`;
  if (days === 0) return "today";
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function formatLocalTime(timestamp: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(timestamp));
}
