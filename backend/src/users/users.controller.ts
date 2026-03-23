import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // [어드민] GET /users/admin → 전체 회원 목록
  @Get('admin')
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }
}
