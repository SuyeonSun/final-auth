import { NextResponse } from "next/server";

import type { BackendLoginData, LoginData } from "@/features/auth/auth.types";
import { loginSchema } from "@/features/auth/login/login.schema";
import { getBackendApi } from "@/lib/api/backendApi";
import { setAuthCookies } from "@/lib/auth/cookies";
import type {
  ApiResponse,
  ValidationErrorData,
} from "@/types/api";

function getFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return fieldErrors;
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    const body: ApiResponse<ValidationErrorData> = {
      code: "AUTH_VALIDATION_FAILED",
      message: "입력값을 확인해 주세요.",
      data: {
        fieldErrors: getFieldErrors(parsed.error.issues),
      },
    };

    return NextResponse.json(body, { status: 400 });
  }

  try {
    const backendResponse = await getBackendApi().post("api/auth/login", {
      json: parsed.data,
    });
    const result = await backendResponse.json<
      ApiResponse<BackendLoginData | null>
    >();

    if (!backendResponse.ok || !result.data) {
      return NextResponse.json(result, { status: backendResponse.status });
    }

    const body: ApiResponse<LoginData> = {
      code: result.code,
      message: result.message,
      data: {
        user: result.data.user,
      },
    };
    const response = NextResponse.json(body);
    setAuthCookies(response, result.data.tokens);

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
