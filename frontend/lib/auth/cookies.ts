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

export function setAccessTokenCookie(
  response: NextResponse,
  token: AccessTokenData,
) {
  // expires를 access token 자체의 만료 시각에 맞추면, 만료되는 순간 브라우저가
  // 쿠키를 스스로 지워버려서 백엔드가 만료된 토큰을 받아볼 기회조차 없어진다.
  // refresh_token이 살아있는 한 계속 실려 보내지도록 세션 쿠키로 둔다.
  response.cookies.set(AUTH_COOKIE.accessToken, token.accessToken, {
    ...AUTH_COOKIE_BASE_OPTIONS,
    path: "/",
  });
}

export function setAuthCookies(response: NextResponse, tokens: TokenPair) {
  setAccessTokenCookie(response, tokens);
  // access_token과 같은 이유로 refresh_token도 세션 쿠키로 둔다 — expires를 RT
  // 자체 만료시각에 맞추면 만료되는 순간 브라우저가 지워버려서, 백엔드가 만료된
  // RT를 받아보고 AUTH_REFRESH_TOKEN_EXPIRED로 구분해줄 기회조차 사라진다.
  response.cookies.set(AUTH_COOKIE.refreshToken, tokens.refreshToken, {
    ...AUTH_COOKIE_BASE_OPTIONS,
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
