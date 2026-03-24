/**
 * cart-item.entity.ts
 * 장바구니 아이템 엔티티. 어떤 장바구니(Cart)에 어떤 상품(Product)이
 * 몇 개(quantity) 담겼는지를 저장한다.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  // 여러 아이템이 하나의 장바구니에 속함 (ManyToOne)
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn()
  cart: Cart;

  // 어떤 상품인지
  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @Column({ default: 1 })
  quantity: number;
}
