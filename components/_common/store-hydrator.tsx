"use client";

import { useEffect } from "react";
import { useHouseholdsStore } from "@/stores/households-store";

export default function StoreHydrator() {
  useEffect(() => {
    void useHouseholdsStore.persist.rehydrate();
  }, []);

  return null;
}
