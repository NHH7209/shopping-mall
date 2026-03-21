# JWT 인증 구현 학습 정리

## 전체 흐름

```
회원가입/로그인
    ↓
백엔드: 비밀번호 bcrypt 해싱 → Access Token(15분) + Refresh Token(7일) 발급
    ↓
Access Token → JSON 응답으로 프론트엔드에 전달 → Zustand 메모리에 저장
Refresh Token → HttpOnly 쿠키로 전달 → 브라우저가 자동 관리
    ↓
API 요청 시 axios interceptor가 헤더에 Access Token 자동 첨부
    ↓
Access Token 만료(401) → axios가 /auth/refresh 자동 호출 → 토큰 갱신 후 재시도
```

---

## 백엔드 (NestJS)

### `backend/src/users/entities/user.entity.ts`
**뭘 했는지**
- User 테이블 정의 (id, name, email, password, role, refreshToken, createdAt, updatedAt)

**왜 이렇게 했는지**
- `role` 컬럼: 나중에 어드민 기능 구분을 위해 처음부터 포함
- `refreshToken` 컬럼: Refresh Token을 DB에 저장해서 로그아웃 시 무효화 가능하게 함. DB에 없으면 탈취된 토큰도 막을 수 없음
- `password`는 응답에 노출되지 않도록 서비스 레이어에서 직접 제외

**주의할 점**
- `password` 필드를 API 응답에 포함시키면 안 됨. 서비스에서 반환 시 `{ id, name, email, role }`만 선택해서 넘겨야 함

---

### `backend/src/users/users.service.ts`
**뭘 했는지**
- `findByEmail`, `findById`, `create`, `updateRefreshToken` 메서드 구현

**왜 이렇게 했는지**
- `create`에서 이메일 중복 체크: DB unique 제약은 에러를 던지지만 메시지가 불친절함. 앱 레벨에서 먼저 체크해서 `409 ConflictException`으로 명확한 에러 반환
- `updateRefreshToken`: 로그아웃 시 `null`로 업데이트해서 해당 Refresh Token 무효화

---

### `backend/src/auth/dto/signup.dto.ts` / `login.dto.ts`
**뭘 했는지**
- `class-validator`로 요청 바디 유효성 검사 정의

**왜 이렇게 했는지**
- DTO 없이 받으면 잘못된 형식의 데이터가 그대로 서비스까지 내려감
- `main.ts`에 `ValidationPipe` 글로벌 등록을 해야 DTO가 실제로 동작함
- `whitelist: true` 옵션: DTO에 없는 필드는 자동으로 제거 (불필요한 데이터 차단)

**주의할 점**
- `ValidationPipe` 없으면 DTO 데코레이터가 아무 역할을 하지 않음

---

### `backend/src/auth/auth.service.ts`
**뭘 했는지**
- `signup`: 비밀번호 해싱 → 유저 생성 → 토큰 발급
- `login`: 이메일/비밀번호 검증 → 토큰 발급
- `refresh`: Refresh Token 검증 → 새 토큰 발급 (Token Rotation)
- `logout`: DB의 refreshToken을 null로 업데이트
- `issueTokens`: Access/Refresh Token 발급 + DB 저장

**왜 이렇게 했는지**
- **bcrypt salt rounds 10**: 너무 낮으면 보안 취약, 너무 높으면 서버 부하. 10이 일반적인 기준
- **Token Rotation**: refresh 시 기존 토큰을 새 토큰으로 교체하고 DB도 업데이트. 탈취된 Refresh Token 재사용 방지
- **로그인 실패 메시지를 동일하게**: "이메일이 없음"과 "비밀번호 틀림"을 같은 메시지로 → 공격자가 이메일 존재 여부를 알 수 없게 함

**주의할 점**
- `JWT_SECRET`과 `JWT_REFRESH_SECRET`은 반드시 다른 값 사용. 같으면 Access Token으로 Refresh 엔드포인트 호출 가능해짐
- 두 값 모두 `.env`에 저장하고 절대 코드에 하드코딩 금지

