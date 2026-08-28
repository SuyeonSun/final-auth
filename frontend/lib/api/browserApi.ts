import ky from "ky";

let refreshPromise: Promise<boolean> | undefined;

function isAuthenticationRoute(url: string) {
  return new URL(url).pathname.startsWith("/api/auth/");
}

async function refreshAccessToken() {
  refreshPromise ??= ky
    .post("/api/auth/refresh", {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
      retry: 0,
      throwHttpErrors: false,
      timeout: 15_000,
    })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = undefined;
    });

  return refreshPromise;
}

export const browserApi = ky.create({
  credentials: "same-origin",
  headers: {
    Accept: "application/json",
  },
  retry: {
    delay: () => 0,
    limit: 1,
    methods: [],
    statusCodes: [],
  },
  throwHttpErrors: false,
  timeout: 15_000,
  hooks: {
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (
          response.status !== 401 ||
          retryCount > 0 ||
          isAuthenticationRoute(request.url)
        ) {
          return;
        }

        const refreshed = await refreshAccessToken();

        if (refreshed) {
          return ky.retry({
            code: "AUTH_TOKEN_REFRESHED",
            request,
          });
        }

        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
      },
    ],
  },
});
