"use client";

import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import DetailSection from "../detail/detail-section";
import ProfileHousehold from "./profile-household";
import { CURRENT_USER, profileByName } from "@/data/households";
import {
  ALL_ADVISORS,
  formatCompactMoney,
  householdAum,
  reviewStatus,
  weightedPipeline,
} from "@/lib/households";
import { useHouseholdsStore } from "@/stores/households-store";
import UsersIcon from "@/public/assets/images/households/sidebar/users.svg";
import XIcon from "@/public/assets/images/households/detail/x.svg";
import MailIcon from "@/public/assets/images/households/detail/mail-04.svg";
import PhoneIcon from "@/public/assets/images/households/detail/phone.svg";

export default function Profile() {
  const profileName = useHouseholdsStore((state) => state.profileName);
  const profileOpen = useHouseholdsStore((state) => state.profileOpen);
  const households = useHouseholdsStore((state) => state.households);
  const closeProfile = useHouseholdsStore((state) => state.closeProfile);
  const openDetail = useHouseholdsStore((state) => state.openDetail);
  const setAdvisor = useHouseholdsStore((state) => state.setAdvisor);
  const setActiveTab = useHouseholdsStore((state) => state.setActiveTab);

  const person = profileName ? profileByName(profileName) : null;
  const isCurrentUser = person?.name === CURRENT_USER.name;
  const book = person
    ? households
        .filter(
          (household) =>
            household.type !== "Past client" &&
            (isCurrentUser || household.advisor === person.name),
        )
        .sort((a, b) => householdAum(b) - householdAum(a))
    : [];

  const aum = book.reduce((sum, household) => sum + householdAum(household), 0);
  const pipeline = book.reduce(
    (sum, household) => sum + weightedPipeline(household),
    0,
  );
  const overdue = book.filter(
    (household) => reviewStatus(household) === "overdue",
  ).length;

  const stats = [
    { label: "Households", value: String(book.length) },
    { label: "AUM", value: formatCompactMoney(aum) },
    { label: "Reviews overdue", value: String(overdue) },
    { label: "Weighted pipeline", value: formatCompactMoney(pipeline) },
  ];

  function showHouseholds() {
    setAdvisor(isCurrentUser || !person ? ALL_ADVISORS : person.name);
    setActiveTab("clients");
    closeProfile();
  }

  return (
    <Sheet
      open={profileOpen && person !== null}
      onOpenChange={(open) => !open && closeProfile()}
    >
      <SheetContent side="right" className="sm:w-[480px] sm:max-w-[480px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <UsersIcon aria-hidden className="text-icon size-3.5" />
            <SheetTitle>{isCurrentUser ? "My Profile" : "Advisor Profile"}</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Contact details, book summary and assigned households
          </SheetDescription>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="-mr-1"
              aria-label="Close profile"
            >
              <XIcon aria-hidden className="text-foreground size-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {person && (
          <ScrollArea className="min-h-0 flex-1">
            <div className="flex items-center gap-3 p-5 shadow-[inset_0_-1px_0_var(--line-strong)]">
              <Avatar
                src={person.avatar}
                alt=""
                className="size-[50px] shadow-[0px_6.25px_6.25px_0px_rgba(15,15,15,0.24),0px_0px_0px_1.563px_#232323]"
              />
              <div className="flex min-w-0 flex-col gap-2">
                <h2 className="truncate">{person.name}</h2>
                <span className="caption-style text-soft block truncate">
                  {person.role}
                </span>
              </div>
            </div>

            <DetailSection title="Contact">
              <div className="lead-style flex flex-wrap items-center gap-x-4 gap-y-3">
                <a
                  href={`mailto:${person.email}`}
                  className="hover:text-soft ease-power3-in-out flex items-center gap-1 transition-colors duration-150"
                >
                  <MailIcon aria-hidden className="text-soft size-3" />
                  {person.email}
                </a>
                <a
                  href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-soft ease-power3-in-out flex items-center gap-1 transition-colors duration-150"
                >
                  <PhoneIcon aria-hidden className="text-soft size-3" />
                  {person.phone}
                </a>
              </div>
            </DetailSection>

            <DetailSection title={isCurrentUser ? "Firm book" : "Book"}>
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-line-strong flex flex-col gap-3 rounded-lg border p-[11px]"
                  >
                    <span className="caption-style text-soft block">
                      {stat.label}
                    </span>
                    <span className="lead-style block tabular-nums">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              title={isCurrentUser ? "All households" : "Households"}
              className="shadow-none"
            >
              {book.length > 0 ? (
                <ul className="-mx-2 flex flex-col gap-0.5">
                  {book.map((household) => (
                    <ProfileHousehold
                      key={household.id}
                      household={household}
                      onOpen={() => openDetail(household.id)}
                    />
                  ))}
                </ul>
              ) : (
                <span className="caption-style text-subtle block">
                  No households assigned yet.
                </span>
              )}
            </DetailSection>
          </ScrollArea>
        )}

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="subtle" size="sm">
              Close
            </Button>
          </SheetClose>
          <Button
            variant="primary"
            size="sm"
            onClick={showHouseholds}
            disabled={book.length === 0}
          >
            {isCurrentUser ? "Show all households" : "Filter table by advisor"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
