import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/mypage', '/cart', '/checkout'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !req.cookies.get('is_authenticated')) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage/:path*', '/cart', '/checkout/:path*'],
};
