export type Locale = "en" | "de";

export const LOCALE_STORAGE_KEY = "skilldwork-locale";
export const LOCALE_CHANGE_EVENT = "skilldwork-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "de";
}

export function readStoredLocale(): Locale | null {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function writeStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(LOCALE_CHANGE_EVENT, { detail: locale }),
    );
  }
}
