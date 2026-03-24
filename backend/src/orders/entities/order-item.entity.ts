/**
 * order-item.entity.ts
 * 주문 아이템 엔티티. 주문 시점의 상품명·가격을 스냅샷으로 저장해
 * 나중에 상품 정보가 변경·삭제되어도 주문 내역이 보존된다.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  // 상품 참조 (삭제돼도 주문 기록은 남도록 nullable)
  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  product: Product | null;

  // 주문 당시 가격 스냅샷 — 나중에 상품 가격이 바뀌어도 주문 금액은 보존
  @Column()
  productName: string;

  @Column()
  price: number;

  @Column()
  quantity: number;
}
