/**
 * create-review.dto.ts
 * 리뷰 작성 요청 DTO. 상품 ID, 별점(1~5), 리뷰 내용을 검증한다.
 */
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  content: string;
}
