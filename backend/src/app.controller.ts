/**
 * app.controller.ts
 * 루트 컨트롤러. 서버 동작 확인용 기본 엔드포인트(GET /)를 제공한다.
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
