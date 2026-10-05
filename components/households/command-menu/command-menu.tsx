"use client";

import { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Kbd,
} from "@/components/_ui/command";
import { CommandHouseholdRow, CommandTableHeader } from "./command-table";
import { useHouseholdsStore } from "@/stores/households-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

export default function CommandMenu() {
  const open = useHouseholdsStore((state) => state.searchOpen);
  const setOpen = useHouseholdsStore((state) => state.setSearchOpen);
  const households = useHouseholdsStore((state) => state.households);
  const openDetail = useHouseholdsStore((state) => state.openDetail);
  const openNewHousehold = useHouseholdsStore(
    (state) => state.openNewHousehold,
  );
  const openNewRequest = useHouseholdsStore((state) => state.openNewRequest);
  const [query, setQuery] = useState("");
  const actionRan = useRef(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return;
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return;
      }
      event.preventDefault();
      const { searchOpen, setSearchOpen } = useHouseholdsStore.getState();
      setSearchOpen(!searchOpen);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function run(action: () => void) {
    actionRan.current = true;
    setOpen(false);
    action();
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Search households by name, member, advisor, tier or tag"
      className="max-w-[960px]"
      onCloseAutoFocus={(event) => {
        if (actionRan.current) event.preventDefault();
        actionRan.current = false;
        setQuery("");
      }}
    >
      <Command>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search households, members, advisors, tags…"
          trailing={<Kbd>Esc</Kbd>}
        />
        <CommandTableHeader />
        <CommandList>
          <CommandEmpty>No results for “{query}”</CommandEmpty>
          <CommandGroup>
            {households.map((household) => (
              <CommandHouseholdRow
                key={household.id}
                household={household}
                onSelect={() => run(() => openDetail(household.id))}
              />
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            {(["Client", "Prospect"] as const).map((type) => (
              <CommandItem
                key={type}
                value={`new-${type.toLowerCase()}`}
                keywords={[`New ${type}`, "New household", "Add", "Create"]}
                onSelect={() => run(() => openNewHousehold(type))}
              >
                <span className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-md shadow-[0px_0px_0px_1px_#232323]">
                  <PlusIcon aria-hidden className="text-soft size-3" />
                </span>
                New {type.toLowerCase()}
              </CommandItem>
            ))}
            <CommandItem
              value="new-service-request"
              keywords={[
                "New service request",
                "Account opening",
                "ACAT",
                "Rollover",
                "Wire",
                "Beneficiary",
              ]}
              onSelect={() => run(() => openNewRequest())}
            >
              <span className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-md shadow-[0px_0px_0px_1px_#232323]">
                <PlusIcon aria-hidden className="text-soft size-3" />
              </span>
              New service request
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFooter>
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            Open
          </span>
        </CommandFooter>
      </Command>
    </CommandDialog>
  );
}
