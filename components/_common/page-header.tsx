"use client";

import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/_ui/tabs";
import Notifications from "./notifications/notifications";
import { CURRENT_USER } from "@/data/households";
import { useHouseholdsStore } from "@/stores/households-store";
import MenuIcon from "@/public/assets/images/_common/menu.svg";
import ActiveDot from "@/public/assets/images/households/header/active-dot.svg";
import SearchIcon from "@/public/assets/images/_common/search.svg";

export type PageTab = {
  value: string;
  label: string;
  count?: number;
};

type PageHeaderProps = {
  title: string;
  tabs: PageTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
};

export default function PageHeader({
  title,
  tabs,
  activeTab,
  onTabChange,
}: PageHeaderProps) {
  const setSidebarOpen = useHouseholdsStore((state) => state.setSidebarOpen);
  const setSearchOpen = useHouseholdsStore((state) => state.setSearchOpen);
  const openProfile = useHouseholdsStore((state) => state.openProfile);

  return (
    <header className="shrink-0">
      <div className="flex items-center justify-between gap-2 px-4 py-[14px]">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon aria-hidden className="size-3.5" />
          </Button>
          <h1 className="truncate">{title}</h1>
          <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
            <ActiveDot aria-hidden className="size-3" />
            Active
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Search"
            aria-keyshortcuts="Meta+K Control+K"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon aria-hidden className="size-3.5" />
          </Button>
          <Notifications />
          <Button
            variant="secondary"
            size="none"
            className="caption-style h-[30px] gap-1.5 py-[5px] pr-[7px] pl-[5px] font-normal"
            aria-label={`Open profile for ${CURRENT_USER.name}`}
            onClick={() => openProfile(CURRENT_USER.name)}
          >
            <Avatar src={CURRENT_USER.avatar} alt="" />
            <span className="hidden sm:inline">{CURRENT_USER.name}</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="border-border border-b px-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && <CountBadge>{tab.count}</CountBadge>}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  );
}
