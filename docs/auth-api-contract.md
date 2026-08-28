# 프론트엔드-백엔드 인증 API 계약

상태: 설계안. 구현 전 검토용이며 실제 API는 아직 존재하지 않는다.

## 1. 범위

이 문서는 Next.js 프론트엔드 서버와 백엔드 사이의 인증 API만 정의한다.

```text
Next.js Frontend Server -> Spring Boot Backend API
```

- 백엔드가 사용자, 권한, AT·RT의 최종 관리 주체다.
- Next.js는 백엔드가 발급한 AT·RT를 사용해 통신한다.
- 브라우저 쿠키, Next.js 세션 저장 방식, DAL 구현은 별도 프론트엔드 설계 문서에서 다룬다.

## 2. 공통 응답

```ts
export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};
```

- HTTP status는 전송 결과를 나타낸다.
- `code`는 프론트엔드 분기와 로깅에 사용하는 업무 코드다.
- 반환 데이터가 없는 성공 응답은 `data: null`을 사용한다.
- 오류도 동일한 Generic 구조를 사용한다.
- AT·RT는 로그인 응답에서 반환하고, refresh 응답은 기존 RT를 유지한 채 새 AT만 반환한다.

## 3. 공통 타입

```ts
export type UserDto = {
  id: string;
  username: string;
  useremail: string;
  roles: string[];
};

export type AccessTokenData = {
  accessToken: string;
  accessTokenExpiresAt: string;
};

export type TokenPair = AccessTokenData & {
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

export type ValidationErrorData = {
  fieldErrors: Record<string, string[]>;
};
```

## 4. API 목록

| 이름 | Method | URL | 인증 |
| --- | --- | --- | --- |
| 로그인 및 토큰 발급 | `POST` | `/api/auth/login` | 없음 |
| 토큰 갱신 | `POST` | `/api/auth/refresh` | RT |
| 로그아웃 및 RT 폐기 | `POST` | `/api/auth/logout` | RT |
| 내 사용자 정보 조회 | `GET` | `/api/users/me` | AT |

## 5. API 상세

### 로그인 및 토큰 발급

| 항목 | 내용 |
| --- | --- |
| 이름 | 로그인 및 토큰 발급 |
| Method | `POST` |
| URL | `/api/auth/login` |
| Request Header | `Content-Type: application/json` |
| Request Body | `{ useremail: string; password: string }` |
| Response Header | `Content-Type: application/json`, `Cache-Control: no-store` |
| Response Body | `ApiResponse<{ tokens: TokenPair; user: UserDto }>` |
| Success | `200 AUTH_LOGIN_SUCCESS` |
| Failure | `400 AUTH_VALIDATION_FAILED`, `401 AUTH_INVALID_CREDENTIALS`, `429 AUTH_TOO_MANY_ATTEMPTS` |

성공 응답 예시:

```json
{
  "code": "AUTH_LOGIN_SUCCESS",
  "message": "로그인되었습니다.",
  "data": {
    "tokens": {
      "accessToken": "access-token",
      "refreshToken": "refresh-token",
      "accessTokenExpiresAt": "2026-08-28T10:30:00Z",
      "refreshTokenExpiresAt": "2026-09-04T10:00:00Z"
    },
    "user": {
      "id": "user-1",
      "username": "홍길동",
      "useremail": "user@example.com",
      "roles": ["user"]
    }
  }
}
```

### 토큰 갱신

| 항목 | 내용 |
| --- | --- |
| 이름 | AT·RT 갱신 |
| Method | `POST` |
| URL | `/api/auth/refresh` |
| Request Header | `Content-Type: application/json` |
| Request Body | `{ refreshToken: string }` |
| Response Header | `Content-Type: application/json`, `Cache-Control: no-store` |
| Response Body | `ApiResponse<{ token: AccessTokenData }>` |
| Success | `200 AUTH_TOKEN_REFRESH_SUCCESS` |
| Failure | `401 AUTH_REFRESH_TOKEN_INVALID`, `401 AUTH_REFRESH_TOKEN_EXPIRED` |

