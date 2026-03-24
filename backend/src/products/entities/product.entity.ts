/**
 * product.entity.ts
 * 상품 엔티티. 이름, 설명, 가격, 재고, 활성 여부, 카테고리,
 * 조회수(viewCount), 판매수(salesCount), 이미지 목록을 관리한다.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity('products') // 이 클래스가 DB의 "products" 테이블이라고 선언
export class Product {
  // uuid 랜덤 고유 ID 자동 생성
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 상품 이름 컬럼
  @Column()
  name: string;

  // 상품 설명 컬럼 -> 설명글 없이 상품 등록 가능
  @Column('text', { nullable: true })
  description: string;

  // 상품 재고 컬럼 기본값: 0
  @Column({ default: 0 })
  stock: number;

  @Column()
  price: number;

  // 상품 활성 컬럼 기본값: true
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  category: string;

  // 상품 상세 페이지 조회 횟수 — 기본값 0
  // 누군가 /products/:id 에 들어올 때마다 +1 증가시켜서 인기도 측정에 사용
  @Column({ default: 0 })
  viewCount: number;

  // 판매 횟수 — 기본값 0
  // 주문이 완료될 때마다 +1 증가시켜서 실시간 랭킹 기준으로 사용
  @Column({ default: 0 })
  salesCount: number;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];

  // 상품 등록하는 순간 현재 시간으로 자동으로 저장
  @CreateDateColumn()
  createdAt: Date;

  // 상품 수정할 때마다 현재 시간으로 자동으로 업데이트
  @UpdateDateColumn()
  updatedAt: Date;
}
