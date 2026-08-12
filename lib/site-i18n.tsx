"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { siteDictionaries, type SiteDict } from "./site-dictionaries";
import { useLocaleStore } from "./use-locale-store";
import type { Locale } from "./locale";

type SiteI18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: SiteDict;
};

const SiteI18nContext = createContext<SiteI18nValue | null>(null);

export function SiteI18nProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useLocaleStore();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<SiteI18nValue>(
    () => ({
      locale,
      setLocale,
      t: siteDictionaries[locale],
    }),
    [locale, setLocale],
  );

  return (
    <SiteI18nContext.Provider value={value}>{children}</SiteI18nContext.Provider>
  );
}

export function useSiteI18n() {
  const ctx = useContext(SiteI18nContext);
  if (!ctx) throw new Error("useSiteI18n must be used within SiteI18nProvider");
  return ctx;
}
