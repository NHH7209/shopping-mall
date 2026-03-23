import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/mypage', '/cart', '/checkout'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = req.cookies.get('is_authenticated');
  const role = req.cookies.get('user_role')?.value;

  // 어드민이 일반 페이지 접근 시 → /admin으로 리다이렉트
  if (isAuthenticated && role === 'admin' && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // 비로그인 유저가 보호된 페이지 접근 시 → 로그인으로 리다이렉트
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage/:path*', '/cart', '/checkout/:path*', '/', '/products/:path*', '/products', '/auth/:path*'],
};
