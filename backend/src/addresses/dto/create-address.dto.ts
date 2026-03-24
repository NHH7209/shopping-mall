/**
 * create-address.dto.ts
 * 배송지 추가 요청 DTO. 라벨, 수령인, 연락처, 주소를 검증한다.
 */
import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  label: string;

  @IsString()
  recipient: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;
}