성공 응답 예시:

```json
{
  "code": "AUTH_TOKEN_REFRESH_SUCCESS",
  "message": "토큰이 갱신되었습니다.",
  "data": {
    "token": {
      "accessToken": "new-access-token",
      "accessTokenExpiresAt": "2026-08-28T11:00:00Z"
    }
  }
}
```

- RT rotation은 적용하지 않는다.
- 갱신 성공 시 새 AT와 AT 만료 시간만 반환하며 기존 RT를 계속 사용한다.
- RT는 만료 또는 로그아웃 시 폐기한다.
- 탈취된 RT는 만료·폐기 전까지 재사용될 수 있으므로 RT를 로그에 남기지 않고 저장 시 안전하게 보호한다.
- AT 만료 시간은 15분, RT 만료 시간은 7일로 한다.

### 로그아웃 및 RT 폐기

| 항목 | 내용 |
| --- | --- |
| 이름 | 로그아웃 및 RT 폐기 |
| Method | `POST` |
| URL | `/api/auth/logout` |
| Request Header | `Content-Type: application/json` |
| Request Body | `{ refreshToken: string }` |
| Response Header | `Content-Type: application/json`, `Cache-Control: no-store` |
| Response Body | `ApiResponse<null>` |
| Success | `200 AUTH_LOGOUT_SUCCESS` |
| Failure | 이미 만료·폐기된 RT도 최종 상태가 로그아웃이면 성공 처리 |

성공 응답 예시:

```json
{
  "code": "AUTH_LOGOUT_SUCCESS",
  "message": "로그아웃되었습니다.",
  "data": null
}
```

### 내 사용자 정보 조회

| 항목 | 내용 |
| --- | --- |
| 이름 | 내 사용자 정보 조회 |
| Method | `GET` |
| URL | `/api/users/me` |
| Request Header | `Authorization: Bearer <accessToken>` |
| Request Body | 없음 |
| Response Header | `Content-Type: application/json`, `Cache-Control: private, no-store` |
| Response Body | `ApiResponse<UserDto>` |
| Success | `200 USER_ME_SUCCESS` |
| Failure | `401 AUTH_ACCESS_TOKEN_INVALID`, `401 AUTH_ACCESS_TOKEN_EXPIRED`, `403 AUTH_FORBIDDEN` |

성공 응답 예시:

```json
{
  "code": "USER_ME_SUCCESS",
  "message": "사용자 정보를 조회했습니다.",
  "data": {
    "id": "user-1",
    "username": "홍길동",
    "useremail": "user@example.com",
    "roles": ["user"]
  }
}
```

## 6. 보호 API 공통 규칙

인증이 필요한 다른 백엔드 API도 다음 헤더를 사용한다.

```text
Authorization: Bearer <accessToken>
```

- AT가 없거나 잘못됐거나 만료되면 `401`을 반환한다.
- 인증됐지만 권한이 부족하면 `403`을 반환한다.
- AT 만료 시 Next.js가 백엔드 `/api/auth/refresh`를 호출하고 원 요청을 최대 한 번 재시도한다.
- 백엔드는 사용자 및 역할의 최신 상태를 기준으로 권한을 검사한다.

## 7. 구현 환경 및 미확정 사항

- 백엔드는 Spring Boot, Gradle, H2로 구현한다.
- 모든 백엔드 API prefix는 `/api`로 통일한다.
- AT 만료 시간은 15분, RT 만료 시간은 7일로 한다.

남은 미확정 사항:

- `UserDto` 최종 필드
- 전체 기기 로그아웃 API 필요 여부
- 업무 code 네이밍 규칙의 최종 확정

## 8. 참고

- [API 문서 설계 순서](./api-design-order.md)
