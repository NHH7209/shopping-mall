/**
 * address.entity.ts
 * 배송지 엔티티. 라벨(집/회사 등), 수령인, 연락처, 주소, 기본 배송지 여부를 저장한다.
 * 사용자 삭제 시 CASCADE로 함께 삭제된다.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  label: string; // 집, 회사 등

  @Column()
  recipient: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
