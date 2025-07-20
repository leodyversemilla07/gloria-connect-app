import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only protect /protected routes
  if (!request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.next();
  }

  // Check for Appwrite session cookie
  const session = request.cookies.get('a_session');
  if (!session) {
    // Not authenticated, redirect to home/login
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*'],
};
