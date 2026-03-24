/**
 * reviews.service.ts
 * 리뷰 비즈니스 로직. 상품 리뷰 조회, 구매 여부 확인(Order 조회) 후 리뷰 작성,
 * 중복 리뷰 방지, 본인 리뷰 삭제를 담당한다.
 */
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // 상품 리뷰 목록 조회
  async findByProduct(productId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 리뷰 작성 (구매자만 가능)
  async create(userId: number, dto: CreateReviewDto): Promise<Review> {
    // 이미 리뷰를 작성했는지 확인
    const existing = await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: dto.productId } },
    });
    if (existing) throw new BadRequestException('이미 리뷰를 작성했습니다.');

    // 구매 여부 확인 — 해당 상품이 포함된 완료 주문이 있는지 체크
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('order.user.id = :userId', { userId })
      .andWhere('product.id = :productId', { productId: dto.productId })
      .getOne();

    if (!order) throw new BadRequestException('구매한 상품에만 리뷰를 작성할 수 있습니다.');

    const review = this.reviewRepository.create({
      user: { id: userId } as any,
      product: { id: dto.productId } as any,
      rating: dto.rating,
      content: dto.content,
    });

    return this.reviewRepository.save(review);
  }

  // 리뷰 삭제 (본인만)
  async remove(userId: number, reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    if (review.user.id !== userId) throw new ForbiddenException('본인 리뷰만 삭제할 수 있습니다.');

    await this.reviewRepository.remove(review);
  }
}