---

### `backend/src/auth/auth.controller.ts`
**뭘 했는지**
- `POST /auth/signup`: 회원가입 → Access Token(JSON) + Refresh Token(쿠키) 응답
- `POST /auth/login`: 로그인 → 동일
- `POST /auth/refresh`: Refresh Token 쿠키로 토큰 갱신
- `POST /auth/logout`: Access Token으로 인증 후 Refresh Token 무효화

**왜 이렇게 했는지**
- `@Res({ passthrough: true })`: NestJS에서 쿠키를 직접 설정하려면 `@Res`가 필요한데, `passthrough: true` 없으면 NestJS의 자동 응답 처리가 꺼져버림
- **Refresh Token을 HttpOnly 쿠키로**: JavaScript로 접근 불가 → XSS 공격으로 탈취 불가
- `sameSite: 'lax'`: CSRF 기본 방어. `strict`는 외부 링크 클릭 시 쿠키 전송 안 됨

**주의할 점**
- `secure: true`는 HTTPS에서만 쿠키 전송. 개발 환경(HTTP)에서는 `process.env.NODE_ENV === 'production'`으로 조건 처리 필요

---

### `backend/src/auth/strategies/jwt.strategy.ts`
**뭘 했는지**
- JWT를 Authorization 헤더에서 추출 → 검증 → 유저 객체를 `req.user`에 주입

**왜 이렇게 했는지**
- Passport 전략 패턴: `@UseGuards(JwtAuthGuard)` 하나만 붙이면 자동으로 토큰 검증 + 유저 주입이 됨
- `validate()`의 반환값이 `req.user`가 됨

---

### `backend/src/common/guards/jwt-auth.guard.ts`
**뭘 했는지**
- `AuthGuard('jwt')` 상속만 해서 재사용 가능한 가드 생성

**왜 이렇게 했는지**
- 컨트롤러에 `@UseGuards(JwtAuthGuard)` 붙이면 해당 엔드포인트는 유효한 Access Token 없이 접근 불가

---

### `backend/src/main.ts`
**뭘 했는지**
- `cookieParser()` 미들웨어 등록
- `ValidationPipe` 글로벌 등록
- CORS에 `credentials: true` 추가

**왜 이렇게 했는지**
- `cookieParser` 없으면 `req.cookies`가 `undefined`
- `credentials: true` 없으면 브라우저가 쿠키를 서버로 전송하지 않음 (프론트엔드의 `withCredentials: true`와 쌍을 이룸)

**주의할 점**
- CORS `credentials: true`를 쓸 때 `origin: '*'` 와일드카드 사용 불가. 반드시 정확한 출처 명시 필요

---

## 프론트엔드 (Next.js + Zustand)

### `frontend/src/types/user.ts`
**뭘 했는지**
- `User` 타입 정의 (id, name, email, role)

**왜 이렇게 했는지**
- 여러 컴포넌트에서 유저 타입을 공유하기 위해 한 곳에 정의

---

### `frontend/src/store/authStore.ts`
**뭘 했는지**
- Zustand로 전역 인증 상태 관리 (user, accessToken)
- `setAuth`, `setAccessToken`, `logout` 액션 정의

**왜 이렇게 했는지**
- **Access Token을 메모리(Zustand)에 저장**: localStorage는 XSS로 탈취 가능. 메모리는 페이지 닫으면 사라지지만 Refresh Token(쿠키)으로 복원됨
- Zustand는 Context API보다 보일러플레이트가 적고, 컴포넌트 외부(axios interceptor)에서도 `getState()`로 접근 가능

**주의할 점**
- 페이지 새로고침 시 Zustand 상태는 초기화됨 → `AuthInitializer`가 Refresh Token으로 복원하는 이유

---

