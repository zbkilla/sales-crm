"use client";

import {
  Fragment,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import { Tabs, TabsList, TabsTrigger } from "@/components/_ui/tabs";
import ProfileSection from "./profile-section";
import type { Household, Person } from "@/data/households";
import {
  contactMethods,
  contactStatus,
  formatLocalTime,
  householdContact,
  orderedPeople,
  personContact,
  tenureLabel,
} from "@/lib/contacts";
import { ageFrom, formatDate } from "@/lib/households";
import { cn } from "@/lib/utils";
import BuildingIcon from "@/public/assets/images/households/detail/building.svg";
import ClockIcon from "@/public/assets/images/households/detail/clock.svg";
import MailIcon from "@/public/assets/images/households/detail/mail-04.svg";
import PhoneIcon from "@/public/assets/images/households/detail/phone.svg";

type ContactCardsProps = {
  household: Household;
  onOpenAdvisor: (name: string) => void;
};

type DetailRow = {
  label: string;
  value: ReactNode;
};

function subscribeToClock(callback: () => void) {
  const id = window.setInterval(callback, 15000);
  return () => window.clearInterval(id);
}

function currentMinute() {
  return Math.floor(Date.now() / 60000);
}

function serverMinute() {
  return null;
}

function LocalTime({ timeZone }: { timeZone: string }) {
  const minute = useSyncExternalStore(
    subscribeToClock,
    currentMinute,
    serverMinute,
  );
  return (
    <span className="tabular-nums">
      {minute === null ? "—" : formatLocalTime(minute * 60000, timeZone)}
    </span>
  );
}

function Empty() {
  return <span className="text-subtle">—</span>;
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <dt className="flex items-center gap-2.5">
        {icon}
        <span className="font-medium">{label}</span>
      </dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </>
  );
}

