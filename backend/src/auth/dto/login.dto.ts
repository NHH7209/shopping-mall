/**
 * login.dto.ts
 * 로그인 요청 DTO. 이메일과 비밀번호의 형식 유효성을 검증한다.
 */
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
