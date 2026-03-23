import { IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  recipient: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  memo?: string;
}
