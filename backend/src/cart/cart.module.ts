/**
 * cart.module.ts
 * 장바구니 모듈. Cart, CartItem, Product 엔티티를 등록하고
 * CartService를 OrdersModule 등 외부 모듈에서 사용할 수 있도록 export한다.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // 나중에 OrdersModule에서 사용할 수 있게 export
})
export class CartModule {}
