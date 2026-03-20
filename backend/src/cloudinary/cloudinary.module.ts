import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService], // 다른 모듈(ProductsModule 등)에서 쓸 수 있게 내보냄
})
export class CloudinaryModule {}
