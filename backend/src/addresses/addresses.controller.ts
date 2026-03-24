/**
 * addresses.controller.ts
 * 배송지 컨트롤러. 배송지 목록 조회, 추가, 기본 배송지 설정, 삭제
 * 엔드포인트를 처리한다. JWT 인증이 필수이다.
 */
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@ApiTags('Addresses')
@ApiBearerAuth('access-token')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({ summary: '내 배송지 목록 조회' })
  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.addressesService.findAll(userId);
  }

  @ApiOperation({ summary: '배송지 추가' })
  @Post()
  create(@GetUser('id') userId: number, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(userId, dto);
  }

  @ApiOperation({ summary: '기본 배송지 설정' })
  @Patch(':id/default')
  setDefault(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressesService.setDefault(userId, id);
  }

  @ApiOperation({ summary: '배송지 삭제' })
  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressesService.remove(userId, id);
  }
}
