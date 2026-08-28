import { useQuery } from "@tanstack/react-query";

import type { UserDto } from "@/features/auth/auth.types";
import type { ApiError } from "@/lib/api/ApiError";

import { getMe } from "./me";

export function useMeQuery() {
  return useQuery<UserDto, ApiError>({
    queryKey: useMeQuery.getKey(),
    queryFn: getMe,
    retry: false,
  });
}

useMeQuery.getKey = () => ["auth", "me"] as const;
