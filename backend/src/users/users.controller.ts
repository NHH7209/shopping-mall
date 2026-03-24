/**
 * users.controller.ts
 * 사용자 컨트롤러. 프로필 수정(PATCH /users/profile)과
 * 관리자용 전체 회원 목록 조회(GET /users/admin)를 처리한다.
 */
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '프로필 수정 (이름, 비밀번호)' })
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @ApiOperation({ summary: '[어드민] 전체 회원 목록' })
  @Get('admin')
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }
}
