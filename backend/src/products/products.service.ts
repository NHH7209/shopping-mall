import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // ProductImage 레포지토리도 주입 — 이미지 생성/삭제 시 사용
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  // 고객용: 활성 상품 목록 (검색어, 카테고리 필터 지원)
  async findAll(q?: string, category?: string): Promise<Product[]> {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isActive = :isActive', { isActive: true });

    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

    if (q) {
      qb.andWhere('product.name ILIKE :q', { q: `%${q}%` });
    }

    return qb.orderBy('product.createdAt', 'DESC').getMany();
  }

  // 어드민용: 비활성 상품 포함 전체 목록
  async findAllAdmin(): Promise<Product[]> {
    return this.productRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['images'],
    });
  }

  // 고객용: 상품 상세 조회 + viewCount 증가
  async findOne(id: string): Promise<Product | null> {
    // increment(엔티티, 조건, 필드명) — viewCount를 1 올리는 TypeORM 헬퍼
    await this.productRepository.increment({ id }, 'viewCount', 1);
    return this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  // 내부/어드민용: viewCount 증가 없이 단순 조회
  async findOneById(id: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  // 실시간 랭킹 — salesCount 기준 내림차순 상위 10개
  async findRanking(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      order: { salesCount: 'DESC' },
      take: 10,
      relations: ['images'],
    });
  }

  // 요즘 주목 받는 상품 — viewCount 기준 내림차순 상위 10개
  async findTrending(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      order: { viewCount: 'DESC' },
      take: 10,
      relations: ['images'],
    });
  }

  // 상품 생성
  async create(dto: CreateProductDto): Promise<Product> {
    // 1단계: 상품 기본 정보 저장
    // productRepository.create()는 객체를 만들기만 하고 DB에 저장하지 않음
    // productRepository.save()가 실제로 INSERT 쿼리를 실행함
    const product = this.productRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
    });
    const savedProduct = await this.productRepository.save(product);

    // 2단계: 이미지 URL이 있으면 product_images 테이블에 함께 저장
    // product: savedProduct 로 FK(외래키)를 연결함
    if (dto.images?.length) {
      const images = dto.images.map((img) =>
        this.productImageRepository.create({
          url: img.url,
          isMain: img.isMain,
          sortOrder: img.sortOrder,
          product: savedProduct,
        }),
      );
      await this.productImageRepository.save(images);
    }

    // 이미지 포함해서 다시 조회 후 반환
    return this.findOneById(savedProduct.id) as Promise<Product>;
  }

  // 상품 수정
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    // undefined가 아닌 필드만 추려서 UPDATE — 보낸 값만 바꿈
    // 스프레드(...)와 && 조합으로 조건부 업데이트
    await this.productRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.category !== undefined && { category: dto.category }),
    });

    // 이미지 배열이 전달됐으면 기존 이미지를 전부 지우고 새로 교체
    if (dto.images !== undefined) {
      // 기존 이미지 삭제 — product FK 조건으로 해당 상품 이미지만 삭제
      await this.productImageRepository.delete({ product: { id } });

      if (dto.images.length > 0) {
        const images = dto.images.map((img) =>
          this.productImageRepository.create({
            url: img.url,
            isMain: img.isMain,
            sortOrder: img.sortOrder,
            product: { id } as Product, // id만 있는 부분 참조로 FK 연결
          }),
        );
        await this.productImageRepository.save(images);
      }
    }

    return this.findOneById(id) as Promise<Product>;
  }

  // 상품 삭제 — product_images는 onDelete: CASCADE로 자동 삭제됨
  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
