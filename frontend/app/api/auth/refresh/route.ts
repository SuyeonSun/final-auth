import { type NextRequest, NextResponse } from "next/server";

import type { BackendRefreshData } from "@/features/auth/auth.types";
import { getBackendApi } from "@/lib/api/backendApi";
import {
  AUTH_COOKIE,
  clearAuthCookies,
  setAccessTokenCookie,
} from "@/lib/auth/cookies";
import type { ApiResponse } from "@/types/api";

type RefreshOutcome =
  | {
      ok: true;
      code: string;
      message: string;
      token: BackendRefreshData["token"];
    }
  | {
      ok: false;
      status: number;
      code: string;
      message: string;
      clearCookies: boolean;
    };

async function refreshAccessToken(request: NextRequest): Promise<RefreshOutcome> {
  const refreshToken = request.cookies.get(AUTH_COOKIE.refreshToken)?.value;

  try {
    const backendResponse = await getBackendApi().post("api/auth/refresh", {
      json: { refreshToken },
    });
    const result = await backendResponse.json<
      ApiResponse<BackendRefreshData | null>
    >();

    if (!backendResponse.ok || !result.data) {
      return {
        ok: false,
        status: backendResponse.status,
        code: result.code,
        message: result.message,
        // refreshToken이 비어 있으면 백엔드가 401이 아니라 400(AUTH_VALIDATION_FAILED)으로 응답한다.
        // RefreshRequest의 유일한 필드가 refreshToken이라 이 400은 곧 "세션 없음"과 동치이므로 함께 정리한다.
        clearCookies: backendResponse.status === 401 || backendResponse.status === 400,
      };
    }

    const accessTokenExpiresAt = new Date(
      result.data.token.accessTokenExpiresAt,
    );

    if (
      !result.data.token.accessToken ||
      Number.isNaN(accessTokenExpiresAt.getTime())
    ) {
      return {
        ok: false,
        status: 502,
        code: "AUTH_INVALID_BACKEND_RESPONSE",
        message: "인증 서버 응답이 올바르지 않습니다.",
        clearCookies: false,
      };
    }

    return {
      ok: true,
      code: result.code,
      message: result.message,
      token: result.data.token,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      code: "AUTH_BACKEND_UNAVAILABLE",
      message: "인증 서버에 연결할 수 없습니다.",
      clearCookies: false,
    };
  }
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return origin === request.nextUrl.origin;
}

function getSafeReturnTo(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? "/";

  if (
    !returnTo.startsWith("/") ||
    returnTo.startsWith("//") ||
    returnTo.includes("\\")
  ) {
    return "/";
  }

  return returnTo;
}

function setNoStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    const body: ApiResponse<null> = {
      code: "AUTH_ORIGIN_FORBIDDEN",
      message: "허용되지 않은 요청입니다.",
      data: null,
    };

    return setNoStore(NextResponse.json(body, { status: 403 }));
  }

  const outcome = await refreshAccessToken(request);

  if (!outcome.ok) {
    const body: ApiResponse<null> = {
      code: outcome.code,
      message: outcome.message,
      data: null,
    };
    const response = NextResponse.json(body, { status: outcome.status });

    if (outcome.clearCookies) {
      clearAuthCookies(response);
    }

    return setNoStore(response);
  }

  const body: ApiResponse<null> = {
    code: outcome.code,
    message: outcome.message,
    data: null,
  };
  const response = NextResponse.json(body);
  setAccessTokenCookie(response, outcome.token);

  return setNoStore(response);
}

export async function GET(request: NextRequest) {
  const returnTo = getSafeReturnTo(request);
  const outcome = await refreshAccessToken(request);

  if (!outcome.ok) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    if (outcome.clearCookies) {
      clearAuthCookies(response);
    }

    return setNoStore(response);
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url));
  setAccessTokenCookie(response, outcome.token);

  return setNoStore(response);
}
