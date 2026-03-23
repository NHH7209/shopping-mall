# BlueMe — 화장품 쇼핑몰

> Next.js + NestJS 기반 풀스택 화장품 e-커머스 프로젝트

**🔗 배포 링크: [https://blueme.vercel.app](https://blueme.vercel.app)**

<br/>

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [기술 스택](#2-기술-스택)
3. [주요 기능](#3-주요-기능)
4. [화면 구성](#4-화면-구성)
5. [시스템 아키텍처](#5-시스템-아키텍처)
6. [ERD](#6-erd)
7. [API 명세](#7-api-명세)
8. [트러블슈팅](#8-트러블슈팅)
9. [로컬 실행 방법](#9-로컬-실행-방법)

<br/>

## 1. 프로젝트 소개

회원가입부터 상품 탐색, 장바구니, 결제, 주문 관리까지 e-커머스의 전체 흐름을 직접 구현한 풀스택 프로젝트입니다.

단순한 CRUD를 넘어 **JWT 기반 인증(Access/Refresh Token 이중 구조)**, **Toss Payments 실 결제 연동**, **Cloudinary 이미지 업로드**, **관리자 대시보드** 등 실서비스에 가까운 기능을 구현했습니다.

배포 과정에서 발생한 크로스 도메인 쿠키 문제, CORS 설정, Next.js 빌드 에러 등 실제 운영 환경의 이슈를 직접 해결하며 개발 역량을 쌓았습니다.

| 구분 | 내용 |
|------|------|
| 개발 기간 | 개인 프로젝트 |
| 배포 환경 | Vercel (Frontend) + Railway (Backend, PostgreSQL) |

<br/>

## 2. 기술 스택

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-5-FF6B00?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1.13-5A29E4?style=flat-square&logo=axios)

### Backend

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-FE0902?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Passport-000000?style=flat-square&logo=jsonwebtokens)
![Bcrypt](https://img.shields.io/badge/bcrypt-6-003366?style=flat-square)

### 외부 서비스

![Toss Payments](https://img.shields.io/badge/Toss_Payments-SDK-0064FF?style=flat-square)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=flat-square&logo=cloudinary)
![Vercel](https://img.shields.io/badge/Vercel-배포-000000?style=flat-square&logo=vercel)
![Railway](https://img.shields.io/badge/Railway-배포-0B0D0E?style=flat-square&logo=railway)

<br/>

## 3. 주요 기능

### 사용자
| 기능 | 설명 |
|------|------|
| 회원가입 / 로그인 | JWT Access Token(15분) + Refresh Token(7일, HttpOnly 쿠키) 이중 인증 |
| 토큰 자동 갱신 | Access Token 만료 시 Axios Interceptor가 자동으로 갱신 후 원래 요청 재시도 |
| 상품 탐색 | 카테고리 필터, 키워드 검색, 실시간 랭킹(판매순), 트렌딩(조회순) |
| 장바구니 | 상품 추가/수량 변경/삭제, 로그인 시 서버 장바구니 동기화 |
| 결제 | Toss Payments 카드 결제, 30,000원 이상 무료배송 |
| 바로 구매 | 장바구니 없이 상품 상세에서 즉시 결제 |
| 마이페이지 | 주문 내역 조회, 프로필 수정, 배송지 관리 |
| 리뷰 | 구매 확인 후 리뷰 작성 가능 (구매하지 않은 상품은 작성 불가) |

### 관리자
| 기능 | 설명 |
|------|------|
| 대시보드 | 총 주문수, 총 매출, 대기 주문 수 통계 |
| 상품 관리 | 상품 등록/수정/삭제, 이미지 다중 업로드 (Cloudinary CDN) |
| 주문 관리 | 전체 주문 조회, 주문 상태 변경 (pending → paid → shipping → delivered) |
| 회원 관리 | 전체 회원 목록 조회 |

<br/>

## 4. 화면 구성

> 스크린샷을 추가해 주세요 (`docs/screenshots/` 폴더에 이미지를 넣고 아래 경로를 수정하세요)

| 홈 (랭킹/트렌딩) | 상품 목록 |
|:---:|:---:|
| ![home](docs/screenshots/home.png) | ![products](docs/screenshots/products.png) |

| 상품 상세 / 리뷰 | 장바구니 |
|:---:|:---:|
| ![detail](docs/screenshots/product-detail.png) | ![cart](docs/screenshots/cart.png) |

| 결제 (Toss Payments) | 마이페이지 |
|:---:|:---:|
| ![checkout](docs/screenshots/checkout.png) | ![mypage](docs/screenshots/mypage.png) |

| 관리자 대시보드 | 상품 관리 |
|:---:|:---:|
| ![admin](docs/screenshots/admin-dashboard.png) | ![admin-products](docs/screenshots/admin-products.png) |

<br/>

## 5. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client (Browser)                        │
│  Next.js 16 (App Router)  │  Zustand (전역 상태)                  │
│  Axios + Interceptor       │  Middleware (라우트 보호)              │
└────────────────────────────────────────────────────────────────-─┘
                    │ HTTPS (withCredentials: true)
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NestJS API Server (Railway)                    │
│                                                                   │
│  Auth │ Users │ Products │ Cart │ Orders │ Payments │ Reviews    │
│                                                                   │
│  JwtAuthGuard  │  RolesGuard  │  ValidationPipe                  │
└───────────────────────────┬─────────────────┬───────────────────┘
                            │                 │
              ┌─────────────▼─────┐    ┌──────▼──────────┐
              │  PostgreSQL (DB)   │    │  Cloudinary CDN  │
              │  TypeORM          │    │  (이미지 저장)    │
              └───────────────────┘    └─────────────────-┘
                                                │
                                    ┌───────────▼──────────┐
                                    │  Toss Payments API    │
                                    │  (결제 승인)           │
                                    └──────────────────────┘
```

### 인증 흐름

```
로그인 요청
    │
    ▼
NestJS: accessToken (15분) + refreshToken (7일, HttpOnly 쿠키) 발급
    │
    ▼
API 요청: Authorization: Bearer {accessToken}
    │
401 Unauthorized (accessToken 만료)
    │
    ▼
Axios Interceptor: POST /auth/refresh (쿠키의 refreshToken 자동 전송)
    │
    ▼
새 accessToken 발급 → 원래 요청 자동 재시도
```

<br/>

## 6. ERD

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│  users   │1────N │   orders     │1────N │ order_items  │
│──────────│       │──────────────│       │──────────────│
│ id       │       │ id (uuid)    │       │ id           │
│ name     │       │ user_id (FK) │  ┌───►│ order_id(FK) │
│ email    │       │ status       │  │    │ product_id   │
│ password │       │ recipient    │  │    │ productName  │◄─ 주문 시점
│ role     │       │ phone        │  │    │ price        │   가격/이름
│          │       │ address      │  │    │ quantity     │   스냅샷
│          │1───1  │ totalPrice   │  │    └──────────────┘
│          │       │ shippingFee  │  │
│          │       └──────┬───────┘  │
│          │              │1         │
│          │              ▼          │
│          │       ┌──────────────┐  │    ┌──────────────┐
│          │       │  payments    │  │    │   products   │
│          │       │──────────────│  │    │──────────────│
│          │       │ id           │  │    │ id (uuid)    │
│          │       │ order_id(FK) │  └────│ name         │
│          │       │ paymentKey   │       │ price        │
│          │       │ amount       │       │ stock        │
│          │       │ status       │       │ isActive     │
│          │       └──────────────┘       │ category     │
│          │                              │ viewCount    │
│          │1───1  ┌──────────────┐       │ salesCount   │
│          │       │    carts     │  ┌───►│              │
│          │       │──────────────│  │    └──────┬───────┘
│          │       │ id           │  │           │1
│          │       │ user_id (FK) │  │           ▼
│          │       └──────┬───────┘  │    ┌──────────────┐
│          │              │1         │    │product_images│
│          │              ▼          │    │──────────────│
│          │       ┌──────────────┐  │    │ id           │
│          │       │  cart_items  │  │    │ product_id   │
│          │       │──────────────│  │    │ url          │
│          │       │ id           │  │    │ isMain       │
│          │       │ cart_id (FK) │  │    │ sortOrder    │
│          │       │ product_id ──┼──┘    └──────────────┘
│          │       │ quantity     │
│          │       └──────────────┘
│          │
│          │1───N  ┌──────────────┐
│          │       │   reviews    │
│          │       │──────────────│
│          │       │ id           │
│          │       │ user_id (FK) │
│          │       │ product_id   │
│          │       │ rating (1~5) │
│          │       │ content      │
│          │       └──────────────┘
│          │
│          │1───N  ┌──────────────┐
│          │       │  addresses   │
│          │       │──────────────│
│          │       │ id           │
└──────────┘       │ user_id (FK) │
                   │ label        │
                   │ recipient    │
                   │ phone        │
                   │ address      │
                   │ isDefault    │
                   └──────────────┘
```

<br/>

## 7. API 명세

### 인증 (Auth)
| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| POST | `/auth/signup` | 회원가입 | - |
| POST | `/auth/login` | 로그인 | - |
| POST | `/auth/refresh` | 토큰 갱신 | RefreshToken (쿠키) |
| POST | `/auth/logout` | 로그아웃 | JWT |

### 상품 (Products)
| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| GET | `/products` | 상품 목록 (`?q=검색어&category=카테고리`) | - |
| GET | `/products/ranking` | 실시간 랭킹 (판매순 상위 10) | - |
| GET | `/products/trending` | 트렌딩 (조회순 상위 10) | - |
| GET | `/products/:id` | 상품 상세 (viewCount +1) | - |
| GET | `/products/admin` | 전체 상품 목록 (비활성 포함) | JWT + Admin |
| POST | `/products` | 상품 생성 | JWT + Admin |
| POST | `/products/upload` | 이미지 업로드 (Cloudinary) | JWT + Admin |
| PATCH | `/products/:id` | 상품 수정 | JWT + Admin |
| DELETE | `/products/:id` | 상품 삭제 | JWT + Admin |

### 장바구니 (Cart)
| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| GET | `/cart` | 장바구니 조회 (없으면 자동 생성) | JWT |
| POST | `/cart/items` | 상품 추가 (기존 상품이면 수량 증가) | JWT |
| PATCH | `/cart/items/:id` | 수량 변경 | JWT |
| DELETE | `/cart/items/:id` | 아이템 삭제 | JWT |

### 주문 (Orders)
| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| POST | `/orders` | 주문 생성 (장바구니 → 주문, 장바구니 자동 비움) | JWT |
| GET | `/orders/my` | 내 주문 목록 | JWT |
| GET | `/orders/:id` | 주문 상세 | JWT |
| GET | `/orders/admin/all` | 전체 주문 목록 | JWT + Admin |
| GET | `/orders/admin/stats` | 주문 통계 | JWT + Admin |
| PATCH | `/orders/:id/status` | 주문 상태 변경 | JWT + Admin |

### 결제 (Payments)
| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| POST | `/payments/confirm` | Toss Payments 결제 승인 | JWT |

### 리뷰 (Reviews)
| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| GET | `/reviews?productId=...` | 상품 리뷰 목록 | - |
| POST | `/reviews` | 리뷰 작성 (구매 확인 필요) | JWT |
| DELETE | `/reviews/:id` | 리뷰 삭제 (본인만) | JWT |

### 배송지 (Addresses)
| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| GET | `/addresses` | 내 배송지 목록 (기본 배송지 우선) | JWT |
| POST | `/addresses` | 배송지 추가 (최초 추가 시 자동으로 기본 설정) | JWT |
| PATCH | `/addresses/:id/default` | 기본 배송지 변경 | JWT |
| DELETE | `/addresses/:id` | 배송지 삭제 | JWT |

<br/>

## 8. 트러블슈팅

### 1. 배포 환경에서 Refresh Token 쿠키 전송 실패

**문제**

로컬에서는 정상 동작하던 자동 토큰 갱신 기능이 배포 환경(Vercel + Railway)에서 동작하지 않았습니다. 분석 결과, 프론트엔드(blueme.vercel.app)와 백엔드(Railway 도메인)가 서로 다른 도메인이어서 **SameSite 정책**에 의해 HttpOnly 쿠키가 전송되지 않는 것이 원인이었습니다.

**해결**

```typescript
// backend: 쿠키 설정
res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: isProduction,          // HTTPS 환경에서만 전송
  sameSite: isProduction ? 'none' : 'lax', // 크로스 도메인 허용
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// backend: CORS 설정
app.enableCors({
  origin: ['http://localhost:3000', 'https://blueme.vercel.app'],
  credentials: true,  // 쿠키 허용
});

// frontend: Axios 설정
const api = axios.create({
  withCredentials: true, // 쿠키 자동 전송
});
```

`sameSite: 'none'`은 반드시 `secure: true`와 함께 사용해야 합니다. 이를 통해 HTTPS 크로스 도메인 환경에서도 쿠키가 정상 전송됩니다.

---

### 2. Next.js Middleware에서 인증 쿠키 읽기 실패

**문제**

로그인 후 보호된 라우트에 접근할 때 미들웨어가 인증 여부를 확인하지 못해 로그인한 사용자가 로그인 페이지로 리다이렉트되는 문제가 발생했습니다.

Next.js 미들웨어는 **Edge Runtime**에서 실행되므로, HttpOnly 쿠키에 접근하는 것이 불가능합니다. 따라서 Refresh Token으로 인증 여부를 판별할 수 없었습니다.

**해결**

인증 상태 확인용 쿠키(`is_authenticated`, `user_role`)를 별도로 발급하는 방식으로 해결했습니다.

```typescript
// frontend: 로그인 성공 시 미들웨어용 쿠키 발급
const setAuthCookie = (role: string) => {
  document.cookie = `is_authenticated=1; path=/; max-age=${7 * 24 * 60 * 60}`;
  document.cookie = `user_role=${role}; path=/; max-age=${7 * 24 * 60 * 60}`;
};

// middleware.ts: 해당 쿠키로 인증 상태 확인
const isAuthenticated = request.cookies.get('is_authenticated')?.value === '1';
const userRole = request.cookies.get('user_role')?.value;
```

HttpOnly가 아닌 일반 쿠키이므로 보안상 민감한 정보(토큰 등)는 담지 않고, 인증 여부와 역할만 저장했습니다.

---

### 3. NestJS 동적 라우트 순서 문제

**문제**

`GET /products/ranking` 요청이 `GET /products/:id`로 매칭되어 "ranking"이라는 ID를 가진 상품을 조회하다가 404 에러가 발생했습니다.

**해결**

NestJS 컨트롤러에서 문자열 고정 경로는 동적 파라미터 경로보다 반드시 앞에 선언해야 합니다.

```typescript
@Controller('products')
export class ProductsController {
  @Get('ranking')   // ✅ 반드시 먼저 선언
  getRanking() { ... }

  @Get('trending')  // ✅ 반드시 먼저 선언
  getTrending() { ... }

  @Get(':id')       // 동적 라우트는 마지막에
  findOne(@Param('id') id: string) { ... }
}
```

---

### 4. Axios 동시 요청 시 토큰 중복 갱신 문제

**문제**

Access Token이 만료된 상태에서 여러 API 요청이 동시에 발생하면, 각 요청이 모두 `/auth/refresh`를 호출해 Refresh Token이 여러 번 재발급되고 앞서 발급된 토큰이 무효화되는 Race Condition이 발생했습니다.

**해결**

`isRefreshing` 플래그와 `failedQueue`를 사용해 갱신 요청을 단 한 번만 수행하도록 제어했습니다.

```typescript
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    if (isRefreshing) {
      // 갱신 중이면 큐에 추가하고 대기
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await api.post('/auth/refresh');
      // 대기 중인 요청들 일괄 재시도
      failedQueue.forEach(({ resolve }) => resolve(data.accessToken));
      return api(error.config); // 원래 요청 재시도
    } catch {
      failedQueue.forEach(({ reject }) => reject(error));
      logout();
    } finally {
      isRefreshing = false;
      failedQueue = [];
    }
  }
});
```

<br/>

## 9. 로컬 실행 방법

### 사전 요구사항
- Node.js 20+
- PostgreSQL

### 환경 변수 설정

**backend/.env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=shopping_mall

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

TOSS_SECRET_KEY=test_sk_...
TOSS_CLIENT_KEY=test_ck_...

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
PORT=4000
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
```

### 실행

```bash
# 1. 백엔드
cd backend
yarn
yarn start:dev

# 2. (선택) 샘플 데이터 삽입
yarn seed

# 3. 프론트엔드 (새 터미널)
cd frontend
yarn
yarn dev
```

브라우저에서 `http://localhost:3000` 접속
