/**
 * payments.controller.ts
 * 결제 컨트롤러. Toss Payments 최종 승인 요청(POST /payments/confirm)을 처리한다.
 * JWT 인증이 필수이며, 결제 금액 검증 후 승인한다.
 */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: '토스 결제 최종 승인' })
  @Post('confirm')
  confirm(@GetUser('id') userId: number, @Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirm(userId, dto);
  }
}
