import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookie
  const sessionCookie = request.cookies.get('session');
  const session = sessionCookie ? await verifySessionToken(sessionCookie.value) : null;

  // Protect /dashboard routes - require player auth
  if (pathname.startsWith('/dashboard')) {
    if (!session || session.type !== 'player') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /gm routes (except /gm/login) - require GM auth
  if (pathname.startsWith('/gm') && pathname !== '/gm/login') {
    if (!session || session.type !== 'gm') {
      return NextResponse.redirect(new URL('/gm/login', request.url));
    }
  }

  // Redirect logged-in users away from login pages
  if (session) {
    if (pathname === '/login' && session.type === 'player') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname === '/gm/login' && session.type === 'gm') {
      return NextResponse.redirect(new URL('/gm/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/gm/:path*',
    '/login',
    '/gm/login',
  ],
};
