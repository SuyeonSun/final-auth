import "server-only";

import ky, { type KyInstance } from "ky";

let backendApi: KyInstance | undefined;

function getBackendApiUrl() {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URL 환경변수가 필요합니다.");
  }

  return backendApiUrl.replace(/\/$/, "");
}

export function getBackendApi() {
  if (backendApi) {
    return backendApi;
  }

  const backendApiUrl = getBackendApiUrl();

  backendApi = ky.create({
    prefix: `${backendApiUrl}/`,
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
    retry: 0,
    throwHttpErrors: false,
    timeout: 15_000,
  });

  return backendApi;
}
