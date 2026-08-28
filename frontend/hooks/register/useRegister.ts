import { useMutation } from "@tanstack/react-query";

import type { UserDto } from "@/features/auth/auth.types";
import type { RegisterRequest } from "@/features/auth/register/register.schema";
import type { ApiError } from "@/lib/api/ApiError";

import { registerUser } from "./register";

export function useRegisterMutation() {
  return useMutation<UserDto, ApiError, RegisterRequest>({
    mutationKey: useRegisterMutation.getKey(),
    mutationFn: registerUser,
  });
}

useRegisterMutation.getKey = () => ["auth", "register"] as const;
