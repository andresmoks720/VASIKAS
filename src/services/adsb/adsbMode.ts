import { useSyncExternalStore } from "react";

import { ENV } from "@/shared/env";

const STORAGE_KEY = "adsb:useLive";

function readStoredPreference(): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      return null;
    }

    return stored === "true";
  } catch {
    return null;
  }
}

function persistPreference(value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Ignore storage write failures in restricted environments.
  }
}

const isMocksEnabled = ENV.useMocks;
let currentUseLiveAdsb = readStoredPreference() ?? !isMocksEnabled();
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getUseLiveAdsb() {
  return currentUseLiveAdsb;
}

export function setUseLiveAdsb(nextValue: boolean) {
  if (currentUseLiveAdsb === nextValue) {
    return;
  }

  currentUseLiveAdsb = nextValue;
  persistPreference(nextValue);
  emitChange();
}

export function toggleUseLiveAdsb() {
  setUseLiveAdsb(!currentUseLiveAdsb);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAdsbMode() {
  const useLiveAdsb = useSyncExternalStore(subscribe, getUseLiveAdsb, getUseLiveAdsb);

  return {
    useLiveAdsb,
    setUseLiveAdsb,
    toggleUseLiveAdsb,
  };
}
