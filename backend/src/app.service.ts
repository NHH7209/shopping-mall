/**
 * app.service.ts
 * 루트 서비스. AppController에서 사용하는 기본 비즈니스 로직을 제공한다.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
