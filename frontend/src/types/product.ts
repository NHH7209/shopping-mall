export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  viewCount: number;  // 상품 상세 조회 횟수
  salesCount: number; // 판매 횟수
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}
