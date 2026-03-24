/**
 * update-product.dto.ts
 * 상품 수정 요청 DTO. 모든 필드가 선택적이며, 전달된 필드만 부분 업데이트된다.
 * 이미지 배열이 포함되면 기존 이미지를 전부 교체한다.
 */
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductImageDto {
  @IsString()
  url: string;

  @IsNumber()
  sortOrder: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  images?: UpdateProductImageDto[];
}
