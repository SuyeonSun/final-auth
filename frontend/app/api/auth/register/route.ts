import { NextResponse } from "next/server";

import type { RegisterData } from "@/features/auth/auth.types";
import { registerRequestSchema } from "@/features/auth/register/register.schema";
import { getBackendApi } from "@/lib/api/backendApi";
import type { ApiResponse } from "@/types/api";

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = registerRequestSchema.safeParse(payload);

  if (!parsed.success) {
    const body: ApiResponse<null> = {
      code: "AUTH_VALIDATION_FAILED",
      message: "입력값을 확인해 주세요.",
      data: null,
    };

    return NextResponse.json(body, { status: 400 });
  }

  try {
    const backendResponse = await getBackendApi().post("api/auth/register", {
      json: parsed.data,
    });
    const result = await backendResponse.json<
      ApiResponse<RegisterData | null>
    >();

    return NextResponse.json(result, { status: backendResponse.status });
  } catch {
    const body: ApiResponse<null> = {
      code: "AUTH_BACKEND_UNAVAILABLE",
      message: "인증 서버에 연결할 수 없습니다.",
      data: null,
    };

    return NextResponse.json(body, { status: 502 });
  }
}
