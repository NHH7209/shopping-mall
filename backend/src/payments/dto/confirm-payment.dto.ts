/**
 * confirm-payment.dto.ts
 * 결제 승인 요청 DTO. Toss에서 전달받은 paymentKey, orderId, 결제 금액을 검증한다.
 */
import { IsString, IsNumber } from 'class-validator';

export class ConfirmPaymentDto {
  @IsString()
  paymentKey: string;

  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;
}
