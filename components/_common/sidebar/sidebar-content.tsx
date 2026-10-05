"use client";

import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import { usePathname } from "next/navigation";
import { reviewStatus } from "@/lib/households";
import { useHouseholdsStore } from "@/stores/households-store";
import Logo from "@/public/assets/images/_common/logo.svg";
import BuildingIcon from "@/public/assets/images/households/sidebar/building.svg";
import CalendarCheckIcon from "@/public/assets/images/households/detail/calendar.svg";
import ClipboardIcon from "@/public/assets/images/households/sidebar/clipboard.svg";
import BarChartIcon from "@/public/assets/images/households/sidebar/bar-chart.svg";
import ListIcon from "@/public/assets/images/households/sidebar/list.svg";
import BookClosedIcon from "@/public/assets/images/households/sidebar/book-closed.svg";
import MailIcon from "@/public/assets/images/households/sidebar/mail.svg";
import TargetIcon from "@/public/assets/images/households/sidebar/target-05.svg";
import TargetAltIcon from "@/public/assets/images/households/sidebar/target-03.svg";
import UsersIcon from "@/public/assets/images/households/sidebar/users.svg";
import BarChartAltIcon from "@/public/assets/images/households/sidebar/bar-chart-10.svg";
import AlertTriangleIcon from "@/public/assets/images/households/sidebar/alert-triangle.svg";
import DotYellow from "@/public/assets/images/households/sidebar/dot-yellow.svg";
import DotPink from "@/public/assets/images/households/sidebar/dot-pink.svg";
import DotPurple from "@/public/assets/images/households/sidebar/dot-purple.svg";
import UserPlusIcon from "@/public/assets/images/households/sidebar/user-plus.svg";
import MessageQuestionIcon from "@/public/assets/images/households/sidebar/message-question.svg";
import WalletIcon from "@/public/assets/images/households/sidebar/wallet.svg";

export default function SidebarContent() {
  const pathname = usePathname();
  const households = useHouseholdsStore((state) => state.households);
  const setSidebarOpen = useHouseholdsStore((state) => state.setSidebarOpen);
  const setReviewsTab = useHouseholdsStore((state) => state.setReviewsTab);
  const setReviewsFilter = useHouseholdsStore(
    (state) => state.setReviewsFilter,
  );
  const resetReviewsFilters = useHouseholdsStore(
    (state) => state.resetReviewsFilters,
  );
  const setPipelineTab = useHouseholdsStore((state) => state.setPipelineTab);

  function navigate(action?: () => void) {
    return () => {
      action?.();
      setSidebarOpen(false);
    };
  }
  const reviewsDue = households.filter(
    (household) => reviewStatus(household) === "overdue",
  ).length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center gap-2 border-b p-3">
        <Logo aria-hidden className="size-8 shrink-0 overflow-visible" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="lead-style block truncate font-medium tracking-[-0.01em]">
            RIA AgentOS
          </span>
          <span className="caption-style text-subtle block truncate">
            Household book
          </span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Primary">
          <SidebarSection className="border-sidebar-border border-b">
            <SidebarNavItem
              icon={BuildingIcon}
              label="Households"
              count={households.length}
              href="/"
              active={pathname === "/"}
              onClick={navigate()}
            />
            <SidebarNavItem
              icon={CalendarCheckIcon}
              label="Reviews"
              count={reviewsDue}
              href="/reviews"
              active={pathname === "/reviews"}
              onClick={navigate()}
            />
            <SidebarNavItem
              icon={ClipboardIcon}
              label="Opportunities"
              href="/opportunities"
              active={pathname === "/opportunities"}
              onClick={navigate()}
            />
            <SidebarNavItem icon={ListIcon} label="Projects" count={7} />
            <SidebarNavItem icon={BarChartIcon} label="Meetings" />
            <SidebarNavItem icon={TargetIcon} label="Tasks" count={12} />
            <SidebarNavItem icon={BookClosedIcon} label="Other contacts" />
            <SidebarNavItem icon={MailIcon} label="Sequences" />
          </SidebarSection>

          <SidebarSection
            title="Team"
            className="border-sidebar-border border-b"
          >
            <SidebarNavItem icon={TargetAltIcon} label="Lead advisors" />
            <SidebarNavItem icon={UsersIcon} label="Service team" />
            <SidebarNavItem icon={UsersIcon} label="Operations" />
          </SidebarSection>

          <SidebarSection
            title="Reports"
            className="border-sidebar-border border-b"
          >
            <SidebarNavItem
              icon={AlertTriangleIcon}
              label="Reviews overdue"
              href="/reviews"
              onClick={navigate(() => {
                resetReviewsFilters();
                setReviewsTab("upcoming");
                setReviewsFilter("status", "overdue");
              })}
            />
            <SidebarNavItem icon={BarChartAltIcon} label="Clients over $1M" />
            <SidebarNavItem icon={BarChartAltIcon} label="Upcoming birthdays" />
          </SidebarSection>

          <SidebarSection title="Pipelines">
            <SidebarNavItem
              icon={DotYellow}
              label="Prospect pipeline"
              href="/opportunities"
              onClick={navigate(() => setPipelineTab("prospect"))}
            />
            <SidebarNavItem
              icon={DotPink}
              label="Client growth"
              href="/opportunities"
              onClick={navigate(() => setPipelineTab("client"))}
            />
            <SidebarNavItem icon={DotPurple} label="Rollovers" />
          </SidebarSection>
        </nav>
      </ScrollArea>

      <SidebarSection className="border-sidebar-border shrink-0 border-t border-b">
        <SidebarNavItem
          icon={UserPlusIcon}
          label="Invite teammates"
          tone="quiet"
        />
        <SidebarNavItem icon={MessageQuestionIcon} label="Help" tone="quiet" />
      </SidebarSection>

      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center justify-between gap-2 border-b p-4">
        <div className="flex flex-col gap-2">
          <span className="lead-style block font-medium tracking-[-0.01em]">
            14 Days
          </span>
          <span className="caption-style text-subtle block">
            Left on trials
          </span>
        </div>
        <Button variant="muted" size="md">
          <WalletIcon aria-hidden className="size-3.5" />
          Add Billings
        </Button>
      </div>
    </div>
  );
}
