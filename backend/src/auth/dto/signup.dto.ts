import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString({ message: '이름을 입력해주세요.' })
  name: string;

  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString({ message: '비밀번호를 입력해주세요.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;
}
