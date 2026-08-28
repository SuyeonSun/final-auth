import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getBackendApi } from "@/lib/api/backendApi";
import { AUTH_COOKIE } from "@/lib/auth/cookies";
import type { ApiResponse } from "@/types/api";

async function buildRefreshUrl() {
  const headerList = await headers();
  const returnTo = headerList.get("x-pathname") ?? "/";

  return `/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`;
}

export async function fetchProtected<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE.accessToken)?.value;

  if (!accessToken) {
    redirect(await buildRefreshUrl());
  }

  const backendResponse = await getBackendApi().get(path, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (backendResponse.status === 401) {
    redirect(await buildRefreshUrl());
  }

  const result = await backendResponse.json<ApiResponse<T | null>>();

  if (!backendResponse.ok || result.data === null) {
    throw new Error(result.message);
  }

  return result.data;
}
