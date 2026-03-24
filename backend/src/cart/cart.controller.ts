/**
 * cart.controller.ts
 * 장바구니 컨트롤러. 장바구니 조회, 상품 추가, 수량 변경, 아이템 삭제
 * 엔드포인트를 처리한다. JWT 인증이 필수이다.
 */
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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@ApiTags('Cart')
@ApiBearerAuth('access-token')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: '내 장바구니 조회' })
  @Get()
  getCart(@GetUser('id') userId: number) {
    return this.cartService.getOrCreateCart(userId);
  }

  @ApiOperation({ summary: '장바구니에 상품 담기' })
  @Post('items')
  addItem(@GetUser('id') userId: number, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @ApiOperation({ summary: '장바구니 아이템 수량 변경' })
  @Patch('items/:id')
  updateQuantity(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, quantity);
  }

  @ApiOperation({ summary: '장바구니 아이템 삭제' })
  @Delete('items/:id')
  removeItem(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }
}
