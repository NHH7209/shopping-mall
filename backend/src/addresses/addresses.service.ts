import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  findAll(userId: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
  }

  async create(userId: number, dto: CreateAddressDto): Promise<Address> {
    const count = await this.addressRepository.count({
      where: { user: { id: userId } },
    });

    const address = this.addressRepository.create({
      user: { id: userId } as any,
      ...dto,
      isDefault: count === 0, // 첫 번째 배송지는 자동으로 기본 설정
    });

    return this.addressRepository.save(address);
  }

  async setDefault(userId: number, addressId: number): Promise<Address[]> {
    // 기존 기본 배송지 해제
    await this.addressRepository.update(
      { user: { id: userId } },
      { isDefault: false },
    );
    // 선택한 배송지를 기본으로 설정
    await this.addressRepository.update(
      { id: addressId, user: { id: userId } },
      { isDefault: true },
    );

    return this.findAll(userId);
  }

  async remove(userId: number, addressId: number): Promise<void> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });
    if (!address) throw new NotFoundException('배송지를 찾을 수 없습니다.');
    await this.addressRepository.remove(address);
  }
}
