import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /payments/confirm → 토스 결제 최종 승인
  @Post('confirm')
  confirm(@GetUser('id') userId: number, @Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirm(userId, dto);
  }
}
