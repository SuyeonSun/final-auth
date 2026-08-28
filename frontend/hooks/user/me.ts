import type { UserDto } from "@/features/auth/auth.types";
import { ApiError, isApiError } from "@/lib/api/ApiError";
import { browserApi } from "@/lib/api/browserApi";
import type { ApiResponse } from "@/types/api";

export async function getMe() {
  try {
    const response = await browserApi.get("/api/users/me");
    const result = await response.json<ApiResponse<UserDto | null>>();

    if (!response.ok || !result.data) {
      throw new ApiError({
        status: response.status,
        code: result.code,
        message: result.message,
        data: result.data,
      });
    }

    return result.data;
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
