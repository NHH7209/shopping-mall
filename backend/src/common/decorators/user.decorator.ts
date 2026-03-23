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
