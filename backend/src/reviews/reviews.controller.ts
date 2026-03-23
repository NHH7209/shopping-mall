import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: '상품 리뷰 목록 조회' })
  @ApiQuery({ name: 'productId', required: true, description: '상품 ID' })
  @Get()
  findByProduct(@Query('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @ApiOperation({ summary: '리뷰 작성' })
  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@GetUser('id') userId: number, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @ApiOperation({ summary: '리뷰 삭제 (본인만)' })
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewsService.remove(userId, reviewId);
  }
}
