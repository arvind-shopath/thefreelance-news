import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_SESSION_VALUE = 'authenticated_arvind_9723338321';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  // Subdomain routing for socialcraft.thefreelance.in and socialcraft.localhost
  if (host.startsWith('socialcraft.')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/socialcraft', request.url));
    }
    if (pathname.startsWith('/socialcraft')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 301 Permanent Redirect from thefreelance.in/socialcraft to socialcraft.thefreelance.in (only on live domain, allow /socialcraft on localhost)
  if (!isLocal && !host.startsWith('socialcraft.') && pathname.startsWith('/socialcraft')) {
    return NextResponse.redirect('https://socialcraft.thefreelance.in/', 301);
  }

  const sessionCookie = request.cookies.get('tfl_admin_session')?.value;
  const isAuthenticated = sessionCookie === VALID_SESSION_VALUE;

  // Protect all /tfl/* dashboard and admin routes
  if (pathname.startsWith('/tfl')) {
    if (!isAuthenticated) {
      // Unauthorized: strictly redirect to Home immediately at the HTTP edge
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // If already authenticated and accessing the secret login page /arvind, redirect to dashboard
  if (pathname === '/arvind') {
    if (isAuthenticated) {
      const dashboardUrl = new URL('/tfl/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/socialcraft', '/socialcraft/:path*', '/tfl/:path*', '/arvind'],
};
