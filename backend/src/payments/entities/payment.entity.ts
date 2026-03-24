/**
 * payment.entity.ts
 * 결제 엔티티. Toss가 발급한 paymentKey, 결제 금액, 상태를 저장하며
 * Order와 1:1 관계를 갖는다.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  // 토스가 발급하는 결제 고유 키
  @Column({ unique: true })
  paymentKey: string;

  @Column()
  amount: number;

  @Column({ default: 'DONE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
