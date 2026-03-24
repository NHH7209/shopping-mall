/**
 * users.module.ts
 * 사용자 모듈. User 엔티티를 등록하고 UsersService를 외부 모듈(AuthModule 등)에서
 * 사용할 수 있도록 export한다.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
