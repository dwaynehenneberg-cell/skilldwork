export type Locale = "en" | "de";

export const LOCALE_STORAGE_KEY = "skilldwork-locale";
export const LOCALE_CHANGE_EVENT = "skilldwork-locale";
export const LOCALE_HINT_HEADER = "x-skilldwork-locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "de";
}

/** Germany → de; every other / unknown country → en. */
export function localeFromCountry(country: string | null | undefined): Locale {
  return country?.toUpperCase() === "DE" ? "de" : "en";
}

export function resolveLocale(
  cookieValue: string | undefined,
  country: string | null | undefined,
): Locale {
  return isLocale(cookieValue) ? cookieValue : localeFromCountry(country);
}

export function localeCookieSetOptions() {
  return {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function readStoredLocale(): Locale | null {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_STORAGE_KEY}=([^;]*)`),
  );
  if (!match?.[1]) return null;
  try {
    const value = decodeURIComponent(match[1]);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function writeStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  writeLocaleCookie(locale);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(LOCALE_CHANGE_EVENT, { detail: locale }),
    );
  }
}

/** Persist whichever source already exists so geo detection cannot override a choice. */
export function syncLocalePersistence() {
  const stored = readStoredLocale();
  if (stored) {
    writeLocaleCookie(stored);
    return;
  }
  const fromCookie = readCookieLocale();
  if (!fromCookie) return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, fromCookie);
  } catch {
    /* ignore */
  }
}
