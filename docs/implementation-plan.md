# 단계별 구현 계획

원칙: 각 단계에서 구현과 검증 결과를 확인하고 수정 사항을 반영한 뒤, 사용자 승인 후에만 다음 단계로 진행한다.

## 1단계: Frontend 프로젝트 기반

- Next.js App Router + TypeScript 프로젝트 구성
- SCSS, Zustand, TanStack Query, React Hook Form, Zod, ky 설치
- lint, type-check, test, build 명령 구성
- 기본 디렉터리와 환경변수 schema 구성

검증:

- lint 통과
- type-check 통과
- production build 통과

승인 지점: 프로젝트 구조와 의존성 확인.

## 2단계: 공통 API 계층

- `ApiResponse<T>` 및 공통 오류 타입
- 브라우저용 ky 클라이언트
- 서버 전용 백엔드 클라이언트
- TanStack Query Provider와 query key 규칙
- 공통 오류 변환과 `no-store` 정책

검증:

- Generic 응답 parsing 테스트
- 성공·400·401·403·500 계열 오류 테스트
- Client/Server 모듈 경계 테스트

승인 지점: API 호출 구조와 오류 처리 확인.

## 3단계: 로그인과 쿠키

- 로그인 Zod schema
- React Hook Form 로그인 화면
- 로그인 TanStack mutation hook
- Next.js Login Route Handler
- 백엔드 로그인 응답 mock
- AT·RT HttpOnly 쿠키 생성

검증:

- 입력 검증과 오류 표시
- 성공 시 AT·RT가 응답 JSON에 노출되지 않음
- 쿠키 옵션과 사용자 DTO 확인

승인 지점: 로그인 화면과 쿠키 저장 흐름 확인.

## 4단계: CSR 인증과 refresh

- `/api/users/me` BFF Route Handler
- `useCurrentUserQuery`
- ky 401 처리와 단일 refresh 요청
- `/api/auth/refresh` Route Handler
- refresh 성공 후 원 요청 1회 재시도
- refresh 실패 시 쿠키 삭제

검증:

- 정상 사용자 조회
- AT 만료 후 자동 refresh
- 동시 401에서 refresh 한 번만 호출
- RT 만료 시 로그인 상태 종료

승인 지점: CSR 인증과 자동 refresh 확인.

## 5단계: SSR 인증과 Proxy

- `server-only` DAL
- 보호 페이지의 SSR 사용자 조회
- Proxy의 낙관적 경로 분기
- SSR 401 시 Refresh Route Handler 경유
- 안전한 `returnTo` 검증과 원래 페이지 복귀

검증:

- 유효한 AT로 SSR 성공
- AT 만료 후 refresh 및 SSR 재시도
- RT 없음·만료 시 로그인 페이지 이동
- open redirect 차단

승인 지점: 새로고침과 직접 URL 접근을 포함한 SSR 흐름 확인.

## 6단계: 로그아웃과 상태 정리

- 로그아웃 mutation과 Route Handler
- 백엔드 RT 폐기 요청 mock
- AT·RT 쿠키 삭제
- TanStack Query 사용자 범위 캐시 제거
- `router.refresh()`와 로그인 페이지 이동

검증:

- 로그아웃 성공
- 백엔드 장애 시에도 로컬 쿠키 삭제
- 뒤로 가기 및 보호 페이지 재접근 차단

승인 지점: 로그아웃과 캐시 정리 확인.

## 7단계: Backend 구현

- Spring Boot + Gradle 프로젝트 구성
- H2 사용자·RT 저장 구조
- `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- `/api/users/me`
- AT 15분, RT 7일, RT rotation 미사용
- 공통 `ApiResponse<T>` 적용

검증:

- 백엔드 단위·통합 테스트
- API 계약과 실제 응답 비교

승인 지점: 백엔드 API와 인증 정책 확인.

## 8단계: 전체 통합 테스트

- Frontend mock 제거 및 실제 Backend 연결
- SSR·CSR 로그인 유지
- AT 만료·RT 만료
- 동시 요청
- 로그아웃
- 권한 오류
- 브라우저 E2E 테스트

검증:

- frontend lint, type-check, unit test, build
- backend test
- 전체 E2E 통과

완료 조건: 문서, 구현, 테스트 결과가 모두 일치한다.
