/**
 * user.decorator.ts
 * 커스텀 파라미터 데코레이터. JWT 인증 후 req.user에 저장된 사용자 정보를
 * 컨트롤러 메서드 파라미터로 바로 주입한다. (@GetUser() 또는 @GetUser('id') 형태로 사용)
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// @GetUser() → req.user 전체 반환
// @GetUser('id') → req.user.id 반환
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);
