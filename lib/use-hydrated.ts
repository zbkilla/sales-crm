"use client";

import { useSyncExternalStore } from "react";
import { useHouseholdsStore } from "@/stores/households-store";

function subscribe(onChange: () => void) {
  return useHouseholdsStore.persist.onFinishHydration(onChange);
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => useHouseholdsStore.persist.hasHydrated(),
    () => false,
  );
}
