import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
  ) {}

  // 주문 생성 — 장바구니 → 주문으로 변환
  async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getOrCreateCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('장바구니가 비어있습니다.');
    }

    // 총 금액 계산
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const shippingFee = totalPrice >= 30000 ? 0 : 3000;

    // 주문 생성
    const order = this.orderRepository.create({
      user: { id: userId } as any,
      recipient: dto.recipient,
      phone: dto.phone,
      address: dto.address,
      memo: dto.memo,
      totalPrice,
      shippingFee,
    });
    await this.orderRepository.save(order);

    // 장바구니 아이템 → 주문 아이템으로 복사 (가격 스냅샷)
    const orderItems = cart.items.map((cartItem) =>
      this.orderItemRepository.create({
        order,
        product: cartItem.product,
        productName: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
      }),
    );
    await this.orderItemRepository.save(orderItems);

    // 장바구니 비우기
    for (const item of cart.items) {
      await this.cartService.removeItem(userId, item.id);
    }

    return this.findOne(userId, order.id);
  }

  // 내 주문 목록 조회
  async findMyOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
      order: { createdAt: 'DESC' },
    });
  }

  // 주문 상세 조회
  async findOne(userId: number, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
    });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    return order;
  }

  // [어드민] 전체 주문 목록
  async findAllAdmin(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  // [어드민] 주문 상태 변경
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');
    order.status = status;
    return this.orderRepository.save(order);
  }

  // [어드민] 대시보드용 통계
  async getStats(): Promise<{ totalOrders: number; totalRevenue: number; pendingOrders: number }> {
    const orders = await this.orderRepository.find();
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== OrderStatus.CANCELLED)
      .reduce((sum, o) => sum + o.totalPrice + o.shippingFee, 0);
    const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING).length;
    return { totalOrders, totalRevenue, pendingOrders };
  }
}
