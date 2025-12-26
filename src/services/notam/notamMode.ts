import { useSyncExternalStore } from "react";

import { ENV } from "@/shared/env";

const STORAGE_KEY = "notams:useLive";

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
let currentUseLiveNotams = readStoredPreference() ?? !isMocksEnabled();
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getUseLiveNotams() {
  return currentUseLiveNotams;
}

export function setUseLiveNotams(nextValue: boolean) {
  if (currentUseLiveNotams === nextValue) {
    return;
  }

  currentUseLiveNotams = nextValue;
  persistPreference(nextValue);
  emitChange();
}

export function toggleUseLiveNotams() {
  setUseLiveNotams(!currentUseLiveNotams);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNotamMode() {
  const useLiveNotams = useSyncExternalStore(subscribe, getUseLiveNotams, getUseLiveNotams);

  return {
    useLiveNotams,
    setUseLiveNotams,
    toggleUseLiveNotams,
  };
}
