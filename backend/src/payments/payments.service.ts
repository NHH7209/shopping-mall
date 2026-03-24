/**
 * payments.service.ts
 * 결제 비즈니스 로직. 주문 금액 검증, Toss Payments API 최종 승인 요청,
 * 결제 기록 저장, 주문 상태를 PAID로 변경하는 과정을 처리한다.
 */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async confirm(userId: number, dto: ConfirmPaymentDto): Promise<Payment> {
    // 주문 존재 여부 + 금액 검증
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId, user: { id: userId } },
    });
    if (!order) throw new BadRequestException('주문을 찾을 수 없습니다.');

    const expectedAmount = order.totalPrice + order.shippingFee;
    if (expectedAmount !== dto.amount) {
      throw new BadRequestException('결제 금액이 일치하지 않습니다.');
    }

    // 토스 서버에 최종 승인 요청
    // 시크릿 키를 Base64로 인코딩 (토스 API 규격)
    const encoded = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString('base64');
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey: dto.paymentKey,
        orderId: dto.orderId,
        amount: dto.amount,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new BadRequestException(error.message ?? '결제 승인에 실패했습니다.');
    }

    // 결제 기록 저장
    const payment = this.paymentRepository.create({
      order,
      paymentKey: dto.paymentKey,
      amount: dto.amount,
    });
    await this.paymentRepository.save(payment);

    // 주문 상태 → 결제완료
    order.status = OrderStatus.PAID;
    await this.orderRepository.save(order);

    return payment;
  }
}
