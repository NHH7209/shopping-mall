/**
 * cloudinary.provider.ts
 * Cloudinary 커스텀 프로바이더. 환경변수에서 API 키를 읽어 Cloudinary SDK를 초기화하고
 * 'CLOUDINARY' 토큰으로 NestJS DI 컨테이너에 등록한다.
 */
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

// NestJS의 커스텀 프로바이더 — Cloudinary SDK를 의존성 주입으로 쓸 수 있게 등록
// 'CLOUDINARY'라는 토큰으로 등록해두면 어디서든 @Inject('CLOUDINARY')로 주입 가능
export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    // Cloudinary SDK 초기화 — .env에서 값을 읽어서 설정
    return cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  },
};
