import { IsString, IsNumber } from 'class-validator';

export class ConfirmPaymentDto {
  @IsString()
  paymentKey: string;

  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;
}
