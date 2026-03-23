import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // GET /reviews?productId=xxx → 상품 리뷰 목록 (비로그인도 조회 가능)
  @Get()
  findByProduct(@Query('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  // POST /reviews → 리뷰 작성 (로그인 필요)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@GetUser('id') userId: number, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  // DELETE /reviews/:id → 리뷰 삭제 (본인만)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewsService.remove(userId, reviewId);
  }
}
