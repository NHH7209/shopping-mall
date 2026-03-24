/**
 * create-order.dto.ts
 * 주문 생성 요청 DTO. 수령인, 연락처, 배송지 주소, 배송 메모를 검증한다.
 */
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
