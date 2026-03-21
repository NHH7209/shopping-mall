# 쇼핑몰 프로젝트 전체 학습 정리

> 포트폴리오용 풀스택 쇼핑몰 프로젝트. 화장품을 판매하는 쇼핑몰을 주제로 한다.

---

  포함된 내용:                                                                                                                                                                
  - 기술 스택표 — 프레임워크/라이브러리/개념 전부 이유 포함                                                                                                                   
  - 전체 디렉토리 구조 — 한눈에 파악 가능                                                                                                                                     
  - 프론트↔백엔드 흐름 — 요청이 어떤 경로로 처리되는지                                                                                                                        
  - 기능별 상세 — 파일명, 동작 방식, 왜 이렇게 했는지                                                                                                                         
  - CLI 명령어 정리 — 언제 무엇을 설치했는지                                                                                                                                  
  - 환경변수 정리                                                                                                                                                             
  - 현재 구현 상태표 — 완료/미구현 체크          

## 목차

1. [기술 스택](#기술-스택)
2. [프로젝트 구조](#프로젝트-구조)
3. [전체 흐름](#전체-흐름)
4. [기능별 구현 내용](#기능별-구현-내용)
   - [상품 관리 (백엔드)](#1-상품-관리-백엔드)
   - [이미지 업로드 (Cloudinary)](#2-이미지-업로드-cloudinary)
   - [JWT 인증](#3-jwt-인증)
   - [어드민 패널 (프론트엔드)](#4-어드민-패널-프론트엔드)
   - [쇼핑몰 메인 화면 (프론트엔드)](#5-쇼핑몰-메인-화면-프론트엔드)
   - [전역 인증 상태 관리 (Zustand)](#6-전역-인증-상태-관리-zustand)
   - [보호된 라우트 (Middleware)](#7-보호된-라우트-middleware)
5. [사용한 CLI 명령어 정리](#사용한-cli-명령어-정리)

---

## 기술 스택

### 프레임워크

| 이름 | 버전 | 사용 이유 |
|------|------|----------|
| **NestJS** | 11.0.1 | 백엔드 프레임워크. Express 위에서 동작하며 모듈/컨트롤러/서비스 구조를 강제해서 코드가 정돈됨. TypeScript 기본 지원 |
| **Next.js** | 16.1.7 | 프론트엔드 프레임워크. 서버 컴포넌트(SSR)와 클라이언트 컴포넌트를 혼용 가능. 파일 기반 라우팅으로 페이지 구조가 직관적 |
| **React** | 19.2.3 | Next.js의 기반 UI 라이브러리 |
| **PostgreSQL** | - | 관계형 데이터베이스. 상품, 유저, 주문 등 데이터 간 관계가 명확하므로 RDB 선택 |

### 라이브러리

| 이름 | 사용 이유 |
|------|----------|
| **TypeORM** | NestJS와 공식으로 잘 맞는 ORM. SQL을 직접 쓰지 않고 TypeScript 클래스로 테이블 정의 가능 |
| **@nestjs/jwt** | JWT 토큰 생성 및 검증 |
| **@nestjs/passport** + **passport-jwt** | 토큰 기반 인증 전략을 미들웨어 없이 Guard 하나로 처리 |
| **bcrypt** | 비밀번호 단방향 해싱. 평문 저장 절대 금지 |
| **cookie-parser** | NestJS에서 `req.cookies`를 읽기 위해 필요 |
| **class-validator** | DTO에서 요청 바디 유효성 검사 데코레이터 제공 |
| **class-transformer** | 요청 객체를 DTO 클래스로 변환 |
| **Cloudinary SDK** | 이미지를 서버에 저장하지 않고 외부 클라우드에 업로드 |
| **Multer** | 파일 업로드 미들웨어. NestJS에서 `@UploadedFile()` 데코레이터와 함께 사용 |
| **Axios** | 프론트엔드에서 HTTP 요청. fetch보다 interceptor 기능이 강력해서 선택 |
| **Zustand** | 전역 상태 관리. Redux보다 보일러플레이트가 훨씬 적고, 컴포넌트 밖에서도 상태 접근 가능 |
| **Tailwind CSS** | 클래스명으로 스타일 적용. 별도 CSS 파일 없이 빠르게 UI 구성 가능 |

### 개념/스킬

| 개념 | 설명 |
|------|------|
| **JWT (JSON Web Token)** | 로그인 후 서버가 발급하는 암호화된 토큰. 이후 요청에 이 토큰을 보내면 서버가 "이 사람 맞다"고 확인 |
| **Access Token / Refresh Token** | Access Token은 짧게(15분), Refresh Token은 길게(7일) 유지. 만료 시 Refresh Token으로 재발급 |
| **HttpOnly Cookie** | JavaScript로 접근 불가한 쿠키. XSS 공격으로 토큰을 훔치는 것을 방지 |
| **Token Rotation** | Refresh Token 사용 시 새 토큰 발급 + 기존 토큰 폐기. 탈취된 토큰 재사용 방지 |
| **SSR vs CSR** | 서버 컴포넌트(SSR): 서버에서 HTML 만들어 전달. 클라이언트 컴포넌트(CSR): 브라우저에서 JavaScript로 렌더링 |
| **Middleware (Next.js)** | 페이지 렌더링 전에 실행되는 코드. 비로그인 사용자 차단에 사용 |
| **CORS** | 다른 출처(포트)끼리 통신 허용 설정. 프론트(3000) ↔ 백엔드(4000) 통신에 필요 |
| **TypeORM Entity** | TypeScript 클래스로 DB 테이블을 정의하는 방식 |

---

## 프로젝트 구조

```
shopping-mall/
├── backend/                  # NestJS 백엔드
│   └── src/
│       ├── app.module.ts     # 루트 모듈 (모든 모듈 등록)
│       ├── main.ts           # 서버 진입점
│       ├── auth/             # 인증 모듈
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   ├── dto/
│       │   │   ├── login.dto.ts
│       │   │   └── signup.dto.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.module.ts
│       ├── users/            # 유저 모듈
│       │   ├── entities/
│       │   │   └── user.entity.ts
│       │   ├── users.service.ts
│       │   └── users.module.ts
│       ├── products/         # 상품 모듈
│       │   ├── entities/
│       │   │   ├── product.entity.ts
│       │   │   └── product-image.entity.ts
│       │   ├── dto/
│       │   │   ├── create-product.dto.ts
│       │   │   └── update-product.dto.ts
│       │   ├── products.controller.ts
│       │   ├── products.service.ts
│       │   └── products.module.ts
│       ├── cloudinary/       # 이미지 업로드
│       │   ├── cloudinary.provider.ts
│       │   ├── cloudinary.service.ts
│       │   └── cloudinary.module.ts
│       └── common/
│           └── guards/
│               └── jwt-auth.guard.ts
│
├── frontend/                 # Next.js 프론트엔드
│   └── src/
│       ├── app/
│       │   ├── layout.tsx          # 루트 레이아웃 (AuthInitializer 포함)
│       │   ├── (main)/             # 쇼핑몰 고객 페이지 그룹
│       │   │   ├── layout.tsx      # Header + Nav + Footer 감싸기
│       │   │   ├── page.tsx        # 메인 홈 (랭킹, 트렌딩)
│       │   │   ├── products/
│       │   │   ├── cart/
│       │   │   ├── checkout/
│       │   │   └── mypage/
│       │   ├── auth/               # 인증 페이지
│       │   │   ├── login/page.tsx
│       │   │   └── signup/page.tsx
│       │   └── admin/              # 관리자 페이지
│       │       ├── layout.tsx      # 사이드바 레이아웃
│       │       ├── page.tsx        # 대시보드
│       │       ├── products/
│       │       ├── orders/
│       │       └── users/
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── NavigationMenu.tsx
│       │   │   └── SearchBar.tsx
│       │   ├── product/
│       │   │   ├── ProductCard.tsx
│       │   │   └── ProductDetailClient.tsx
│       │   └── AuthInitializer.tsx
│       ├── store/
│       │   └── authStore.ts        # Zustand 인증 상태
│       ├── hooks/
│       │   └── useAuth.ts          # 로그인/회원가입/로그아웃 훅
│       ├── lib/
│       │   └── api.ts              # axios 인스턴스 + interceptor
│       ├── types/
│       │   └── user.ts
│       └── middleware.ts           # 보호된 라우트 처리
│
└── docs/
    ├── jwt-auth-study.md
    └── project-study.md   ← 현재 파일
```

---

## 전체 흐름

### 프론트 ↔ 백엔드 연결

```
브라우저 (Next.js, localhost:3000)
        ↕ HTTP 요청 (axios, withCredentials: true)
백엔드 서버 (NestJS, localhost:4000)
        ↕ SQL 쿼리 (TypeORM)
PostgreSQL DB (localhost:5432)

이미지 업로드 시:
브라우저 → 백엔드(Multer로 파일 수신) → Cloudinary(외부 저장) → URL 반환 → DB 저장
```

### 요청 처리 흐름 (백엔드)

```
HTTP 요청
  → NestJS 미들웨어 (cookie-parser, CORS)
  → Guard (JwtAuthGuard — 인증이 필요한 엔드포인트만)
  → ValidationPipe (DTO 유효성 검사)
  → Controller (라우팅)
  → Service (비즈니스 로직)
  → TypeORM (DB 쿼리)
  → 응답 반환
```

### 페이지 요청 흐름 (프론트엔드)

```
브라우저가 URL 입력
  → Next.js Middleware (보호된 라우트 체크)
      → 비로그인이면 /auth/login으로 리다이렉트
  → 서버 컴포넌트면: 서버에서 fetch → HTML 생성 → 전달
  → 클라이언트 컴포넌트면: JavaScript 번들 전달 → 브라우저에서 렌더링
```

---

## 기능별 구현 내용

---

### 1. 상품 관리 (백엔드)

#### 관련 파일
```
backend/src/products/
  entities/product.entity.ts       ← 상품 테이블
  entities/product-image.entity.ts ← 상품 이미지 테이블
  dto/create-product.dto.ts        ← 상품 생성 요청 형식
  dto/update-product.dto.ts        ← 상품 수정 요청 형식
  products.service.ts              ← 비즈니스 로직
  products.controller.ts           ← API 엔드포인트
  products.module.ts               ← 모듈 등록
```

#### API 엔드포인트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /products | 활성 상품 전체 조회 |
| GET | /products/admin | 비활성 포함 전체 조회 (관리자용) |
| GET | /products/ranking | 판매량 상위 10개 |
| GET | /products/trending | 조회수 상위 10개 |
| GET | /products/:id | 단일 상품 (조회수 +1) |
| POST | /products/upload | 이미지 Cloudinary 업로드 |

#### 어떻게 동작하는지

**Entity 관계:**
```
Product (1) ─────── (N) ProductImage
```
상품 하나에 이미지 여러 개. `isMain` 필드로 대표 이미지 구분.
Product 삭제 시 이미지도 자동 삭제 (`CASCADE`).

**왜 이 방식을 썼는지:**
- 상품과 이미지를 별도 테이블로 분리 → 나중에 이미지만 추가/삭제 가능
- `viewCount`, `salesCount` 컬럼 → 랭킹/트렌딩 기능을 별도 로직 없이 DB 정렬로 구현
- `isActive` 컬럼 → 상품을 실제로 삭제하지 않고 숨김 처리 가능 (주문 내역에 상품 정보 보존)

---

### 2. 이미지 업로드 (Cloudinary)

#### 관련 파일
```
backend/src/cloudinary/
  cloudinary.provider.ts  ← Cloudinary SDK 초기화 (환경변수로 설정)
  cloudinary.service.ts   ← 파일을 Cloudinary에 업로드하는 로직
  cloudinary.module.ts    ← 모듈 등록 및 export
```

#### 어떻게 동작하는지

```
관리자가 이미지 선택
  → 브라우저에서 FormData로 POST /products/upload
  → Multer가 파일을 메모리 버퍼로 받음
  → CloudinaryService.uploadFile(file)
  → Cloudinary 서버에 업로드
  → URL 반환 → 프론트엔드에서 URL을 상품 데이터와 함께 저장
```

**왜 이 방식을 썼는지:**
- 이미지를 서버 디스크에 저장하면 서버가 재시작될 때 파일이 사라질 위험이 있음
- Cloudinary 같은 외부 스토리지를 쓰면 이미지는 항상 안전하게 보존
- 무료 플랜으로 충분히 테스트 가능

---

### 3. JWT 인증

#### 관련 파일
```
backend/src/auth/
  strategies/jwt.strategy.ts  ← 토큰에서 유저 정보 추출
  dto/signup.dto.ts            ← 회원가입 요청 유효성 검사
  dto/login.dto.ts             ← 로그인 요청 유효성 검사
  auth.service.ts              ← 핵심 인증 로직
  auth.controller.ts           ← 인증 API 엔드포인트
  auth.module.ts               ← 모듈 등록

backend/src/users/
  entities/user.entity.ts     ← 유저 테이블 (refreshToken 포함)
  users.service.ts             ← 유저 DB 조회/생성
  users.module.ts

backend/src/common/guards/
  jwt-auth.guard.ts            ← 인증이 필요한 API에 붙이는 가드
```

#### API 엔드포인트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /auth/signup | 회원가입 |
| POST | /auth/login | 로그인 |
| POST | /auth/refresh | Access Token 갱신 |
| POST | /auth/logout | 로그아웃 |

#### 어떻게 동작하는지

**로그인 과정:**
```
1. POST /auth/login { email, password }
2. DB에서 이메일 조회
3. bcrypt.compare(입력 비밀번호, DB 해시) 검증
4. Access Token (15분) + Refresh Token (7일) 생성
5. Refresh Token → DB 저장 + HttpOnly 쿠키로 전달
6. Access Token → JSON 응답으로 전달
7. 프론트엔드: Access Token을 Zustand 메모리에 저장
```

**API 요청 과정:**
```
1. axios interceptor가 헤더에 Access Token 자동 첨부
   Authorization: Bearer eyJ...
2. 서버에서 JwtAuthGuard → JwtStrategy.validate() 실행
3. 토큰에서 userId 추출 → DB에서 유저 조회 → req.user에 주입
4. 컨트롤러에서 @Req() req.user로 현재 유저 접근 가능
```

**토큰 만료 시 자동 갱신:**
```
1. API 요청 → 서버에서 401 응답 (토큰 만료)
2. axios interceptor가 401 감지
3. POST /auth/refresh 자동 호출 (쿠키의 Refresh Token 사용)
4. 새 Access Token 발급
5. 실패했던 원래 요청 재시도
```

**왜 이 방식을 썼는지:**
- Access Token을 짧게 해서 탈취되어도 피해 최소화
- Refresh Token을 HttpOnly 쿠키에 저장 → JavaScript로 접근 불가 → XSS 방어
- Token Rotation: refresh 시 새 Refresh Token 발급 → 탈취된 구 토큰 무효화

---

### 4. 어드민 패널 (프론트엔드)

#### 관련 파일
```
frontend/src/app/admin/
  layout.tsx               ← 왼쪽 사이드바 레이아웃
  page.tsx                 ← 대시보드 (상품 통계 + 최근 상품 목록)
  products/page.tsx        ← 상품 목록 + 삭제
  products/new/page.tsx    ← 상품 등록 (이미지 업로드 포함)
  products/[id]/edit/page.tsx ← 상품 수정
  orders/page.tsx          ← (미구현)
  users/page.tsx           ← (미구현)
```

#### 어떻게 동작하는지

**라우트 그룹 구조:**
```
/admin          → admin/layout.tsx (사이드바) + admin/page.tsx
/admin/products → admin/layout.tsx + admin/products/page.tsx
/admin/products/new → 상품 등록 폼
/admin/products/[id]/edit → 동적 라우트, URL의 id값으로 상품 조회
```

**상품 등록 흐름:**
```
1. 이미지 파일 선택 → 브라우저에서 미리보기 (FileReader API)
2. "업로드" 클릭 → POST /products/upload → Cloudinary URL 반환
3. URL이 이미지 목록에 추가됨
4. 폼 제출 → POST /products { name, price, stock, description, images: [{url, isMain}] }
```

**왜 이 방식을 썼는지:**
- 어드민 페이지는 별도 `layout.tsx`로 분리 → 고객 페이지의 Header/Footer가 어드민에 나오지 않음
- `[id]` 동적 라우트 → 상품마다 별도 URL `/admin/products/1/edit`, `/admin/products/2/edit`
- 이미지 먼저 Cloudinary에 업로드하고 URL만 저장 → 상품 테이블을 단순하게 유지

---

### 5. 쇼핑몰 메인 화면 (프론트엔드)

#### 관련 파일
```
frontend/src/app/(main)/
  layout.tsx          ← Header + NavigationMenu + Footer 감싸기
  page.tsx            ← 홈: 실시간 랭킹 + 트렌딩 상품
  products/page.tsx   ← 상품 목록 (정렬 기능)

frontend/src/components/
  layout/Header.tsx            ← 로고, 검색, 로그인 상태 메뉴
  layout/NavigationMenu.tsx    ← 카테고리 네비게이션
  layout/Footer.tsx
  product/ProductCard.tsx      ← 상품 카드 컴포넌트
  product/ProductDetailClient.tsx
```

#### 라우트 그룹 `(main)` 이란?

```
(main) 폴더는 URL에 영향을 주지 않음.
/frontend/src/app/(main)/page.tsx → 실제 URL은 /
/frontend/src/app/(main)/products/page.tsx → 실제 URL은 /products

이렇게 분리하는 이유:
- 고객 페이지는 Header/Footer가 필요
- 어드민 페이지는 사이드바가 필요
- auth 페이지(로그인/회원가입)는 Header 없음
→ 그룹별로 다른 layout.tsx 적용 가능
```

#### 서버 컴포넌트 vs 클라이언트 컴포넌트

```tsx
// 서버 컴포넌트 (기본값) — 'use client' 없음
// 서버에서 직접 fetch → SEO에 유리, 초기 로딩 빠름
export default async function HomePage() {
  const products = await fetch('http://localhost:4000/products/ranking').then(r => r.json());
  return <ProductList products={products} />;
}

// 클라이언트 컴포넌트 — 'use client' 필요
// useState, useEffect, 이벤트 핸들러 사용 가능
'use client';
export default function SearchBar() {
  const [query, setQuery] = useState('');
  ...
}
```

---

### 6. 전역 인증 상태 관리 (Zustand)

#### 관련 파일
```
frontend/src/store/authStore.ts          ← 전역 상태 정의
frontend/src/hooks/useAuth.ts            ← 로그인/회원가입/로그아웃 훅
frontend/src/lib/api.ts                  ← axios 인스턴스 + interceptor
frontend/src/components/AuthInitializer.tsx  ← 새로고침 시 세션 복원
frontend/src/app/layout.tsx              ← AuthInitializer 등록
frontend/src/components/layout/Header.tsx   ← 로그인 상태에 따라 다른 UI
```

#### 어떻게 동작하는지

**상태 흐름:**
```
로그인 성공
  → useAuth.login() → API 호출 → 응답에서 { user, accessToken }
  → authStore.setAuth(user, accessToken)
  → Header의 useAuthStore() 가 자동으로 리렌더링
  → "홍길동님 | 마이페이지 | 로그아웃" 표시

새로고침
  → Zustand 상태 초기화 (메모리라서)
  → AuthInitializer 실행 → POST /auth/refresh (쿠키의 refresh token 사용)
  → 성공 시 authStore.setAuth() 재호출 → 로그인 유지
```

**왜 Zustand를 썼는지:**
```tsx
// Context API 방식 — 보일러플레이트가 많음
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

// Zustand 방식 — 훨씬 간결
const useAuthStore = create((set) => ({
  user: null,
  setAuth: (user, token) => set({ user, accessToken: token }),
}));

// 컴포넌트 밖에서도 접근 가능 (axios interceptor 등)
useAuthStore.getState().accessToken
```

---

### 7. 보호된 라우트 (Middleware)

#### 관련 파일
```
frontend/src/middleware.ts
```

#### 어떻게 동작하는지

```
사용자가 /cart URL 접근
  → Next.js가 페이지 렌더링 전에 middleware.ts 실행
  → req.cookies.get('refresh_token') 확인
  → 쿠키 없음 → /auth/login?redirect=/cart 로 리다이렉트
  → 쿠키 있음 → 정상적으로 /cart 페이지 렌더링

로그인 후:
  → searchParams.get('redirect') → '/cart'
  → router.replace('/cart') → 원래 가려던 페이지로 이동
```

**보호된 경로:**
- `/mypage/*` — 마이페이지
- `/cart` — 장바구니
- `/checkout/*` — 결제

**왜 Middleware를 썼는지:**
- 클라이언트 컴포넌트에서 `useEffect`로 체크하면 페이지가 잠깐 보였다가 리다이렉트됨 (깜빡임)
- Middleware는 서버 엣지에서 실행 → 렌더링 자체를 막아버림
- Zustand(메모리)는 서버에서 접근 불가 → HttpOnly 쿠키로 로그인 여부 1차 판단

---

## 사용한 CLI 명령어 정리

### 프로젝트 세팅

```bash
# NestJS 프로젝트 생성
nest new backend

# Next.js 프로젝트 생성
npx create-next-app@latest frontend
```

### 백엔드 패키지 설치

```bash
# TypeORM + PostgreSQL
npm install @nestjs/typeorm typeorm pg

# 환경변수
npm install @nestjs/config

# 유효성 검사
npm install class-validator class-transformer

# JWT 인증
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt cookie-parser
npm install -D @types/passport-jwt @types/bcrypt @types/cookie-parser

# 이미지 업로드
npm install @nestjs/platform-express multer cloudinary
npm install -D @types/multer

# Cloudinary
npm install cloudinary
```

### 프론트엔드 패키지 설치

```bash
# HTTP 클라이언트
npm install axios

# 전역 상태 관리
npm install zustand
```

### 개발 서버 실행

```bash
# 백엔드 (핫 리로드)
cd backend && npm run start:dev

# 프론트엔드
cd frontend && npm run dev
```

### DB 관련

```bash
# DB 시드 (샘플 데이터 삽입)
cd backend && npm run seed
```

---

## 환경변수 정리

### `backend/.env`

```env
# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=비밀번호
DB_NAME=shopping_mall
PORT=4000

# JWT (배포 시 반드시 복잡한 랜덤 문자열로 교체)
JWT_SECRET=시크릿키
JWT_REFRESH_SECRET=리프레시시크릿키

# Cloudinary
CLOUDINARY_CLOUD_NAME=클라우드이름
CLOUDINARY_API_KEY=API키
CLOUDINARY_API_SECRET=API시크릿
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> `NEXT_PUBLIC_` 접두사가 붙은 환경변수만 브라우저에서 접근 가능. 없는 것은 서버에서만 사용 가능.

---

## 현재 구현 상태

| 기능 | 상태 |
|------|------|
| 상품 목록/상세 조회 | ✅ 완료 |
| 상품 랭킹/트렌딩 | ✅ 완료 |
| 이미지 Cloudinary 업로드 | ✅ 완료 |
| 어드민 상품 CRUD | ✅ 완료 |
| 회원가입 / 로그인 | ✅ 완료 |
| JWT 인증 (토큰 자동 갱신) | ✅ 완료 |
| 보호된 라우트 | ✅ 완료 |
| 헤더 로그인 상태 반영 | ✅ 완료 |
| 장바구니 | ⬜ 미구현 |
| 주문 / 결제 | ⬜ 미구현 |
| 마이페이지 | ⬜ 미구현 |
| 어드민 주문 관리 | ⬜ 미구현 |
| 어드민 유저 관리 | ⬜ 미구현 |
| 어드민 접근 권한 보호 | ⬜ 미구현 |
