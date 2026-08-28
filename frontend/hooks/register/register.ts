import type { RegisterData } from "@/features/auth/auth.types";
import type { RegisterRequest } from "@/features/auth/register/register.schema";
import { ApiError, isApiError } from "@/lib/api/ApiError";
import { browserApi } from "@/lib/api/browserApi";
import type { ApiResponse } from "@/types/api";

export async function registerUser(payload: RegisterRequest) {
  try {
    const response = await browserApi.post("/api/auth/register", {
      json: payload,
    });
    const result = await response.json<ApiResponse<RegisterData | null>>();

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
