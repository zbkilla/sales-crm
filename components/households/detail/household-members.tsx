import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import { advisorByName, type Household, type Person } from "@/data/households";
import { ageFrom } from "@/lib/households";
import MailIcon from "@/public/assets/images/households/detail/mail-04.svg";
import PhoneIcon from "@/public/assets/images/households/detail/phone.svg";

type HouseholdMembersProps = {
  household: Household;
  onOpenAdvisor: () => void;
};

const ROLE_ORDER = [
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

function personMeta(person: Person) {
  const work = [person.jobTitle, person.employer].filter(Boolean).join(", ");
  return [
    person.dateOfBirth && person.role !== "Deceased"
      ? `Age ${ageFrom(person.dateOfBirth)}`
      : null,
    person.maritalStatus,
    work || null,
    person.designations,
    person.ssnLast4 ? `SSN •••-••-${person.ssnLast4}` : null,
  ].filter(Boolean);
}

export default function HouseholdMembers({
  household,
  onOpenAdvisor,
}: HouseholdMembersProps) {
  const advisor = advisorByName(household.advisor);
  const people = [...household.people].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role),
  );

  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-line-strong flex flex-col divide-y">
        {people.map((person) => (
          <li
            key={person.id}
            className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">
                {person.firstName} {person.lastName}
              </span>
              <Tag
                tone={person.role === "Head of household" ? "blue" : "neutral"}
                size="sm"
              >
                {person.role}
              </Tag>
            </div>
            {personMeta(person).length > 0 && (
              <span className="caption-style text-subtle block">
                {personMeta(person).join(" · ")}
              </span>
            )}
            {(person.email || person.phone) && (
              <div className="caption-style flex flex-wrap items-center gap-x-4 gap-y-2">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="hover:text-soft ease-power3-in-out flex items-center gap-1 transition-colors duration-150"
                  >
                    <MailIcon aria-hidden className="text-soft size-3" />
                    {person.email}
                  </a>
                )}
                {person.phone && (
                  <a
                    href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}
                    className="hover:text-soft ease-power3-in-out flex items-center gap-1 transition-colors duration-150"
                  >
                    <PhoneIcon aria-hidden className="text-soft size-3" />
                    {person.phone}
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="caption-style flex items-center justify-between gap-2">
        <span className="text-soft">Lead advisor</span>
        <Button
          variant="ghost"
          size="none"
          onClick={onOpenAdvisor}
          aria-label={`Open ${advisor.name} profile`}
          className="text-foreground -mx-1.5 gap-1.5 px-1.5 py-1 font-medium"
        >
          <Avatar src={advisor.avatar} alt="" />
          {advisor.name}
        </Button>
      </div>

      {household.importantInfo && (
        <p className="border-line-strong text-soft rounded-lg border bg-white/3 px-3 py-2">
          {household.importantInfo}
        </p>
      )}
    </div>
  );
}
