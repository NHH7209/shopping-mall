import { Product } from './product';

export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '주문완료',
  paid: '결제완료',
  shipping: '배송중',
  delivered: '배송완료',
  cancelled: '취소됨',
};

export interface OrderItem {
  id: number;
  product: Product | null;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  recipient: string;
  phone: string;
  address: string;
  memo: string;
  totalPrice: number;
  shippingFee: number;
  items: OrderItem[];
  createdAt: string;
}
