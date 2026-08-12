import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isLocale,
  localeCookieSetOptions,
  LOCALE_HINT_HEADER,
  LOCALE_STORAGE_KEY,
  resolveLocale,
} from "./lib/locale";

export function proxy(request: NextRequest) {
  const locale = resolveLocale(
    request.cookies.get(LOCALE_STORAGE_KEY)?.value,
    request.headers.get("x-vercel-ip-country"),
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HINT_HEADER, locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!isLocale(request.cookies.get(LOCALE_STORAGE_KEY)?.value)) {
    response.cookies.set(
      LOCALE_STORAGE_KEY,
      locale,
      localeCookieSetOptions(),
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
