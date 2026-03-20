import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductImage } from './entities/product-image.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), CloudinaryModule], //  Product 엔티티를 쓰곘다고 등록 / NestJS가 Product 엔터티 Repository를 만들어줘
  controllers: [ProductsController], // API 엔드포인트 담당
  providers: [ProductsService], // 비지니스 로직 담당
  exports: [ProductsService], // 다른 모듈에서 ProductService를 쓸 수 있게 내보냄
})
export class ProductsModule {}
