/**
 * auth.module.ts
 * 인증 모듈. JWT, Passport, UsersModule을 조합해 회원가입/로그인/토큰 갱신/로그아웃
 * 기능을 제공한다. JwtStrategy를 통해 전역 토큰 검증 전략을 등록한다.
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
