/**
 * add-cart-item.dto.ts
 * 장바구니 상품 추가 요청 DTO. 상품 ID와 수량(최소 1)을 검증한다.
 */
import { IsString, IsInt, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
