"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import {
  LOCALE_CHANGE_EVENT,
  readCookieLocale,
  readStoredLocale,
  writeStoredLocale,
  type Locale,
} from "./locale";

export const ServerLocaleContext = createContext<Locale>("en");

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
  return readStoredLocale() ?? readCookieLocale() ?? "en";
}

/** One locale store for marketing site + FörderKlar demo — shared key, no drift. */
export function useLocaleStore() {
  const serverLocale = useContext(ServerLocaleContext);
  const getServerSnapshot = useCallback(() => serverLocale, [serverLocale]);
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    writeStoredLocale(next);
  }, []);

  return { locale, setLocale };
}
