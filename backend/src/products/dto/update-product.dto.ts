// 수정은 모든 필드가 선택값 (일부만 바꿀 수 있어야 하므로)
export class UpdateProductImageDto {
  url: string;
  isMain: boolean;
  sortOrder: number;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;        // 수정에서만 활성/비활성 변경 가능
  images?: UpdateProductImageDto[];
}
