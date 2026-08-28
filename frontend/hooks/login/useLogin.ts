import { useMutation } from "@tanstack/react-query";

import type { UserDto } from "@/features/auth/auth.types";
import type { LoginRequest } from "@/features/auth/login/login.schema";
import type { ApiError } from "@/lib/api/ApiError";

import { login } from "./login";

export function useLoginMutation() {
  return useMutation<UserDto, ApiError, LoginRequest>({
    mutationKey: useLoginMutation.getKey(),
    mutationFn: login,
  });
}

useLoginMutation.getKey = () => ["auth", "login"] as const;
