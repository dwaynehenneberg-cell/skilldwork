"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  LOCALE_CHANGE_EVENT,
  readStoredLocale,
  writeStoredLocale,
  type Locale,
} from "./locale";

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener(LOCALE_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(LOCALE_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getLocaleSnapshot(): Locale {
  return readStoredLocale() ?? "en";
}

function getServerLocaleSnapshot(): Locale {
  return "en";
}

/** One locale store for marketing site + FörderKlar demo — shared key, no drift. */
export function useLocaleStore() {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    writeStoredLocale(next);
  }, []);

  return { locale, setLocale };
}