export default function ContactCards({
  household,
  onOpenAdvisor,
}: ContactCardsProps) {
  const people = orderedPeople(household);
  const [selectedId, setSelectedId] = useState(people[0]?.id ?? "");
  const person =
    people.find((item) => item.id === selectedId) ?? (people[0] as Person);
  const record = householdContact(household.id);
  const contact = personContact(household.id, person.id);
  const methods = contactMethods(person, contact);
  const work = [person.jobTitle, person.employer].filter(Boolean).join(", ");

  function advisorValue(name: string | undefined) {
    if (!name) return <Empty />;
    return (
      <Button
        variant="link"
        size="none"
        onClick={() => onOpenAdvisor(name)}
        className="font-normal"
      >
        {name}
      </Button>
    );
  }

  const groups: DetailRow[][] = [
    [
      {
        label: "ID",
        value: contact ? (
          <span className="tabular-nums">{contact.contactId}</span>
        ) : (
          <Empty />
        ),
      },
      { label: "Status", value: contactStatus(household, person) },
      {
        label: "Category",
        value: household.tier ? `Tier ${household.tier}` : <Empty />,
      },
      { label: "Source", value: record?.source ?? <Empty /> },
      { label: "Referred by", value: record?.referredBy ?? <Empty /> },
    ],
    [
      {
        label: "Date of birth",
        value: person.dateOfBirth ? (
          <span className="tabular-nums">
            {formatDate(person.dateOfBirth)}
            {person.role !== "Deceased" &&
              ` (${ageFrom(person.dateOfBirth)} years)`}
          </span>
        ) : (
          <Empty />
        ),
      },
      {
        label: "Tax ID number",
        value: person.ssnLast4 ? (
          <span className="tabular-nums">•••-••-{person.ssnLast4}</span>
        ) : (
          <Empty />
        ),
      },
      { label: "Gender", value: contact?.gender ?? <Empty /> },
      { label: "Marital status", value: person.maritalStatus ?? <Empty /> },
      { label: "Occupation", value: work || <Empty /> },
      { label: "Servicing advisor", value: advisorValue(household.advisor) },
      { label: "Writing advisor", value: advisorValue(record?.writingAdvisor) },
      {
        label: "Associate advisor",
        value: advisorValue(record?.associateAdvisor),
      },
      { label: "CSA", value: advisorValue(record?.csa) },
    ],
    [
      {
        label: "Client since",
        value: household.clientSince ? (
          <span className="tabular-nums">
            {formatDate(household.clientSince)} (
            {tenureLabel(household.clientSince)})
          </span>
        ) : (
          <Empty />
        ),
      },
      {
        label: "Contact created",
        value: record ? (
          <span className="tabular-nums">
            {formatDate(record.createdOn)} ({tenureLabel(record.createdOn)})
          </span>
        ) : (
          <Empty />
        ),
      },
      { label: "Added by", value: record?.addedBy ?? <Empty /> },
    ],
  ];

  return (
    <>
      <ProfileSection title="Contact card">
        {people.length > 1 && (
          <Tabs value={person.id} onValueChange={setSelectedId}>
            <TabsList
              aria-label="Household members"
              className="border-line-strong -mt-2 flex-wrap gap-x-4 gap-y-0 border-b"
            >
              {people.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="py-2.5">
                  <span className="whitespace-nowrap">{item.firstName}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
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
        <dl className="grid grid-cols-[minmax(7.5em,auto)_minmax(0,1fr)] gap-x-4 gap-y-3 text-[14px] leading-[1.35]">
          {record && person.role !== "Deceased" && (
            <ContactRow
              icon={<ClockIcon aria-hidden className="text-soft size-3.5" />}
              label="Local time"
            >
              <LocalTime timeZone={record.timeZone} />
            </ContactRow>
          )}
          {methods.map((method) => (
            <ContactRow
              key={`${method.kind}-${method.label}-${method.value}`}
              icon={
                method.kind === "phone" ? (
                  <PhoneIcon aria-hidden className="text-soft size-3.5" />
                ) : (
                  <MailIcon aria-hidden className="text-soft size-3.5" />
                )
              }
              label={method.label}
            >
              <a
                href={method.href}
                className="hover:text-soft ease-power3-in-out tabular-nums transition-colors duration-150"
              >
                {method.value}
              </a>
            </ContactRow>
          ))}
          {record && person.role !== "Deceased" && (
            <ContactRow
              icon={<BuildingIcon aria-hidden className="text-soft size-3.5" />}
              label="Home"
            >
              <address className="flex flex-col not-italic">
                <span>{record.address.street}</span>
                <span>
                  {record.address.city}, {record.address.state}{" "}
                  {record.address.zip}
                </span>
              </address>
            </ContactRow>
          )}
        </dl>
        {methods.length === 0 && (
          <p className="caption-style text-subtle">
            No phone or email on file for {person.firstName}.
          </p>
        )}
        {household.importantInfo && (
          <p className="border-line-strong text-soft rounded-lg border bg-white/3 px-3 py-2">
            {household.importantInfo}
          </p>
        )}
      </ProfileSection>

      <ProfileSection title={`Contact details · ${person.firstName}`}>
        <dl className="grid grid-cols-[minmax(9em,auto)_minmax(0,1fr)] text-[14px] leading-[1.35]">
          {groups.flatMap((rows, index) =>
            rows.map((row, rowIndex) => {
              const divided = index > 0 && rowIndex === 0;
              return (
                <Fragment key={row.label}>
                  <dt
                    className={cn(
                      "caption-style text-soft flex items-center py-1.5 pr-4 tracking-[0.04em] uppercase",
                      divided && "border-line-strong mt-2.5 border-t pt-4",
                    )}
                  >
                    {row.label}
                  </dt>
                  <dd
                    className={cn(
                      "min-w-0 py-1.5 break-words",
                      divided && "border-line-strong mt-2.5 border-t pt-4",
                    )}
                  >
                    {row.value}
                  </dd>
                </Fragment>
              );
            }),
          )}
        </dl>
      </ProfileSection>
    </>
  );
}
