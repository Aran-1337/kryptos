import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECRET_PATH = process.env.ADMIN_SECRET_PATH || '/secret-gate';
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'mnasa2025';

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Secret Entry URL Gate (e.g. /secret-gate?key=mnasa2025)
  if (pathname === SECRET_PATH) {
    const key = searchParams.get('key');
    if (key === SECRET_KEY) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      // Set access unlocked cookie valid for 30 days
      response.cookies.set('admin_access_unlocked', '1', {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
        sameSite: 'strict',
      });
      return response;
    }
    // Invalid key on secret route -> Return 404
    return new NextResponse('Not Found', { status: 404 });
  }

  // 2. All /admin routes (including /admin/login)
  if (pathname.startsWith('/admin')) {
    const hasToken = !!request.cookies.get('admin_token')?.value;
    const isUnlocked = request.cookies.get('admin_access_unlocked')?.value === '1';

    // STEALTH SECURITY: If user is not logged in AND has not unlocked access via secret URL
    // Return 404 to disguise the admin panel completely
    if (!hasToken && !isUnlocked) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // If unlocked but accessing protected admin pages without token -> Redirect to login
    if (pathname !== '/admin/login' && pathname !== '/admin/accept-invite') {
      if (!hasToken) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/secret-gate'],
};
