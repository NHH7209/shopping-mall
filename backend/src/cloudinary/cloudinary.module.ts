/**
 * cloudinary.module.ts
 * Cloudinary 모듈. CloudinaryProvider(SDK 초기화)와 CloudinaryService(파일 업로드)를
 * 등록하고 다른 모듈에서 사용할 수 있도록 CloudinaryService를 export한다.
 */
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService], // 다른 모듈(ProductsModule 등)에서 쓸 수 있게 내보냄
})
export class CloudinaryModule {}
