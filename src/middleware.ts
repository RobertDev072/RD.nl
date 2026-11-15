import { NextResponse, type NextRequest } from 'next/server';

// HTTP Basic Auth for the private admin area. Password in env ADMIN_PASSWORD (user "robert").
export function middleware(req: NextRequest) {
  const pass = process.env.ADMIN_PASSWORD;
  const header = req.headers.get('authorization') || '';
  if (pass && header.startsWith('Basic ')) {
    const [user, pwd] = atob(header.slice(6)).split(':');
    if (user === 'robert' && pwd === pass) {
      const res = NextResponse.next();
      res.headers.set('X-Robots-Tag', 'noindex, nofollow');
      res.headers.set('Cache-Control', 'no-store');
      return res;
    }
  }
  return new NextResponse('Inloggen vereist', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Lorvex admin"' } });
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
