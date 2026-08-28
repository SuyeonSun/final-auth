import { useQuery } from "@tanstack/react-query";

import type { UserDto } from "@/features/auth/auth.types";
import type { ApiError } from "@/lib/api/ApiError";

import { getMe } from "./me";

export function useMeQuery(enabled: boolean) {
  return useQuery<UserDto, ApiError>({
    queryKey: useMeQuery.getKey(),
    queryFn: getMe,
    enabled,
    retry: false,
  });
}

useMeQuery.getKey = () => ["auth", "me"] as const;
