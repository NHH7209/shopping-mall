import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.');
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
    await this.usersRepository.update(id, { refreshToken });
  }

  async updateProfile(id: number, dto: UpdateUserDto): Promise<{ id: number; name: string; email: string }> {
    const user = await this.findById(id);
    if (!user) throw new BadRequestException('유저를 찾을 수 없습니다.');

    if (dto.newPassword) {
      if (!dto.currentPassword) throw new BadRequestException('현재 비밀번호를 입력해주세요.');
      const valid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!valid) throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
      user.password = await bcrypt.hash(dto.newPassword, 10);
    }

    if (dto.name) user.name = dto.name;

    const saved = await this.usersRepository.save(user);
    return { id: saved.id, name: saved.name, email: saved.email };
  }

  // [어드민] 전체 회원 목록
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }
}
