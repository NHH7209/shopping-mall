import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 허용 — 브라우저에서 직접 API를 호출하는 클라이언트 컴포넌트를 위해 필요
  // 서버 컴포넌트는 Next.js 서버가 호출하므로 CORS 제한이 없지만
  // 'use client' 컴포넌트는 브라우저가 직접 호출하므로 허용해줘야 함
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
