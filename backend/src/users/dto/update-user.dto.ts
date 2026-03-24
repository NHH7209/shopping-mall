/**
 * update-user.dto.ts
 * 프로필 수정 요청 DTO. 이름, 현재 비밀번호, 새 비밀번호를 선택적으로 받는다.
 */
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string;
}
