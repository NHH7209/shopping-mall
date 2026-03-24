/**
 * product.ts
 * 상품 관련 TypeScript 타입 정의. Product와 ProductImage 인터페이스를 정의하며
 * 상품 목록, 상세, 장바구니, 주문 등 여러 컴포넌트에서 공유된다.
 */
export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  category: string | null;
  viewCount: number;  // 상품 상세 조회 횟수
  salesCount: number; // 판매 횟수
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}
