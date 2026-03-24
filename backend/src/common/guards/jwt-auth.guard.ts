/**
 * jwt-auth.guard.ts
 * JWT 인증 가드. Passport의 'jwt' 전략을 사용해 요청 헤더의 Bearer 토큰을 검증한다.
 * @UseGuards(JwtAuthGuard)로 적용하면 인증된 사용자만 해당 엔드포인트에 접근할 수 있다.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
