import type { LoginData } from "@/features/auth/auth.types";
import type { LoginRequest } from "@/features/auth/login/login.schema";
import { ApiError, isApiError } from "@/lib/api/ApiError";
import { browserApi } from "@/lib/api/browserApi";
import type { ApiResponse } from "@/types/api";

export async function login(payload: LoginRequest) {
  try {
    const response = await browserApi.post("/api/auth/login", {
      json: payload,
    });
    const result = await response.json<ApiResponse<LoginData | null>>();

    if (!response.ok || !result.data) {
      throw new ApiError({
        status: response.status,
        code: result.code,
        message: result.message,
        data: result.data,
      });
    }

    return result.data.user;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    throw new ApiError({
      status: 0,
      code: "API_NETWORK_ERROR",
      message: "서버에 연결할 수 없습니다.",
      data: null,
      cause: error,
    });
  }
}
