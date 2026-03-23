import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard) // 모든 엔드포인트에 로그인 필요
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // GET /cart → 내 장바구니 조회
  @Get()
  getCart(@GetUser('id') userId: number) {
    return this.cartService.getOrCreateCart(userId);
  }

  // POST /cart/items → 상품 담기
  @Post('items')
  addItem(@GetUser('id') userId: number, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  // PATCH /cart/items/:id → 수량 변경
  @Patch('items/:id')
  updateQuantity(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, quantity);
  }

  // DELETE /cart/items/:id → 아이템 삭제
  @Delete('items/:id')
  removeItem(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }
}
