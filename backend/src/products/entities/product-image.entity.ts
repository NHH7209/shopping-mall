/**
 * product-image.entity.ts
 * 상품 이미지 엔티티. 이미지 URL과 정렬 순서(sortOrder)를 저장한다.
 * sortOrder가 가장 낮은 이미지가 대표 이미지로 사용된다. 상품 삭제 시 CASCADE로 자동 삭제된다.
 */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
