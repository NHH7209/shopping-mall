import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders → 주문 생성
  @Post()
  createOrder(@GetUser('id') userId: number, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(userId, dto);
  }

  // GET /orders/my → 내 주문 목록
  @Get('my')
  getMyOrders(@GetUser('id') userId: number) {
    return this.ordersService.findMyOrders(userId);
  }

  // GET /orders/:id → 주문 상세
  @Get(':id')
  getOrder(@GetUser('id') userId: number, @Param('id') orderId: string) {
    return this.ordersService.findOne(userId, orderId);
  }

  // PATCH /orders/:id/cancel → 주문 취소
  @Patch(':id/cancel')
  cancelOrder(@GetUser('id') userId: number, @Param('id') orderId: string) {
    return this.ordersService.cancelOrder(userId, orderId);
  }

  // [어드민] GET /orders/admin/all → 전체 주문 목록
  @Get('admin/all')
  @UseGuards(RolesGuard)
  getAllOrders() {
    return this.ordersService.findAllAdmin();
  }

  // [어드민] GET /orders/admin/stats → 대시보드 통계
  @Get('admin/stats')
  @UseGuards(RolesGuard)
  getStats() {
    return this.ordersService.getStats();
  }

  // [어드민] PATCH /orders/:id/status → 주문 상태 변경
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  updateStatus(@Param('id') orderId: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(orderId, status);
  }
}
