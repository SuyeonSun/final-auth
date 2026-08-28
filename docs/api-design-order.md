# API 문서 설계 순서

상태: 모든 API 설계 문서에 적용할 작성 규칙.

## 1. API 설계 순서

| 순서 | 설계 항목 | 확인 내용 |
| --- | --- | --- |
| 1 | 목적과 책임 | API가 해결하는 문제, 호출 주체, 담당 서버를 정한다. |
| 2 | 인증과 권한 | 공개 API인지, 세션/AT가 필요한지, 필요한 역할을 정한다. |
| 3 | 이름 | 업무 목적이 드러나는 API 이름을 정한다. |
| 4 | Method와 URL | 리소스 중심 URL과 HTTP Method를 정한다. |
| 5 | Request Header | 인증, Content-Type, 멱등 키 등 필수 헤더를 정한다. |
| 6 | Request 입력 | Path, Query, Body를 구분하고 Generic이 아닌 구체 타입을 정한다. |
| 7 | 입력 검증 | Zod schema, 필수값, 길이, 형식, 허용 범위를 정한다. |
| 8 | Response Header | Content-Type, Cache-Control, Set-Cookie 등을 정한다. |
| 9 | Response Body | `ApiResponse<T>`의 `T`, code, message를 정한다. |
| 10 | 상태와 오류 | HTTP 상태, 업무 code, 실패 조건을 정한다. |
| 11 | 부수 효과 | DB 변경, 쿠키 변경, 캐시 무효화, 외부 API 호출을 적는다. |
| 12 | 보안과 운영 | CSRF, rate limit, 로그 마스킹, timeout, retry를 정한다. |
| 13 | 멱등성과 동시성 | 중복 요청 결과, lock 또는 version 정책을 정한다. |
| 14 | 검토와 확정 | 프론트·백엔드가 계약을 검토하고 변경 이력을 남긴다. |

## 2. 공통 응답 Generic

```ts
export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};
```

- HTTP status와 업무 `code`를 별도로 사용한다.
- 성공 데이터가 없으면 `ApiResponse<null>`을 사용한다.
- validation 오류는 `ApiResponse<{ fieldErrors: Record<string, string[]> }>`를 사용한다.
- 토큰과 내부 오류 정보는 응답에 포함하지 않는다.

## 3. API 문서 표준 템플릿

```md
### API 이름

| 항목 | 내용 |
| --- | --- |
| 이름 |  |
| Method |  |
| URL |  |
| Request Header |  |
| Request Path |  |
| Request Query |  |
| Request Body |  |
| Response Header |  |
| Response Body | `ApiResponse<T>` |
| Success | HTTP status, code |
| Failure | HTTP status, code |
| Side Effect |  |
| Authorization |  |
```

해당 입력이 없으면 항목을 삭제하지 않고 `없음`으로 표시한다.

## 4. 완료 조건

- 프론트와 백엔드의 필드명 및 타입이 일치한다.
- 모든 성공·실패 응답에 HTTP status와 code가 정의돼 있다.
- 인증·권한 검사 위치가 명시돼 있다.
- 쿠키, 캐시, 부수 효과가 명시돼 있다.
- 민감 정보가 응답이나 로그에 노출되지 않는다.
- 정상, 검증 실패, 인증 실패, 권한 실패, 외부 장애 시나리오를 설명할 수 있다.
