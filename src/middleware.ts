import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGUAGES = ['en', 'fil'];
const DEFAULT_LANGUAGE = 'en';
const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const [, maybeLocale] = pathname.split('/');
  const hasLanguagePrefix = SUPPORTED_LANGUAGES.includes(maybeLocale);

  if (hasLanguagePrefix) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}`, request.url));
  }

  return NextResponse.redirect(new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next|api).*)'],
};
