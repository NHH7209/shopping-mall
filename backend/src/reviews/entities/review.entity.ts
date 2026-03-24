/**
 * review.entity.ts
 * 리뷰 엔티티. 사용자와 상품을 참조하며 별점(1~5)과 내용을 저장한다.
 * 구매자만 작성 가능하며, 사용자 또는 상품 삭제 시 CASCADE로 함께 삭제된다.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @Column({ type: 'int' })
  rating: number; // 1 ~ 5

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
