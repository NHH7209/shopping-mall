/**
 * create-product.dto.ts
 * 상품 생성 요청 DTO. 상품 기본 정보와 이미지 배열의 유효성을 검증한다.
 */
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  url: string;

  @IsNumber()
  sortOrder: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  images?: CreateProductImageDto[];
}
