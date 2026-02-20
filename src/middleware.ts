import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGUAGES = ['en', 'fil'];
const DEFAULT_LANGUAGE = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already starts with a language code
  const hasLanguagePrefix = SUPPORTED_LANGUAGES.some((lang) => pathname.startsWith(`/${lang}`));

  if (hasLanguagePrefix) {
    // Language prefix already exists, proceed normally
    return NextResponse.next();
  }

  // If root path, redirect to default language
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}`, request.url));
  }

  // For any other path without language prefix, prepend the default language
  return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
