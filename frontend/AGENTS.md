# Frontend implementation rules

These rules apply to every file under `frontend/`.

## Required stack

- Use TypeScript for all application code. Keep domain payloads, API responses, form values, and component props explicitly typed; do not introduce `any` when a concrete or generic type can be defined.
- Use Zustand for client-only global state. Do not put server state or form state in Zustand.
- Use TanStack Query v5 for all server state, including fetching, caching, mutations, and cache invalidation.
- Use React Hook Form for form state and submission handling.
- Use Zod as the validation schema and source of inferred form/input types. Connect Zod to React Hook Form with `zodResolver`.
- Use `ky` through one shared API client for HTTP requests. Feature code must not call `fetch` directly or create ad hoc `ky` clients.
- Use SCSS for styling. Prefer locally scoped `*.module.scss` files for components and reserve global SCSS for resets, tokens, and truly global styles.

## State ownership

- Remote/API data belongs to TanStack Query.
- Shareable client UI state belongs to a small, feature-focused Zustand store.
- Local UI state stays in the component when it does not need to be shared.
- Form values and validation errors belong to React Hook Form and Zod.
- Do not duplicate the same data across TanStack Query, Zustand, and React Hook Form.

## TanStack Query hook convention

Follow the convention used by `C:\Users\USER\Projects\inforactive-board`:

1. Keep plain asynchronous API functions separate from React hooks, grouped by feature.
2. Put the feature API functions in a file such as `features/boards/boards.ts` and the hooks in a neighboring file such as `features/boards/useBoards.ts`.
3. API functions use the shared `ky` client, return typed data, and throw `Error` for unsuccessful responses.
4. Expose each query or mutation key from the hook as a reusable `getKey` function.
5. Use that same key function in `queryKey`, `mutationKey`, cache reads/updates, prefetching, and `invalidateQueries`.
6. After a successful mutation, invalidate only the affected query keys through `useQueryClient`.
7. Components consume feature hooks; they must not contain endpoint calls or assemble query keys themselves.

Use this shape when implementing a query:

```ts
export function useBoardsQuery(page: number, boardHubId: string) {
  return useQuery<BoardListResponse, Error>({
    queryKey: useBoardsQuery.getKey(page, boardHubId),
    queryFn: () => getBoards(page, boardHubId),
  });
}

useBoardsQuery.getKey = (page: number, boardHubId: string) =>
  ['boards', page, boardHubId] as const;
```

Use this shape when implementing a mutation:

```ts
export function useCreateBoardMutation(boardHubId: string) {
  const queryClient = useQueryClient();

  return useMutation<BoardItem, Error, NewBoardPayload>({
    mutationKey: useCreateBoardMutation.getKey(),
    mutationFn: createBoard,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useBoardsQuery.getKey(1, boardHubId),
      });
    },
  });
}

useCreateBoardMutation.getKey = () => ['createBoard'] as const;
```

Always call `getKey(...)` when it is a function. Do not accidentally pass the function itself as a `queryKey`. Query keys must include every argument that changes the response.

## HTTP and validation boundaries

- Configure credentials, base URL, authentication headers, timeout, retry policy, and common response handling once in the shared `ky` client.
- Pass query-string values with `searchParams`, JSON request bodies with `json`, and uploads with `FormData`/`body`.
- Parse unknown external data at the boundary with Zod when runtime trust is required. Type assertions alone are not validation.
- Normalize API failures into useful `Error` instances in the API layer so query hooks and UI code receive consistent errors.

## Next.js API route convention

Use App Router Route Handlers under `app/api/**/route.ts` as a backend-for-frontend proxy, following the route structure used by `C:\Users\USER\Projects\inforactive-board`.

- Browser-side feature API functions call the local `/api/...` routes through the shared `ky` client. Do not call the upstream backend directly from browser code.
- Each `route.ts` exports only the required HTTP method handlers (`GET`, `POST`, `PATCH`, `PUT`, or `DELETE`) and uses `NextRequest` and `NextResponse` from `next/server`.
- Keep the upstream API base URL in one server-side configuration/environment value. Do not repeat hosts in route files and never expose server-only secrets through `NEXT_PUBLIC_*` variables.
- Treat route handlers as a thin transport boundary: read and validate input, construct the upstream request, forward the response body and status, and avoid domain/UI state inside the route.
- Validate JSON bodies, query parameters, and dynamic path parameters with Zod before forwarding them. Return a consistent typed `400` response for invalid input.
- Do not accept or forward a browser-provided `Authorization` header for authenticated application requests. Read the HttpOnly access-token cookie in the Route Handler and construct the backend `Authorization` header server-side. Forward only explicitly allowed non-auth headers; never blindly copy every incoming header or cookie.
- Build upstream query strings with `URLSearchParams`. Preserve all parameters that affect the requested resource.
- For JSON, read `await request.json()`, validate it, set `Content-Type: application/json`, and serialize the validated payload.
- For file uploads, read `await request.formData()` and forward it as the request body without manually setting `Content-Type`, so the multipart boundary is generated correctly.
- Return upstream JSON with `NextResponse.json(data, { status: upstream.status })`. For `204 No Content` or another empty response, return `new NextResponse(null, { status: upstream.status })` instead of parsing JSON.
- Catch network failures and malformed upstream responses at the route boundary and return the project's consistent error shape with an appropriate gateway/server status. Do not leak stack traces, tokens, or internal upstream details.
- Authentication routes may read and write refresh-token cookies. Refresh tokens must remain `httpOnly`; cookie options (`secure`, `sameSite`, `path`, and expiry) must be defined centrally and applied consistently. Access tokens must never be written into response logs.
- Keep route-specific request/response types and Zod schemas near the owning feature, not duplicated across the component, query hook, and route handler.

The intended request flow is:

```text
Component
  -> TanStack Query feature hook
  -> typed feature API function
  -> shared ky client
  -> local app/api/**/route.ts
  -> upstream backend API
```

## Authentication architecture

Follow `../docs/auth-architecture.md` as the single source of truth for authentication.

- Do not add a frontend Redis/DB session store, Token Vault, `session_id`, or separate `session` cookie.
- Store the backend-issued access and refresh tokens only in separate HttpOnly cookies managed by Next.js Route Handlers.
- Never expose tokens to Client Components, Zustand, localStorage, TanStack Query, response JSON, URLs, or logs.
- Use the backend as the final authority for users, roles, token validation, refresh, and revocation.
- Do not enable refresh-token rotation unless the architecture document is explicitly changed first.

## Implementation boundary

This file defines the intended frontend architecture only. Do not scaffold, install packages, or implement features solely because these rules exist; implementation begins only when explicitly requested.
