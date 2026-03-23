import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  url: string;

  @IsBoolean()
  isMain: boolean;

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
