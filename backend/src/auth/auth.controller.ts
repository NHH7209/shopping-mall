import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: any) {
    const { accessToken, refreshToken, user } = await this.authService.signup(dto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException();
    const { accessToken, refreshToken: newRefreshToken, user } = await this.authService.refresh(refreshToken);
    this.setRefreshTokenCookie(res, newRefreshToken);
    return { accessToken, user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    await this.authService.logout((req.user as any).id);
    res.clearCookie('refresh_token');
    return { message: '로그아웃 되었습니다.' };
  }

  private setRefreshTokenCookie(res: any, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax', // 크로스 도메인(배포)에서는 none 필요
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
