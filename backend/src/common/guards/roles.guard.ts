/**
 * roles.guard.ts
 * 역할 기반 접근 제어 가드. 요청한 사용자가 ADMIN 역할인지 확인하고,
 * 아닌 경우 ForbiddenException을 발생시켜 관리자 전용 엔드포인트를 보호한다.
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (req.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }
    return true;
  }
}
