/**
 * cart.ts
 * 장바구니 관련 TypeScript 타입 정의. CartItem과 Cart 인터페이스를 정의한다.
 */
import { Product } from './product';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
}
