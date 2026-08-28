import "server-only";

import type { NextResponse } from "next/server";

import type { AccessTokenData, TokenPair } from "@/features/auth/auth.types";

export const AUTH_COOKIE = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

export const AUTH_COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
} as const;

function parseExpiresAt(expiresAt: string) {
  const expires = new Date(expiresAt);

  if (Number.isNaN(expires.getTime())) {
    throw new Error("백엔드 토큰 만료 시간이 올바르지 않습니다.");
  }

  return expires;
}

export function setAccessTokenCookie(
  response: NextResponse,
  token: AccessTokenData,
) {
  response.cookies.set(AUTH_COOKIE.accessToken, token.accessToken, {
    ...AUTH_COOKIE_BASE_OPTIONS,
    expires: parseExpiresAt(token.accessTokenExpiresAt),
    path: "/",
  });
}

export function setAuthCookies(response: NextResponse, tokens: TokenPair) {
  setAccessTokenCookie(response, tokens);
  response.cookies.set(AUTH_COOKIE.refreshToken, tokens.refreshToken, {
    ...AUTH_COOKIE_BASE_OPTIONS,
    expires: parseExpiresAt(tokens.refreshTokenExpiresAt),
    path: "/api/auth",
  });
}

export function clearAuthCookies(response: NextResponse) {
  const expiredOptions = {
    ...AUTH_COOKIE_BASE_OPTIONS,
    expires: new Date(0),
    maxAge: 0,
  } as const;

  response.cookies.set(AUTH_COOKIE.accessToken, "", {
    ...expiredOptions,
    path: "/",
  });
  response.cookies.set(AUTH_COOKIE.refreshToken, "", {
    ...expiredOptions,
    path: "/api/auth",
  });
}
