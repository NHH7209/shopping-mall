/**
 * cart.entity.ts
 * 장바구니 엔티티. 사용자 1명당 하나(OneToOne)의 장바구니를 가지며,
 * 여러 CartItem을 포함한다.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  // 유저 1명당 장바구니 1개 (OneToOne)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  // 장바구니 안에 여러 아이템 (OneToMany)
  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
