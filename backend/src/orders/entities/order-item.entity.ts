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