### `frontend/src/lib/api.ts`
**뭘 했는지**
- axios 인스턴스 생성 + `withCredentials: true` 설정
- **Request interceptor**: 모든 요청에 Access Token 자동 첨부
- **Response interceptor**: 401 응답 시 `/auth/refresh` 호출 후 원래 요청 재시도

**왜 이렇게 했는지**
- 매 API 호출마다 토큰을 수동으로 헤더에 붙이는 코드 제거
- **failedQueue 패턴**: 토큰 갱신 중 동시에 여러 요청이 401을 받으면 갱신을 한 번만 하고 나머지는 줄 세워서 기다리게 함. 이 처리 없으면 갱신 요청이 중복 발생

**주의할 점**
- `withCredentials: true` 없으면 Refresh Token 쿠키가 서버로 전달되지 않음
- interceptor에서 `/auth/refresh`를 호출할 때는 무한 루프 방지를 위해 기본 `axios`를 사용 (인스턴스 `api` 사용 금지)

---

### `frontend/src/hooks/useAuth.ts`
**뭘 했는지**
- `login`, `signup`, `logout` 함수 제공
- `isLoggedIn` 편의 값 제공

**왜 이렇게 했는지**
- API 호출 + 상태 업데이트 로직을 컴포넌트에서 분리
- redirect는 각 페이지에서 직접 처리하도록 hook에서 제거 → 재사용성 향상 (로그인 후 어디로 갈지는 호출하는 쪽이 결정)

---

### `frontend/src/components/AuthInitializer.tsx`
**뭘 했는지**
- 앱 최초 마운트 시 `/auth/refresh` 호출해서 세션 복원
- 루트 `layout.tsx`에 포함시켜서 모든 페이지에서 실행

**왜 이렇게 했는지**
- Zustand는 메모리 저장이라 새로고침 시 초기화됨
- Refresh Token(쿠키)은 브라우저가 유지하므로 이를 활용해 자동 로그인
- 실패해도 에러 무시 → 비로그인 상태로 정상 동작

---

### `frontend/src/middleware.ts`
**뭘 했는지**
- `/mypage`, `/cart`, `/checkout` 접근 시 Refresh Token 쿠키 확인
- 쿠키 없으면 `/auth/login?redirect=원래경로`로 리다이렉트

**왜 이렇게 했는지**
- Next.js 미들웨어는 서버 엣지에서 실행 → 클라이언트 렌더링 전에 차단 가능
- Access Token은 메모리에 있어 미들웨어에서 확인 불가 → HttpOnly 쿠키에 있는 Refresh Token으로 로그인 여부 판단
- `redirect` 쿼리 파라미터: 로그인 후 원래 가려던 페이지로 복귀

**주의할 점**
- Refresh Token 쿠키가 있다고 반드시 유효한 것은 아님 (만료됐을 수 있음). 미들웨어는 1차 방어선이고, 실제 API 요청에서 401로 최종 검증됨

---

## 토큰 저장 전략 비교

| | localStorage | 메모리(Zustand) | HttpOnly 쿠키 |
|---|---|---|---|
| XSS 취약 | O (위험) | X (안전) | X (안전) |
| 새로고침 유지 | O | X | O |
| JS 접근 | O | O | X |
| 용도 | 사용 비권장 | Access Token | Refresh Token |

---

## 주의할 점 요약

1. `JWT_SECRET` ≠ `JWT_REFRESH_SECRET` — 반드시 다른 값
2. 배포 시 `.env`의 시크릿 값을 강력한 랜덤 문자열로 교체
3. CORS `credentials: true` ↔ axios `withCredentials: true` 항상 쌍으로
4. `ValidationPipe` 글로벌 등록 안 하면 DTO 유효성 검사 안 됨
5. axios interceptor에서 refresh 호출 시 `api` 인스턴스가 아닌 기본 `axios` 사용 (무한 루프 방지)
