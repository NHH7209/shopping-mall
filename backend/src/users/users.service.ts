import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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

  // [어드민] 전체 회원 목록
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }
}
