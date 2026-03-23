import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // PATCH /users/profile → 프로필 수정 (이름, 비밀번호)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  // [어드민] GET /users/admin → 전체 회원 목록
  @Get('admin')
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }
}
