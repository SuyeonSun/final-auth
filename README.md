# Final Auth

Next.js(BFF) + Spring Boot 기반 인증 예제 프로젝트.

```
frontend/   Next.js App Router (BFF, SSR/CSR 인증)
backend/    Spring Boot + Gradle + H2 (JWT 발급/검증)
docs/       설계 문서
```

## 사전 준비

- Node.js >= 20.9.0, pnpm 11.x
- Java 17

## 백엔드 실행

```bash
cd backend
cp .env.example .env   # JWT_SECRET 채우기 (아래 명령으로 생성)
openssl rand -base64 48

./gradlew bootRun       # Windows: gradlew.bat bootRun
```

- 서버: http://localhost:8080
- `backend/.env`가 없으면 `JWT_SECRET`이 비어 있어 앱이 시작되지 않는다.
- H2가 인메모리라 재시작할 때마다 데이터가 초기화되고, 데모 유저와 EV 회사 목록이 자동으로 다시 시딩된다.

기타 명령어:

```bash
./gradlew build   # 빌드
./gradlew test    # 테스트
```

## 프론트엔드 실행

```bash
cd frontend
cp .env.example .env   # BACKEND_API_URL=http://localhost:8080 (기본값 그대로 사용 가능)

pnpm install
pnpm dev
```

- 서버: http://localhost:3000 (포트가 사용 중이면 3001 등으로 자동 변경)

기타 명령어:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 데모 계정

| 이메일 | 비밀번호 |
| --- | --- |
| `demo@example.com` | `password123` |

## H2 DB 콘솔 접속

백엔드가 실행 중인 상태에서:

1. 브라우저로 http://localhost:8080/h2-console 접속
2. 접속 정보 입력 후 Connect

| 항목 | 값 |
| --- | --- |
| Driver Class | `org.h2.Driver` |
| JDBC URL | `jdbc:h2:mem:finalauth` |
| User Name | `sa` |
| Password | (공란) |

테이블: `USERS`, `USER_ROLES`, `REFRESH_TOKENS`, `EV_CHARGING_COMPANIES`

## API 문서

- [docs/auth-api-contract.md](docs/auth-api-contract.md) — 프론트-백엔드 인증 API 계약
- [docs/auth-architecture.md](docs/auth-architecture.md) — 인증 아키텍처(SSR/CSR, 쿠키, DAL)
- [docs/implementation-plan.md](docs/implementation-plan.md) — 단계별 구현 계획
