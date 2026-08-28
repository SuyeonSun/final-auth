import "server-only";

export const AUTH_COOKIE = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

export const AUTH_COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
} as const;
