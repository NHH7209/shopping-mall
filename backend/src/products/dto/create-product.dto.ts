// 이미지 하나의 데이터 형태를 정의하는 DTO
export class CreateProductImageDto {
  url: string;       // 이미지 URL
  isMain: boolean;   // 대표 이미지 여부
  sortOrder: number; // 정렬 순서
}

// 상품 생성 요청 시 받을 데이터 형태를 정의하는 DTO
// DTO(Data Transfer Object): API 요청/응답 데이터의 구조를 타입으로 정의한 클래스
export class CreateProductDto {
  name: string;
  description?: string; // ?는 선택값 — 없어도 됨
  price: number;
  stock: number;
  images?: CreateProductImageDto[];
}
