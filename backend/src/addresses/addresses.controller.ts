import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.addressesService.findAll(userId);
  }

  @Post()
  create(@GetUser('id') userId: number, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(userId, dto);
  }

  @Patch(':id/default')
  setDefault(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressesService.setDefault(userId, id);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressesService.remove(userId, id);
  }
}
