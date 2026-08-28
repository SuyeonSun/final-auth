import { NextResponse, type NextRequest } from "next/server";

import { PUBLIC_ROUTES } from "@/constants/auth";
import { AUTH_COOKIE } from "@/lib/auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const hasAccessToken = Boolean(
    request.cookies.get(AUTH_COOKIE.accessToken)?.value,
  );

  if (isPublicRoute && hasAccessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicRoute && !hasAccessToken) {
    const refreshUrl = new URL("/api/auth/refresh", request.url);
    refreshUrl.searchParams.set("returnTo", `${pathname}${search}`);

    return NextResponse.redirect(refreshUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", `${pathname}${search}`);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
