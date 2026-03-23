import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // 유저의 장바구니 조회 (없으면 새로 생성)
  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } as any });
      await this.cartRepository.save(cart);
      cart.items = [];
    }

    return cart;
  }

  // 장바구니에 상품 추가 (이미 있으면 수량만 증가)
  async addItem(userId: number, dto: AddCartItemDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    // 이미 장바구니에 있는 상품인지 확인
    const existingItem = cart.items.find(
      (item) => item.product.id === dto.productId,
    );

    if (existingItem) {
      // 있으면 수량만 증가
      existingItem.quantity += dto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // 없으면 새로 추가
      const newItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getOrCreateCart(userId);
  }

  // 장바구니 아이템 수량 변경
  async updateItemQuantity(
    userId: number,
    itemId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다.');

    item.quantity = quantity;
    await this.cartItemRepository.save(item);

    return this.getOrCreateCart(userId);
  }

  // 장바구니 아이템 삭제
  async removeItem(userId: number, itemId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('장바구니 아이템을 찾을 수 없습니다.');

    await this.cartItemRepository.remove(item);

    return this.getOrCreateCart(userId);
  }
}
