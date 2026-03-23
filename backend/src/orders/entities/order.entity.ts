import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',       // 주문 완료 (결제 대기)
  PAID = 'paid',             // 결제 완료
  SHIPPING = 'shipping',     // 배송 중
  DELIVERED = 'delivered',   // 배송 완료
  CANCELLED = 'cancelled',   // 취소
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  // 배송지 정보
  @Column()
  recipient: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  memo: string;

  @Column()
  totalPrice: number;

  @Column({ default: 0 })
  shippingFee: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
