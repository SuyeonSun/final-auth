import { type NextRequest, NextResponse } from "next/server";

import type { UserDto } from "@/features/auth/auth.types";
import { getBackendApi } from "@/lib/api/backendApi";
import { AUTH_COOKIE } from "@/lib/auth/cookies";
import type { ApiResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE.accessToken)?.value;

  try {
    const backendResponse = await getBackendApi().get("api/users/me", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    const result = await backendResponse.json<ApiResponse<UserDto | null>>();
    const response = NextResponse.json(result, {
      status: backendResponse.status,
    });
    response.headers.set("Cache-Control", "private, no-store");

    return response;
  } catch {
    const body: ApiResponse<null> = {
      code: "AUTH_BACKEND_UNAVAILABLE",
      message: "인증 서버에 연결할 수 없습니다.",
      data: null,
    };

    return NextResponse.json(body, { status: 502 });
  }
}
